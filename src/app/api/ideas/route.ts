import { NextRequest, NextResponse } from "next/server";
import { IdeaSubmissionSchema } from "@/lib/validations/idea";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { addStoredIdea, getPublicStoredIdeas } from "@/lib/data/groups";

// Simple string sanitizer to prevent XSS / script injection
function sanitizeString(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// Rate limiting: simple in-memory store
const submissionTracker = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown-ip";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const tracker = submissionTracker.get(key);

  if (!tracker || now > tracker.resetAt) {
    submissionTracker.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return false;
  }

  if (tracker.count >= 10) {
    return true;
  }

  tracker.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { message: "You've submitted too many ideas recently. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await req.json();
    const validation = IdeaSubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Please check your submission details and try again.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Sanitize user-submitted inputs
    const rawTitle =
      data.problem_option === "other"
        ? data.problem_custom || "Custom citizen problem"
        : data.problem_option;

    const title = sanitizeString(rawTitle).slice(0, 300);
    const description = sanitizeString(data.description).slice(0, 2000);
    const solutionDescription = sanitizeString(data.solution_description).slice(0, 2000);
    const district = sanitizeString(data.district).slice(0, 100);
    const name = sanitizeString(data.name).slice(0, 100);
    const email = data.email.trim().toLowerCase();

    // Save in shared store
    const storedIdea = addStoredIdea({
      title,
      description,
      district,
      category_id: data.category_id,
      submitter_email: email,
      status: "SUBMITTED",
    });

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: true,
          public_id: storedIdea.public_id,
          message: "Your idea has been recorded successfully!",
        },
        { status: 201 }
      );
    }

    const supabase = createServiceClient();

    // 1. Find or create user by email
    let userId: string | null = null;

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email,
          name: name || null,
          district,
          consent: data.consent,
        })
        .select("id")
        .single();

      if (userError) {
        console.error("User creation error:", userError);
      } else {
        userId = newUser?.id || null;
      }
    }

    // 2. Find category by slug
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", data.category_id)
      .maybeSingle();

    // 3. Insert idea strictly with default SUBMITTED and PRIVATE status
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .insert({
        user_id: userId,
        category_id: category?.id || null,
        title,
        description: description || null,
        solution_description: solutionDescription || null,
        district,
        status: "SUBMITTED",
        visibility: "PRIVATE",
        admin_notes: null,
        similarity_group_id: null,
        public_id: storedIdea.public_id,
      })
      .select("id, public_id")
      .single();

    if (ideaError || !idea) {
      console.error("Idea creation error:", ideaError);
    }

    // 4. Record email event
    if (userId) {
      try {
        await supabase.from("email_events").insert({
          user_id: userId,
          type: "CONFIRMATION",
          status: "PENDING",
        });
      } catch {
        // Non-critical audit insert failure
      }
    }

    return NextResponse.json(
      {
        success: true,
        public_id: idea?.public_id || storedIdea.public_id,
        message: "Your idea has been recorded successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Idea submission error:", error);
    return NextResponse.json(
      {
        message:
          "Something went wrong while submitting your idea. Your information hasn't been lost. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = sanitizeString(searchParams.get("category")?.toLowerCase());
    const district = sanitizeString(searchParams.get("district")?.toLowerCase());
    const search = sanitizeString(searchParams.get("search")?.toLowerCase().trim());
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const offset = (page - 1) * limit;

    let publicIdeas: any[] = [];
    let totalCount = 0;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();

        // STRICT PUBLIC QUERY: NEVER select email, user_id, admin_notes, or PII
        let query = supabase
          .from("ideas")
          .select(
            `
            id,
            public_id,
            title,
            description,
            district,
            status,
            visibility,
            created_at,
            categories (
              name,
              slug,
              icon,
              color
            )
            `,
            { count: "exact" }
          )
          .or("visibility.eq.PUBLIC,status.eq.PUBLIC,status.eq.APPROVED,status.eq.SHORTLISTED")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (category) {
          query = query.eq("categories.slug", category);
        }

        if (district) {
          query = query.ilike("district", `%${district}%`);
        }

        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,public_id.ilike.%${search}%`);
        }

        const { data: dbIdeas, count, error } = await query;

        if (dbIdeas && !error && dbIdeas.length > 0) {
          publicIdeas = dbIdeas.map((i: any) => ({
            id: i.id,
            public_id: i.public_id,
            title: i.title,
            description: i.description,
            district: i.district,
            created_at: i.created_at,
            categories: i.categories || {
              name: "General",
              slug: "general",
              icon: "💡",
              color: "#e85d26",
            },
          }));
          totalCount = count || dbIdeas.length;
        }
      } catch (dbErr) {
        console.warn("Supabase public ideas query fallback:", dbErr);
      }
    }

    // Fallback to shared in-memory store if DB has no public ideas yet
    if (publicIdeas.length === 0) {
      let filtered = getPublicStoredIdeas();

      if (category) {
        filtered = filtered.filter(
          (i) => i.category_id.toLowerCase() === category || i.category_name.toLowerCase() === category
        );
      }

      if (district) {
        filtered = filtered.filter((i) => i.district.toLowerCase().includes(district));
      }

      if (search) {
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(search) ||
            i.public_id.toLowerCase().includes(search) ||
            (i.description && i.description.toLowerCase().includes(search)) ||
            i.district.toLowerCase().includes(search)
        );
      }

      totalCount = filtered.length;
      const paginated = filtered.slice(offset, offset + limit);

      publicIdeas = paginated.map((i) => ({
        id: i.id,
        public_id: i.public_id,
        title: i.title,
        description: i.description || null,
        district: i.district,
        created_at: i.created_at,
        categories: {
          name: i.category_name,
          slug: i.category_id,
          icon: "💡",
          color: i.category_color,
        },
      }));
    }

    return NextResponse.json({
      ideas: publicIdeas,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    console.error("Ideas fetch error:", error);
    return NextResponse.json({
      ideas: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    });
  }
}
