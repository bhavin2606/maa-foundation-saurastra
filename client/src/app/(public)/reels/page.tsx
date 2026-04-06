"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Info, ArrowRight, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReelData {
  id: number;
  organizer: string;
  avatar: string;
  reelUrl: string; // The actual social media reel link
  videoUrl: string; // Direct video URL for playback  
  posterUrl: string;
  caption: string;
  itemLabel: string;
  itemPrice: number;
  likes: string;
  comments: string;
}

import { useGetReelsQuery } from "@/store/api/reelsApi";
import { useCreateDonationMutation } from "@/store/api/donationsApi";

export default function ReelsPage() {
  const router = useRouter();
  const { data: reels = [], isLoading } = useGetReelsQuery();
  const [createDonation] = useCreateDonationMutation();

  const [activeDonationId, setActiveDonationId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    setQuantities((prev) => ({ ...prev, [id]: isNaN(num) || num < 1 ? 1 : num }));
  };

  const handleDonate = (reel: any) => {
    const qty = quantities[reel.id] || 10;
    router.push(`/donate?reelId=${reel.id}&quantity=${qty}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 pt-40 pb-20 text-center">
        <div className="container px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em] mb-8 lg:mb-12">
            Real Stories
          </span>
          <h1 className="text-6xl font-black text-white lg:text-[10rem] tracking-tighter uppercase leading-[0.8]">
            Impact <br/>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent italic bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">
              In Motion
            </span>
          </h1>
          <p className="mt-12 text-xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Witness the change your support creates. Watch, engage, and 
            donate directly to specific causes from the feed.
          </p>
        </div>
      </div>

      {/* Reels Feed */}
      <div className="mx-auto flex max-w-2xl flex-col gap-24 px-4 py-20 relative z-10">
        {reels.map((reel: any) => {
          let embedUrl = null;
          const igMatch = reel.reelUrl.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
          if (igMatch) embedUrl = `https://www.instagram.com/reel/${igMatch[1]}/embed/captioned/`;
          const isFB = reel.reelUrl.includes("facebook.com");
          if (isFB) embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel.reelUrl)}&show_text=false&t=0&autoplay=true&mute=true&container_width=true`;

          return (
            <div
              key={reel.id}
              className="relative overflow-hidden rounded-[56px] bg-black shadow-premium border border-white/5 group"
              style={{ height: "850px" }}
            >
              {/* Video/Embed Container */}
              <div className="absolute inset-0 bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="h-full w-full border-0"
                    allowFullScreen
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                ) : reel.videoUrl ? (
                  <video
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={reel.posterUrl}
                    alt={reel.caption}
                    className="h-full w-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Top Overlay Stats */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                <div className="glass-morphism px-4 py-2 rounded-2xl border-white/10 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Live Impact</span>
                </div>
              </div>

              {/* Donation Overlay Button */}
              <div className="absolute bottom-12 left-0 right-0 px-8 flex justify-center">
                <button
                  onClick={() => setActiveDonationId(reel.id)}
                  className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[32px] glass-morphism p-3 pr-8 border-white/20 transition-all duration-500 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-premium"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-primary to-accent text-white shadow-glow transition-transform group-hover:rotate-12">
                      <Heart fill="white" size={28} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Donate {reel.itemLabel}</span>
                      <span className="text-lg font-black text-primary">₹{reel.itemPrice} <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">/ unit</span></span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-white font-black uppercase text-[10px] tracking-widest group-hover:text-primary transition-colors">
                    SUPPORT NOW <ArrowRight size={18} className="text-primary transition-transform group-hover:translate-x-2" />
                  </div>
                </button>
              </div>

              {/* Donation Selection Popup */}
              {activeDonationId === reel.id && (
                <div className="absolute inset-0 z-20 flex items-end bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                  <div className="w-full rounded-t-[56px] glass-morphism p-10 border-white/20 shadow-premium animate-in slide-in-from-bottom duration-700">
                    <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-2">Direct Contribution</h3>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">100% Goes to the cause</p>
                      </div>
                      <button
                        onClick={() => setActiveDonationId(null)}
                        className="rounded-full bg-white/5 p-4 text-white hover:bg-white/10 transition-all active:scale-90"
                      >
                        <X size={28} />
                      </button>
                    </div>

                    <div className="grid gap-8">
                      <div className="grid grid-cols-2 gap-8 rounded-[40px] bg-white/5 border border-white/10 p-8">
                        <div>
                          <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none block mb-6 px-1">How Many?</label>
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => handleQuantityChange(reel.id, (quantities[reel.id] - 5).toString())}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 font-black text-white hover:bg-primary transition-all active:scale-90"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={quantities[reel.id] || 1}
                              onChange={(e) => handleQuantityChange(reel.id, e.target.value)}
                              className="w-16 bg-transparent text-center text-4xl font-black text-white outline-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(reel.id, (quantities[reel.id] + 5).toString())}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 font-black text-white hover:bg-primary transition-all active:scale-90"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex flex-col justify-center border-l border-white/10 pl-8">
                          <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none block mb-4">Total Gift</label>
                          <div className="text-5xl font-black text-white tracking-tighter">
                            ₹{((quantities[reel.id] || (activeDonationId === reel.id ? 1 : 0)) * reel.itemPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDonate(reel)}
                        className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-[32px] bg-primary py-8 text-xl font-black uppercase tracking-[0.2em] text-white shadow-glow transition-all hover:bg-white hover:text-secondary hover:-translate-y-1 active:scale-[0.98]"
                      >
                        <span className="relative z-10">Confirm Donation</span>
                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <ArrowRight size={24} className="relative z-10" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
