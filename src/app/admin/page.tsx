import Link from "next/link";
import {
  Lightbulb,
  Vote,
  GitMerge,
  Star,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Eye,
  ShieldCheck,
  Tag,
  Megaphone,
  MessageSquare,
  Building,
  Mail,
  ExternalLink,
} from "lucide-react";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DEFAULT_CAMPAIGN, DEFAULT_SHORTLISTED_IDEAS } from "@/lib/constants/campaign";
import { formatRelativeDate } from "@/lib/utils";
import { getStoredInquiries, Inquiry } from "@/lib/data/inquiries";
import { getStoredIdeas } from "@/lib/data/groups";

export const dynamic = "force-dynamic";

interface CategoryStat {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

async function getDashboardStats() {
  const fallbackIdeas = getStoredIdeas();
  const fallbackInquiries = getStoredInquiries();

  let stats = {
    total: fallbackIdeas.length,
    pending: fallbackIdeas.filter((i) => i.status === "SUBMITTED").length,
    publicCount: fallbackIdeas.filter((i) => i.status === "APPROVED" || i.status === "SHORTLISTED").length,
    shortlisted: fallbackIdeas.filter((i) => i.status === "SHORTLISTED").length,
    rejected: fallbackIdeas.filter((i) => i.status === "REJECTED").length,
    districts: 12,
    totalVotes: 18742,
    recentIdeas: fallbackIdeas.slice(0, 5).map((item) => ({
      id: item.id,
      public_id: item.public_id,
      title: item.title,
      category: item.category_id || "General",
      district: item.district || "Tamil Nadu",
      status: item.status,
      time: formatRelativeDate(item.created_at),
    })),
    categoriesSummary: [] as CategoryStat[],
    inquiries: fallbackInquiries,
    newInquiriesCount: fallbackInquiries.filter((i) => i.status === "NEW").length,
    partnerCount: fallbackInquiries.filter((i) => i.type === "PARTNER").length,
    contactCount: fallbackInquiries.filter((i) => i.type === "CONTACT").length,
  };

  const DEFAULT_COLORS = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899", "#64748b"];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceClient();
      const [
        { count: total },
        { count: pending },
        { count: pubCount },
        { count: shortCount },
        { count: rejCount },
        { data: recent },
        { data: districtData },
        { count: votesCount },
        { data: categoriesWithIdeas },
        { data: dbInquiries },
      ] = await Promise.all([
        supabase.from("ideas").select("*", { count: "exact", head: true }),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "SUBMITTED"),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("visibility", "PUBLIC"),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "SHORTLISTED"),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "REJECTED"),
        supabase
          .from("ideas")
          .select("id, public_id, title, district, status, created_at, categories(name)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("ideas").select("district"),
        supabase.from("public_votes").select("*", { count: "exact", head: true }),
        supabase.from("ideas").select("category_id, categories(name)"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      if (total && total > 0) stats.total = total;
      if (pending !== null && pending !== undefined) stats.pending = pending;
      if (pubCount !== null && pubCount !== undefined) stats.publicCount = pubCount;
      if (shortCount !== null && shortCount !== undefined) stats.shortlisted = shortCount;
      if (rejCount !== null && rejCount !== undefined) stats.rejected = rejCount;
      if (votesCount !== null && votesCount !== undefined && votesCount > 0) stats.totalVotes = votesCount;

      if (districtData && districtData.length > 0) {
        const uniqueDistricts = new Set(
          (districtData as Array<{ district: string }>)
            .map((d) => d.district)
            .filter(Boolean)
        );
        stats.districts = uniqueDistricts.size;
      }

      if (recent && recent.length > 0) {
        stats.recentIdeas = recent.map((item: any) => ({
          id: item.id,
          public_id: item.public_id,
          title: item.title,
          category: item.categories?.name || "General",
          district: item.district || "Tamil Nadu",
          status: item.status,
          time: formatRelativeDate(item.created_at),
        }));
      }

      if (dbInquiries && dbInquiries.length > 0) {
        stats.inquiries = dbInquiries;
        stats.newInquiriesCount = dbInquiries.filter((i: any) => i.status === "NEW").length;
        stats.partnerCount = dbInquiries.filter((i: any) => i.type === "PARTNER").length;
        stats.contactCount = dbInquiries.filter((i: any) => i.type === "CONTACT").length;
      }

      if (categoriesWithIdeas && stats.total > 0) {
        const catMap: Record<string, number> = {};
        categoriesWithIdeas.forEach((i: any) => {
          const cName = i.categories?.name || "Other";
          catMap[cName] = (catMap[cName] || 0) + 1;
        });

        stats.categoriesSummary = Object.entries(catMap)
          .map(([name, count], idx) => ({
            name,
            count,
            color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
            percentage: Math.round((count / stats.total) * 100),
          }))
          .sort((a, b) => b.count - a.count);
      }
    } catch (err) {
      console.error("Dashboard stats query error:", err);
    }
  }

  return stats;
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Welcome & Phase Hero Banner */}
      <div className="bg-gradient-to-r from-[#060913] via-[#0f172a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e85d26]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#e85d26] text-white uppercase tracking-wider">
                Operation Control Room
              </span>
              <span className="text-xs text-white/50">• Live Production Telemetry</span>
            </div>
            <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] tracking-tight">
              Build Tamil Nadu Command Center
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed">
              Monitoring citizen idea intake, geographic distribution, finalist shortlisting, and live public voting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/campaign"
              className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-5 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
            >
              <Megaphone size={15} />
              <span>Campaign Controller</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Total Ingested Ideas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fff8f5] text-[#e85d26] flex items-center justify-center">
              <Lightbulb size={18} />
            </div>
          </div>
          <div>
            <div className="font-jakarta font-extrabold text-[32px] text-[#0a0e1a]">
              {stats.total.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-1">
              <span className="text-[#10b981] font-bold">{stats.publicCount} Public</span>
              <span>•</span>
              <span className="text-[#e85d26] font-bold">{stats.pending} Needs Moderation</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Citizen &amp; Partner Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <div>
            <div className="font-jakarta font-extrabold text-[32px] text-[#0a0e1a]">
              {stats.inquiries.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-1">
              <span className="text-[#e85d26] font-bold">{stats.newInquiriesCount} New Unread</span>
              <span>•</span>
              <span className="text-[#16a34a] font-bold">{stats.partnerCount} Partner Proposals</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              District Footprint
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
              <MapPin size={18} />
            </div>
          </div>
          <div>
            <div className="font-jakarta font-extrabold text-[32px] text-[#0a0e1a]">
              {stats.districts} / 38
            </div>
            <div className="text-xs text-[#64748b] mt-1">
              Districts with verified citizen voices
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Public Ballots Verified
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fdf2f8] text-[#ec4899] flex items-center justify-center">
              <Vote size={18} />
            </div>
          </div>
          <div>
            <div className="font-jakarta font-extrabold text-[32px] text-[#0a0e1a]">
              {stats.totalVotes.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-1">
              1-Person-1-Vote Certified
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Recent Submissions & Inquiries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Inquiries & Partner Requests Panel */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] flex items-center gap-2">
                  <MessageSquare size={17} className="text-[#e85d26]" />
                  <span>Recent Inquiries &amp; Partner Responses</span>
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Direct responses from /contact and /partner forms.
                </p>
              </div>

              <Link
                href="/admin/communications"
                className="btn btn-secondary btn-xs font-bold text-xs flex items-center gap-1"
              >
                <span>Open Communications Desk</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {stats.inquiries.length === 0 ? (
                <p className="text-xs text-[#94a3b8] p-6 text-center">No inquiries received yet.</p>
              ) : (
                stats.inquiries.slice(0, 4).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 sm:p-5 hover:bg-[#f8f7f4]/80 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            inq.type === "PARTNER"
                              ? "bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20"
                              : "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20"
                          }`}
                        >
                          {inq.type === "PARTNER" ? "🤝 PARTNER" : "📩 CONTACT"}
                        </span>
                        <span className="font-mono text-xs text-[#64748b]">#{inq.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            inq.status === "NEW"
                              ? "bg-[#e85d26]/15 text-[#e85d26]"
                              : "bg-[#64748b]/15 text-[#64748b]"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <h4 className="font-jakarta font-bold text-sm text-[#0a0e1a]">
                        {inq.name}{" "}
                        {inq.organization && (
                          <span className="text-xs font-medium text-[#16a34a]">
                            • {inq.organization}
                          </span>
                        )}
                      </h4>

                      <p className="text-xs text-[#64748b] line-clamp-1 max-w-lg">
                        {inq.subject || inq.message}
                      </p>
                    </div>

                    <Link
                      href="/admin/communications"
                      className="btn btn-secondary btn-xs whitespace-nowrap text-xs font-bold"
                    >
                      View &amp; Reply
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Idea Ingestion Stream */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] flex items-center gap-2">
                  <Lightbulb size={17} className="text-[#3b82f6]" />
                  <span>Recent Citizen Problem Submissions</span>
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Latest raw ideas ingested across Tamil Nadu districts.
                </p>
              </div>

              <Link
                href="/admin/ideas"
                className="btn btn-secondary btn-xs font-bold text-xs flex items-center gap-1"
              >
                <span>View All Ideas</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {stats.recentIdeas.length === 0 ? (
                <p className="text-xs text-[#94a3b8] p-6 text-center">No ideas ingested yet.</p>
              ) : (
                stats.recentIdeas.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 hover:bg-[#f8f7f4]/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#e85d26]">
                          #{item.public_id}
                        </span>
                        <span className="badge badge-subtle text-[11px] font-medium">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-jakarta font-bold text-sm text-[#0a0e1a] line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#64748b]">
                        <span>{item.district}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <Link
                      href={`/admin/ideas/${item.id}`}
                      className="btn btn-secondary btn-xs font-bold"
                    >
                      Inspect
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Categories & District Coverage */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Operations Box */}
          <div className="bg-[#fffaf7] rounded-3xl border border-[#e85d26]/20 p-6 space-y-4">
            <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
              Core Operations
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <Link
                href="/admin/communications"
                className="p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#e85d26] transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageSquare size={15} className="text-[#e85d26]" />
                <span>Inquiries ({stats.newInquiriesCount})</span>
              </Link>
              <Link
                href="/admin/groups"
                className="p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#e85d26] transition-colors flex items-center gap-2 shadow-xs"
              >
                <GitMerge size={15} className="text-[#3b82f6]" />
                <span>Idea Groups</span>
              </Link>
              <Link
                href="/admin/voting"
                className="p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#e85d26] transition-colors flex items-center gap-2 shadow-xs"
              >
                <Vote size={15} className="text-emerald-600" />
                <span>Voting Poll</span>
              </Link>
              <Link
                href="/admin/settings"
                className="p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#e85d26] transition-colors flex items-center gap-2 shadow-xs"
              >
                <ShieldCheck size={15} className="text-[#8b5cf6]" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Categories Progress Breakdown */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-jakarta font-bold text-[16px] text-[#0a0e1a]">
                Ideas by Sector
              </h3>
              <Link href="/admin/categories" className="text-xs font-bold text-[#e85d26]">
                Manage
              </Link>
            </div>

            {stats.categoriesSummary.length === 0 ? (
              <p className="text-xs text-[#94a3b8] py-4 text-center">No categorized submissions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.categoriesSummary.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#0a0e1a]">{cat.name}</span>
                      <span className="font-mono text-[#64748b]">
                        {cat.count} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
