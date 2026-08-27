import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AdminIdeasTable from "@/components/admin/AdminIdeasTable";
import { getStoredIdeas } from "@/lib/data/groups";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas — Build Tamil Nadu Admin",
};

interface AdminIdeasPageProps {
  searchParams: Promise<{ status?: string; page?: string; district?: string }>;
}

export default async function AdminIdeasPage({ searchParams }: AdminIdeasPageProps) {
  const { status, page: pageStr, district } = await searchParams;
  const page = parseInt(pageStr || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let ideas: any[] = [];
  let count = 0;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceClient();
      let query = supabase
        .from("ideas")
        .select(
          `
          id,
          public_id,
          title,
          district,
          status,
          visibility,
          created_at,
          categories (name, slug),
          users (email)
          `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq("status", status);
      }

      if (district) {
        query = query.ilike("district", `%${district}%`);
      }

      const res = await query;
      if (res.data && res.data.length > 0) {
        ideas = res.data;
        count = res.count ?? res.data.length;
      }
    } catch (err) {
      console.error("Error loading ideas from DB:", err);
    }
  }

  // Fallback to in-memory store if DB has no ideas yet
  if (ideas.length === 0) {
    let allStored = getStoredIdeas();

    if (status) {
      allStored = allStored.filter((i) => i.status.toUpperCase() === status.toUpperCase());
    }

    if (district) {
      allStored = allStored.filter((i) => i.district.toLowerCase().includes(district.toLowerCase()));
    }

    count = allStored.length;
    const paginated = allStored.slice(offset, offset + limit);

    ideas = paginated.map((i) => ({
      id: i.id,
      public_id: i.public_id,
      title: i.title,
      district: i.district,
      status: i.status,
      visibility: i.status === "PUBLIC" ? "PUBLIC" : "PRIVATE",
      created_at: i.created_at,
      categories: {
        name: i.category_name,
        slug: i.category_id,
      },
      users: {
        email: i.submitter_email || "citizen@tamilnadu.in",
      },
    }));
  }

  return (
    <div className="p-8 max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Citizen Submissions</span>
            <span className="text-xs text-[#64748b]">• {count} Registered Ideas</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">Citizen Ideas Registry</h1>
          <p className="text-[#64748b] text-[14px]">
            {count} total {count === 1 ? "submission" : "submissions"} {district ? `in ${district}` : ""}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "SUBMITTED" },
          { label: "Under Review", value: "UNDER_REVIEW" },
          { label: "Approved", value: "APPROVED" },
          { label: "Public", value: "PUBLIC" },
          { label: "Shortlisted", value: "SHORTLISTED" },
          { label: "Rejected", value: "REJECTED" },
          { label: "Duplicate", value: "DUPLICATE" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={
              tab.value
                ? `/admin/ideas?status=${tab.value}${district ? `&district=${encodeURIComponent(district)}` : ""}`
                : `/admin/ideas${district ? `?district=${encodeURIComponent(district)}` : ""}`
            }
            className={`btn btn-sm ${
              status === tab.value || (!status && tab.value === "")
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <AdminIdeasTable ideas={ideas} total={count} page={page} limit={limit} />
    </div>
  );
}
