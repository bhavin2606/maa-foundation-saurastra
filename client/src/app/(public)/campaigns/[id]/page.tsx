"use client";

import Link from "next/link";
import { Heart, Calendar, Users, ArrowLeft } from "lucide-react";
import { useGetCampaignByIdQuery } from "@/store/api/campaignsApi";
import { useParams } from "next/navigation";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: campaign, isLoading, error } = useGetCampaignByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary">Campaign Not Found</h1>
          <Link href="/campaigns" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));

  return (
    <div>
      {/* Hero Image */}
      <section className="relative h-[400px] overflow-hidden lg:h-[500px]">
        <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
              {campaign.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-white lg:text-4xl">{campaign.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-8 lg:col-span-2">
            <p className="text-lg leading-relaxed text-muted">{campaign.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Heart size={20} />, label: "Status", value: campaign.status || "Active" },
                { icon: <Calendar size={20} />, label: "Created", value: new Date(campaign.createdAt).toLocaleDateString() },
                { icon: <Users size={20} />, label: "Category", value: campaign.category },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-surface p-4 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                  <p className="text-sm font-bold text-secondary">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold text-secondary">Donation Progress</h3>
              <div className="mt-6">
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{campaign.raised}</p>
                    <p className="text-xs text-muted">Raised</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">₹{campaign.goal}</p>
                    <p className="text-xs text-muted">Goal</p>
                  </div>
                </div>
              </div>
              <Link
                href={`/donate?campaignId=${campaign.id}`}
                className="mt-8 block rounded-full bg-gradient-to-r from-primary to-accent py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
              >
                Donate to This Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
