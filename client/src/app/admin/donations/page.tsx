"use client";

import { useGetDonationsQuery } from "@/store/api/donationsApi";
import { Search, Filter } from "lucide-react";

export default function AdminDonationsPage() {
  const { data: donations = [], isLoading } = useGetDonationsQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Donations</h1>
          <p className="text-sm text-muted">Track and manage all incoming donations.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4">
          <Search size={16} className="text-muted" />
          <input className="flex-1 py-3 text-sm outline-none" placeholder="Search by donor name or campaign..." />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-muted hover:bg-gray-50">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d: any) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-secondary">{d.donorName}</p>
                  <p className="text-xs text-muted">{d.donorEmail}</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-primary">₹{d.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted">{d.itemLabel || "General Contribution"}</td>
                <td className="px-6 py-4 text-sm text-muted">Online</td>
                <td className="px-6 py-4 text-sm text-muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${d.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
