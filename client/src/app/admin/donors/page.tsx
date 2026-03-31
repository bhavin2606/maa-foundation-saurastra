"use client";

import { useGetDonationsQuery } from "@/store/api/donationsApi";
import { Search } from "lucide-react";

export default function AdminDonorsPage() {
  const { data: donations = [], isLoading } = useGetDonationsQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Compute unique donors
  const donorMap = new Map();
  donations.forEach((d: any) => {
    const existing = donorMap.get(d.donorEmail);
    if (existing) {
      existing.totalDonated += d.amount;
      existing.donations += 1;
      if (new Date(d.createdAt) > new Date(existing.lastDonation)) {
        existing.lastDonation = d.createdAt;
      }
    } else {
      donorMap.set(d.donorEmail, {
        id: d.id,
        name: d.donorName,
        email: d.donorEmail,
        phone: "+91 98765 43210", // Placeholder if not in DB
        totalDonated: d.amount,
        donations: 1,
        lastDonation: d.createdAt,
      });
    }
  });

  const donors = Array.from(donorMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Donors</h1>
        <p className="text-sm text-muted">View and manage donor profiles.</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4">
        <Search size={16} className="text-muted" />
        <input className="flex-1 py-3 text-sm outline-none" placeholder="Search donors..." />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Total Donated</th>
              <th className="px-6 py-4"># Donations</th>
              <th className="px-6 py-4">Last Donation</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d: any) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-secondary">{d.name}</p>
                  <p className="text-xs text-muted">{d.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{d.phone}</td>
                <td className="px-6 py-4 text-sm font-semibold text-primary">₹{d.totalDonated.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted">{d.donations}</td>
                <td className="px-6 py-4 text-sm text-muted">{new Date(d.lastDonation).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
