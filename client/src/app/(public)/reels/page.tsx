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

  const handleDonate = async (reel: any) => {
    const qty = quantities[reel.id] || 10;
    const total = qty * reel.itemPrice;

    try {
      await createDonation({
        amount: total,
        quantity: qty,
        itemLabel: reel.itemLabel,
        donorName: "Guest Donor", // Placeholder for now
        donorEmail: "guest@example.com",
        reelId: reel.id,
      }).unwrap();

      alert(
        `Thank you for donating ₹${total} for ${qty} ${reel.itemLabel}(s)! Your impact has been recorded.`
      );
      setActiveDonationId(null);
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Failed to process donation. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 text-center">
        <div className="container px-6">
          <h1 className="text-4xl font-black text-white lg:text-6xl tracking-tighter uppercase">
            Impact{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
              Reels
            </span>
          </h1>
          <p className="mt-4 text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            Watch real impact and support directly from the feed.
          </p>
        </div>
      </div>

      {/* Reels Feed */}
      <div className="mx-auto flex max-w-lg flex-col gap-12 px-4 py-8">
        {reels.map((reel: any) => {
          let embedUrl = null;

          // Instagram Detection
          const igMatch = reel.reelUrl.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
          if (igMatch) {
            embedUrl = `https://www.instagram.com/reel/${igMatch[1]}/embed/captioned/`;
          }

          // Facebook Detection
          const isFB = reel.reelUrl.includes("facebook.com");
          if (isFB) {
            // Encode the URL and use the standard video plugin
            // container_width=true help with responsiveness
            embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel.reelUrl)}&show_text=false&t=0&autoplay=true&mute=true&container_width=true`;
          }

          return (
            <div
              key={reel.id}
              className="relative overflow-hidden rounded-[40px] bg-gray-900 shadow-2xl border border-white/5"
              style={{ height: "800px" }}
            >
              {/* Direct Reel Embed or Video Player */}
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
                    className="h-full w-full object-cover opacity-50"
                  />
                )}
              </div>

              {/* Donation Overlay Button */}
              <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center">
                <button
                  onClick={() => setActiveDonationId(reel.id)}
                  className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-white p-2 pr-6 shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                      <Heart fill="white" size={24} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-black text-secondary uppercase tracking-wider">Donate {reel.itemLabel}</span>
                      <span className="text-xs font-bold text-muted">₹{reel.itemPrice} per item</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/5 px-4 py-2 text-sm font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors text-nowrap">
                    DONATE NOW
                  </div>
                </button>
              </div>

              {/* Donation Selection Popup (Overlay over the reel) */}
              {activeDonationId === reel.id && (
                <div className="absolute inset-0 z-20 flex items-end bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                  <div
                    className="w-full rounded-t-[40px] bg-white p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-secondary tracking-tight">Direct Donation</h3>
                        <p className="text-sm font-medium text-muted">Support this specific cause</p>
                      </div>
                      <button
                        onClick={() => setActiveDonationId(null)}
                        className="rounded-full bg-gray-100 p-2 text-muted hover:bg-gray-200 transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid gap-6">
                      <div className="flex items-center gap-6 rounded-2xl bg-gray-50 p-6">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Quantity</label>
                          <div className="mt-2 flex items-center gap-4">
                            <button
                              onClick={() => handleQuantityChange(reel.id, (quantities[reel.id] - 5).toString())}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 font-bold text-secondary shadow-sm hover:border-primary active:scale-90"
                            >
                              -5
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={quantities[reel.id]}
                              onChange={(e) => handleQuantityChange(reel.id, e.target.value)}
                              className="w-20 bg-transparent text-center text-3xl font-black text-secondary outline-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(reel.id, (quantities[reel.id] + 5).toString())}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 font-bold text-secondary shadow-sm hover:border-primary active:scale-90"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        <div className="h-12 w-px bg-gray-200" />

                        <div className="flex-1 text-right">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Total Amount</label>
                          <div className="mt-2 text-4xl font-black text-primary">
                            ₹{(quantities[reel.id] * reel.itemPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDonate(reel)}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary py-5 text-xl font-black text-white shadow-xl shadow-secondary/20 transition-all hover:bg-primary hover:shadow-primary/30 active:scale-[0.98]"
                      >
                        Confirm Donation <ArrowRight size={24} />
                      </button>

                      <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest">
                        100% of your donation goes to {reel.organizer}
                      </p>
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
