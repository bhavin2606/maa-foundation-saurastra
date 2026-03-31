"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, X, Film } from "lucide-react";

interface ReelFormData {
  organizer: string;
  avatarUrl: string;
  reelUrl: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  itemLabel: string;
  itemPrice: number;
  category: string;
}

import {
  useGetReelsQuery,
  useCreateReelMutation,
  useUpdateReelMutation,
  useDeleteReelMutation,
} from "@/store/api/reelsApi";

export default function AdminReelsPage() {
  const { data: reels = [], isLoading } = useGetReelsQuery();
  const [createReel] = useCreateReelMutation();
  const [updateReel] = useUpdateReelMutation();
  const [deleteReel] = useDeleteReelMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReelFormData>();

  const onSubmit = async (data: ReelFormData) => {
    try {
      if (editingId) {
        await updateReel({ id: editingId, data }).unwrap();
      } else {
        await createReel(data).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (error) {
      console.error("Failed to save reel:", error);
      alert("Failed to save reel. Please try again.");
    }
  };

  const handleEdit = (reel: any) => {
    setEditingId(reel.id);
    reset(reel);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reel?")) {
      try {
        await deleteReel(id).unwrap();
      } catch (error) {
        console.error("Failed to delete reel:", error);
        alert("Failed to delete reel.");
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Manage Reels</h1>
          <p className="text-sm text-muted">
            Add Instagram/Facebook reels with itemized donation options.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            reset({});
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg"
        >
          <Plus size={16} /> Add Reel
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-secondary">
                {editingId ? "Edit Reel" : "Add New Reel"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Organizer Name *
                  </label>
                  <input
                    {...register("organizer", { required: "Organizer is required" })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Animal Rescue Squad"
                  />
                  {errors.organizer && (
                    <p className="mt-1 text-xs text-red-500">{errors.organizer.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Category *
                  </label>
                  <input
                    {...register("category", { required: "Category is required" })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Animal Welfare, Education"
                  />
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">
                  Reel Link (Instagram / Facebook) *
                </label>
                <input
                  {...register("reelUrl", { required: "Reel URL is required" })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="https://www.instagram.com/reel/... or https://www.facebook.com/reel/..."
                />
                {errors.reelUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.reelUrl.message}</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Video URL (direct .mp4)
                  </label>
                  <input
                    {...register("videoUrl")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="https://cdn.example.com/video.mp4"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Poster / Thumbnail URL *
                  </label>
                  <input
                    {...register("posterUrl", { required: "Poster URL is required" })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {errors.posterUrl && (
                    <p className="mt-1 text-xs text-red-500">{errors.posterUrl.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">
                  Avatar URL
                </label>
                <input
                  {...register("avatarUrl")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">
                  Caption *
                </label>
                <textarea
                  rows={3}
                  {...register("caption", { required: "Caption is required" })}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Describe the activity shown in the reel..."
                />
                {errors.caption && (
                  <p className="mt-1 text-xs text-red-500">{errors.caption.message}</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Donation Item Label *
                  </label>
                  <input
                    {...register("itemLabel", { required: "Item label is required" })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Roti, Notebook, Blanket"
                  />
                  {errors.itemLabel && (
                    <p className="mt-1 text-xs text-red-500">{errors.itemLabel.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">
                    Price per Item (₹) *
                  </label>
                  <input
                    type="number"
                    {...register("itemPrice", {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be at least ₹1" },
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. 5"
                  />
                  {errors.itemPrice && (
                    <p className="mt-1 text-xs text-red-500">{errors.itemPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    reset();
                  }}
                  className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg"
                >
                  {editingId ? "Update Reel" : "Create Reel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Preview</th>
              <th className="px-6 py-4">Organizer</th>
              <th className="px-6 py-4">Donation Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reels.map((reel) => (
              <tr
                key={reel.id}
                className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
              >
                <td className="px-6 py-4">
                  <div className="relative h-20 w-14 overflow-hidden rounded-lg bg-gray-100 shadow-inner group/media">
                    {reel.videoUrl ? (
                      <video
                        src={reel.videoUrl}
                        className="h-full w-full object-cover"
                        muted
                        loop
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                    ) : (
                      <img
                        src={reel.posterUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/0 transition-colors">
                      <Film size={16} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-secondary">{reel.organizer}</p>
                  <p className="max-w-[200px] truncate text-xs text-muted">
                    {reel.caption}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  {reel.itemLabel}
                </td>
                <td className="px-6 py-4 text-sm font-extrabold text-primary">
                  ₹{reel.itemPrice}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {reel.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 text-right">
                    <a
                      href={reel.reelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-blue-50 hover:text-blue-500"
                      title="View Social Link"
                    >
                      <Film size={18} />
                    </a>
                    <button
                      onClick={() => handleEdit(reel)}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(reel.id)}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
