"use client";

import { useGetDashboardStatsQuery } from "@/store/api/baseApi";
import { IndianRupee, Users, Megaphone, FilmIcon, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { label: "Total Donations", value: `₹${(data?.stats?.totalRaised ?? 0).toLocaleString()}`, change: "+12%", icon: IndianRupee, color: "from-primary to-accent" },
    { label: "Total Donors", value: data?.stats?.totalDonors ?? 0, change: "+8%", icon: Users, color: "from-blue-500 to-cyan-400" },
    { label: "Active Campaigns", value: data?.stats?.activeCampaigns ?? 0, change: "+3", icon: Megaphone, color: "from-emerald-500 to-green-400" },
    { label: "Active Reels", value: data?.stats?.activeReels ?? 0, change: "+5", icon: FilmIcon, color: "from-purple-500 to-pink-400" },
  ];

  const recentDonations = data?.recentDonations ?? [];
  console.log(recentDonations);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
        <p className="text-sm text-muted">Welcome back! Here&apos;s an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 transition-transform group-hover:scale-150`} />
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
              <stat.icon size={22} />
            </div>
            <p className="text-sm text-muted">{stat.label}</p>
            <div className="mt-1 flex items-end gap-3">
              <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
              <span className="mb-0.5 flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
                <TrendingUp size={12} /> {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-secondary">Recent Donations</h2>
          <a
            href="/admin/donations"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation: any) => (
                <tr
                  key={donation.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >

                  <td className="px-4 py-3.5 text-sm font-medium text-secondary">{donation.donorName}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-primary">₹{donation.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-sm text-muted">{donation.campaign?.title || donation.itemLabel || "General Contribution"}</td>
                  <td className="px-4 py-3.5 text-sm text-muted">{new Date(donation.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
