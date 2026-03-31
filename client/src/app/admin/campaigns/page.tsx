"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} from "@/store/api/campaignsApi";

interface CampaignFormData {
  title: string;
  description: string;
  image: string;
  goal: number;
  category: string;
  organizer: string;
}

export default function AdminCampaignsPage() {
  const { data: campaigns = [], isLoading } = useGetCampaignsQuery();
  const [createCampaign] = useCreateCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampaignFormData>();

  const onSubmit = async (data: CampaignFormData) => {
    try {
      if (editingId) {
        await updateCampaign({ id: editingId, data }).unwrap();
      } else {
        await createCampaign(data).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (error) {
      console.error("Failed to save campaign:", error);
      alert("Failed to save campaign.");
    }
  };

  const handleEdit = (campaign: any) => {
    setEditingId(campaign.id);
    reset({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      goal: campaign.goal,
      image: campaign.image,
      organizer: campaign.organizer,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this campaign?")) {
      try {
        await deleteCampaign(id).unwrap();
      } catch (error) {
        console.error("Failed to delete campaign:", error);
        alert("Failed to delete campaign.");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Manage Campaigns</h1>
          <p className="text-sm text-muted">Create and manage fundraising campaigns.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); reset({}); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg"
        >
          <Plus size={16} /> Add Campaign
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-secondary">
                {editingId ? "Edit Campaign" : "Add New Campaign"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); reset(); }} className="rounded-lg p-2 text-muted hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Title *</label>
                <input {...register("title", { required: "Title is required" })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Campaign title" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Description *</label>
                <textarea rows={3} {...register("description", { required: "Description is required" })} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Describe the campaign..." />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Category *</label>
                  <input {...register("category", { required: "Category is required" })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. Food, Education" />
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Goal Amount *</label>
                  <input type="number" {...register("goal", { required: "Goal is required", valueAsNumber: true })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. 1000000" />
                  {errors.goal && <p className="mt-1 text-xs text-red-500">{errors.goal.message}</p>}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Organizer *</label>
                  <input {...register("organizer", { required: "Organizer is required" })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Maa Foundation" />
                  {errors.organizer && <p className="mt-1 text-xs text-red-500">{errors.organizer.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Image URL *</label>
                  <input {...register("image", { required: "Image URL is required" })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); reset(); }} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-muted hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-lg">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Goal</th>
              <th className="px-6 py-4">Raised</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp: any) => {
              const progress = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
              return (
                <tr key={camp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary">{camp.title}</td>
                  <td className="px-6 py-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{camp.category}</span></td>
                  <td className="px-6 py-4 text-sm text-muted">₹{camp.goal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">₹{camp.raised.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-muted">{progress}%</span>
                    </div>
                  </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(camp)} className="rounded-lg p-2 text-muted hover:bg-blue-50 hover:text-blue-500"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(camp.id)} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
