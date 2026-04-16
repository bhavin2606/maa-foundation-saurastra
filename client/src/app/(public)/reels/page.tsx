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

import { useGetReelsQuery, useIncrementReelViewMutation } from "@/store/api/reelsApi";
import { useCreateDonationMutation } from "@/store/api/donationsApi";

export default function ReelsPage() {
  const router = useRouter();
  const { data: reels = [], isLoading } = useGetReelsQuery();
  const [createDonation] = useCreateDonationMutation();
  const [incrementView] = useIncrementReelViewMutation();

  const [activeDonationId, setActiveDonationId] = useState<string | null>(null);
  
  const handleOpenDonation = (id: string) => {
    setActiveDonationId(id);
    incrementView(id);
  };
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
        <div className="container mx-auto px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em] mb-8 lg:mb-12">
            Real Stories
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-secondary tracking-tighter leading-[0.85] mb-8">
            Impact <br/>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent italic bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] px-2 py-1 box-decoration-clone inline-block">
              In Motion
            </span>
          </h1>
          <p className="mt-12 text-lg md:text-xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Witness the change your support creates. Watch, engage, and 
            donate directly to specific causes from the feed.
          </p>
        </div>
      </div>

      {/* Reels Gallery Grid */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reels.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-40 space-y-8 glass-morphism rounded-[48px] border-white/10">
              <div className="h-24 w-24 rounded-3xl bg-white/5 flex items-center justify-center text-primary/20">
                <Play size={48} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight uppercase">No reels found</h3>
              <p className="text-slate-400 font-medium">Follow us on Instagram for latest updates!</p>
            </div>
          ) : reels.map((reel: any) => {
            let embedUrl = null;
            const igMatch = reel.reelUrl.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
            if (igMatch) embedUrl = `https://www.instagram.com/reel/${igMatch[1]}/embed/captioned/`;
            const isFB = reel.reelUrl.includes("facebook.com");
            if (isFB) embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel.reelUrl)}&show_text=false&t=0&autoplay=true&mute=true&container_width=true`;

            return (
              <div
                key={reel.id}
                className="group relative flex flex-col items-center"
              >
                {/* Reel Card */}
                <div 
                  className="relative w-full aspect-[9/16] overflow-hidden rounded-[48px] bg-black shadow-2xl border border-white/5 transition-all duration-700 hover:scale-[1.02] hover:shadow-glow/20"
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
                        className="h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 pointer-events-none">
                    <div className="glass-morphism px-4 py-2 rounded-2xl border-white/10 flex items-center gap-2 scale-90 origin-left">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Live Impact</span>
                    </div>
                  </div>

                  {/* Info Overlay (Visible on Hover) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent">
                    <p className="text-sm font-medium text-white/80 line-clamp-2 mb-6 leading-relaxed">
                      {reel.caption}
                    </p>
                    <div className="flex items-center gap-6 text-white/60 mb-2">
                       <div className="flex items-center gap-2">
                         <Heart size={16} className="text-primary" />
                         <span className="text-xs font-black tracking-widest">{reel.likes || "1.2k"}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MessageCircle size={16} className="text-accent" />
                         <span className="text-xs font-black tracking-widest">{reel.comments || "48"}</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Donation Action Card - Slightly overlapping or below */}
                <div className="w-[90%] -mt-12 relative z-20">
                  <button
                    onClick={() => handleOpenDonation(reel.id)}
                    className="group/btn relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[32px] glass-morphism p-3 pr-6 border-white/20 transition-all duration-500 hover:shadow-glow hover:-translate-y-1 active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent text-white shadow-lg group-hover/btn:rotate-12 transition-transform">
                        <Heart fill="white" size={20} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5">Support</span>
                        <span className="text-sm font-black text-white truncate max-w-[120px]">{reel.itemLabel}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">₹{reel.itemPrice}</span>
                    </div>
                  </button>
                </div>

                {/* Selection Modal (Simplified Overlay) */}
                {activeDonationId === reel.id && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-secondary rounded-[48px] p-10 border border-white/10 shadow-premium animate-in zoom-in-95 duration-300">
                      <div className="mb-10 flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight uppercase">Donation Details</h3>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2">100% Direct Impact</p>
                        </div>
                        <button
                          onClick={() => setActiveDonationId(null)}
                          className="rounded-full bg-white/5 p-4 text-white hover:bg-white/10 transition-all active:scale-90"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="space-y-8">
                        <div className="rounded-[32px] bg-white/5 border border-white/10 p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleQuantityChange(reel.id, ((quantities[reel.id] || 1) - 1).toString())}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all"
                            > - </button>
                            <span className="text-2xl font-black text-white min-w-[30px] text-center">{quantities[reel.id] || 1}</span>
                            <button
                              onClick={() => handleQuantityChange(reel.id, ((quantities[reel.id] || 1) + 1).toString())}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all"
                            > + </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-2xl font-black text-white">₹{((quantities[reel.id] || 1) * reel.itemPrice).toLocaleString()}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDonate(reel)}
                          className="w-full rounded-[24px] bg-primary py-6 text-sm font-black uppercase tracking-[0.2em] text-white shadow-glow transition-all hover:bg-white hover:text-secondary active:scale-[0.98]"
                        >
                          Confirm & Pay
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
    </div>
  );
}
