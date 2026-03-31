"use client";

import Link from "next/link";
import { useGetCampaignsQuery } from "@/store/api/campaignsApi";

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading } = useGetCampaignsQuery();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-[#2d2d4e] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold lg:text-5xl">
            Active{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Campaigns
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Explore our ongoing initiatives and choose a cause that resonates with
            you.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((camp: any) => {
              const progress = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
              return (
                <div
                  key={camp.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                      {camp.category}
                    </span>
                  </div>
                  <div className="space-y-4 p-6">
                    <h3 className="text-lg font-bold text-secondary">{camp.title}</h3>
                    <p className="text-sm text-muted line-clamp-2">{camp.description}</p>
                    <div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted">
                        <span>{progress}% Raised</span>
                        <span>Goal: ₹{camp.goal.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        ₹{camp.raised.toLocaleString()} Raised
                      </span>
                      <Link
                        href={`/campaigns/${camp.id}`}
                        className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
