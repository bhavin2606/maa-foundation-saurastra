"use client";

import Link from "next/link";
import { useGetCampaignsQuery } from "@/store/api/campaignsApi";
import { Heart } from "lucide-react";

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
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass-morphism px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
            Our Initiatives
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-secondary tracking-tighter leading-[0.85] mb-12">
            Active <br/>
            <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent italic px-8">
              Campaigns
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted font-medium leading-relaxed">
            Every contribution counts. Explore our ongoing missions and 
            become a part of the change you wish to see in the world.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 bg-surface relative min-h-[600px]">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:30px_30px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-8 glass-card rounded-[48px]">
              <div className="h-24 w-24 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary/20">
                <Heart size={48} />
              </div>
              <h3 className="text-3xl font-black text-secondary tracking-tight">No active campaigns found</h3>
              <p className="text-muted font-medium">Check back soon for new initiatives!</p>
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((camp: any) => {
                const progress = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
                return (
                  <div
                    key={camp.id}
                    className="group relative overflow-hidden rounded-[56px] bg-white shadow-premium transition-all duration-700 hover:-translate-y-4"
                  >
                    <div className="overflow-hidden relative aspect-[4/5]">
                      <img
                        src={camp.image}
                        alt={camp.title}
                        className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Category Tag */}
                      <div className="absolute top-8 left-8">
                        <span className="glass-morphism px-5 py-2 rounded-full text-[10px] font-black text-secondary uppercase tracking-[0.2em] border-white/40">
                          {camp.category}
                        </span>
                      </div>
                      
                      {/* Progress Circle Overlay */}
                      <div className="absolute top-8 right-8">
                        <div className="glass-morphism h-16 w-16 rounded-full flex items-center justify-center border-white/40">
                          <span className="text-sm font-black text-secondary">{progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{camp.title}</h3>
                        <p className="text-sm font-medium text-white/60 line-clamp-2 leading-relaxed">
                          {camp.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-glow transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>Progress</span>
                          <span>Goal: ₹{camp.goal.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-white italic">₹{camp.raised.toLocaleString()}</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Raised</span>
                        </div>
                        <Link
                          href={`/campaigns/${camp.id}`}
                          className="rounded-2xl glass-morphism border-white/20 text-white px-8 py-5 text-xs font-black uppercase tracking-widest transition-all hover:bg-white hover:text-secondary active:scale-95"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
