"use client";

import { useGetDonationsQuery } from "@/store/api/donationsApi";
import { 
  useApproveManualPaymentMutation, 
  useRejectManualPaymentMutation 
} from "@/store/api/adminPaymentsApi";
import { Search, Filter, Check, X, Eye } from "lucide-react";

export default function AdminDonationsPage() {
  const { data: donations = [], isLoading } = useGetDonationsQuery();
  const [approvePayment] = useApproveManualPaymentMutation();
  const [rejectPayment] = useRejectManualPaymentMutation();

  const handleApprove = async (id: string) => {
    if (confirm("Are you sure you want to approve this payment?")) {
      await approvePayment(id);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure you want to reject this payment?")) {
      await rejectPayment(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success": return "bg-emerald-100 text-emerald-600";
      case "pending": return "bg-blue-100 text-blue-600";
      case "failed": return "bg-red-100 text-red-600";
      case "waiting_for_admin": return "bg-amber-100 text-amber-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

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
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Campaign/Reel</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d: any) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-secondary">{d.donorName}</p>
                  <p className="text-xs text-muted">{d.donorEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-secondary">₹{d.amount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-secondary truncate max-w-[200px]">{d.itemLabel || "General Contribution"}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${d.paymentMethod === 'manual' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {d.paymentMethod === 'manual' ? 'Manual Transfer' : 'Razorpay'}
                    </span>
                    {d.screenshotUrl && (
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${d.screenshotUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[10px] font-black text-primary hover:underline uppercase"
                      >
                        <Eye size={10} /> View Proof
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted">
                  {new Date(d.createdAt).toLocaleDateString()}
                  <br />
                  {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusColor(d.paymentStatus)}`}>
                    {d.paymentStatus.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {d.paymentMethod === "manual" && d.paymentStatus === "waiting_for_admin" && (
                      <>
                        <button
                          onClick={() => handleApprove(d.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="Approve Payment"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(d.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Reject Payment"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted">No donations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
