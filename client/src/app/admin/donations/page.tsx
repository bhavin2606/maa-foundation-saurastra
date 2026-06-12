"use client";

import { useState } from "react";

import { 
  useGetDonationsQuery,
  useAdminCreateDonationMutation
} from "@/store/api/donationsApi";
import { 
  useApproveManualPaymentMutation, 
  useRejectManualPaymentMutation
} from "@/store/api/adminPaymentsApi";
import { useGetCampaignsQuery } from "@/store/api/campaignsApi";
import { Search, Filter, Check, X, Eye, Download, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

function resolveScreenshotUrl(screenshotUrl?: string) {
  if (!screenshotUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(screenshotUrl)) {
    return screenshotUrl;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${screenshotUrl}`;
}

export default function AdminDonationsPage() {
  const { data: donations = [], isLoading } = useGetDonationsQuery();
  const [approvePayment] = useApproveManualPaymentMutation();
  const [rejectPayment] = useRejectManualPaymentMutation();
  const [adminCreateDonation, { isLoading: isCreating }] = useAdminCreateDonationMutation();
  const { data: campaigns = [] } = useGetCampaignsQuery();
  
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddDonation = async (data: any) => {
    try {
      await adminCreateDonation(data).unwrap();
      setShowAddModal(false);
      reset();
      alert("Donation successfully recorded and receipt emailed!");
    } catch (err: any) {
      console.error("Failed to add donation:", err);
      alert(err.data?.error || "Failed to add donation.");
    }
  };

  const handleApprove = async (id: string) => {
    if (confirm("Are you sure you want to approve this payment?")) {
      try {
        await approvePayment(id).unwrap();
        alert("Payment approved successfully!");
      } catch (err: any) {
        console.error("Failed to approve payment:", err);
        alert(err.data?.error || "Failed to approve payment.");
      }
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure you want to reject this payment?")) {
      try {
        await rejectPayment(id).unwrap();
        alert("Payment rejected successfully!");
      } catch (err: any) {
        console.error("Failed to reject payment:", err);
        alert(err.data?.error || "Failed to reject payment.");
      }
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4">
          <Search size={16} className="text-muted" />
          <input className="flex-1 py-3 text-sm outline-none w-full" placeholder="Search by donor name or campaign..." />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-muted hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white hover:bg-primary transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} /> Manual Donation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
        <table className="w-full whitespace-nowrap">
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
                  <p className="text-sm text-secondary truncate max-w-[200px]">
                    {d.campaign?.title || d.itemLabel || "General Contribution"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${d.paymentMethod === 'manual' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {d.paymentMethod === 'manual' ? 'Manual Transfer' : 'Razorpay'}
                    </span>
                    {resolveScreenshotUrl(d.screenshotUrl) && (
                      <a 
                        href={resolveScreenshotUrl(d.screenshotUrl) || undefined}
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
                    {d.receiptUrl && (
                      <button
                        onClick={() => setSelectedReceipt(d.receiptUrl)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="View Receipt"
                      >
                        <Download size={16} />
                      </button>
                    )}
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

      {/* PDF Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl flex flex-col h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Receipt Viewer</h3>
              <div className="flex gap-2">
                <a 
                  href={selectedReceipt.includes('/upload/') ? selectedReceipt.replace('/upload/', '/upload/fl_attachment/') : selectedReceipt} 
                  download
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  <Download size={16} /> Download Receipt
                </a>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 p-0 m-0 overflow-hidden">
              <iframe 
                src={selectedReceipt} 
                className="w-full h-full border-0 bg-white" 
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-secondary tracking-tight">Record Donation</h3>
                <p className="text-sm text-muted font-medium mt-1">Log an offline manual payment.</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  reset();
                }}
                className="rounded-full p-2 text-muted hover:bg-surface hover:text-secondary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleAddDonation)} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Donor Name *</label>
                  <input
                    {...register("donorName", { required: true })}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                    placeholder="John Doe"
                  />
                  {errors.donorName && <span className="text-[10px] text-red-500 font-bold mt-1 block">Required</span>}
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Donor Email *</label>
                  <input
                    type="email"
                    {...register("donorEmail", { required: true })}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                    placeholder="john@example.com"
                  />
                  {errors.donorEmail && <span className="text-[10px] text-red-500 font-bold mt-1 block">Required</span>}
                </div>
                
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    {...register("amount", { required: true })}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-bold text-secondary outline-none focus:border-primary focus:bg-white"
                    placeholder="1000"
                  />
                  {errors.amount && <span className="text-[10px] text-red-500 font-bold mt-1 block">Required</span>}
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Phone (Optional)</label>
                  <input
                    {...register("phone")}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                    placeholder="+91..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Campaign Category</label>
                  <select
                    {...register("campaignId")}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white appearance-none"
                  >
                    <option value="">General Donation</option>
                    {campaigns.map((camp: any) => (
                      <option key={camp.id} value={camp.id}>{camp.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Message (Optional)</label>
                  <textarea
                    {...register("message")}
                    className="w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white resize-none"
                    placeholder="Any notes?"
                    rows={2}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    reset();
                  }}
                  className="rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider text-muted hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-full bg-secondary px-8 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary transition-all disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Save & Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
