"use client";

import { useForm } from "react-hook-form";
import {
  useCreateManualPaymentMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation
} from "@/store/api/donationsApi";
import { useGetCampaignByIdQuery } from "@/store/api/campaignsApi";
import { useGetReelByIdQuery } from "@/store/api/reelsApi";
import { Heart, CreditCard, Shield, QrCode, Upload, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

interface DonateFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  message: string;
  paymentMethod: "razorpay" | "manual";
}

const presets = [500, 1000, 2500, 5000, 10000];

function DonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");
  const reelId = searchParams.get("reelId");
  const initialQty = parseInt(searchParams.get("quantity") || "1");

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "manual">("manual");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const { data: campaign } = useGetCampaignByIdQuery(campaignId || "", { skip: !campaignId });
  const { data: reel } = useGetReelByIdQuery(reelId || "", { skip: !reelId });

  const [createManualPayment] = useCreateManualPaymentMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DonateFormData>({
    defaultValues: {
      amount: 1000,
      paymentMethod: "manual"
    }
  });

  const selectedAmount = watch("amount");

  useEffect(() => {
    if (reel) {
      setValue("amount", reel.itemPrice * initialQty);
    }
  }, [reel, initialQty, setValue]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DonateFormData) => {
    try {
      const donationData = {
        amount: data.amount,
        quantity: reelId ? initialQty : 1,
        itemLabel: reel ? reel.itemLabel : (campaign ? campaign.title : "General Donation"),
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        paymentMethod: data.paymentMethod,
        campaignId: campaignId || undefined,
        reelId: reelId || undefined,
      };

      if (data.paymentMethod === "manual") {
        if (!screenshotFile) {
          alert("Please upload a payment screenshot.");
          return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("amount", data.amount.toString());
        formData.append("phone", data.phone);
        formData.append("message", data.message);
        formData.append("paymentMethod", "manual");
        formData.append("screenshot", screenshotFile);
        if (campaignId) formData.append("campaignId", campaignId);
        if (reelId) formData.append("reelId", reelId);

        await createManualPayment(formData).unwrap();
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } else {
        // Razorpay flow
        const order = await createRazorpayOrder({
          amount: data.amount,
          name: data.name,
          email: data.email
        }).unwrap();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SaEBC54CQIXUNj",
          amount: order.amount,
          currency: order.currency,
          name: "Maa Foundation",
          description: donationData.itemLabel,
          order_id: order.orderId,
          handler: async (response: any) => {
            try {
              const res = await verifyRazorpayPayment({
                ...response,
                donationId: order.donationId
              }).unwrap();
              if (res.receiptUrl) setReceiptUrl(res.receiptUrl);
              setIsSuccess(true);
              window.scrollTo(0, 0);
            } catch (err) {
              console.error("Verification failed:", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#E22D6E",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center px-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-secondary">
          {paymentMethod === "manual" ? "Screenshot Submitted!" : "Thank you! Your payment was successful."}
        </h2>
        <p className="mt-4 max-w-md text-muted overflow-hidden">
          {paymentMethod === "manual"
            ? "Your payment screenshot has been submitted. Once admin verifies it, you will receive a confirmation email."
            : "Your support makes a real difference in our mission."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all"
            >
              Download Receipt
            </a>
          )}
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-secondary px-8 py-3 font-semibold text-white transition-all hover:bg-secondary/90 shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 rounded-3xl bg-white p-6 shadow-xl shadow-gray-100 sm:p-10 lg:col-span-3"
        >
          {/* Header */}
          <div>
            <h2 className="text-2xl font-black text-secondary tracking-tight uppercase">Complete Your Donation</h2>
            <p className="text-sm text-muted">माँ फाउंडेशन में प्राप्त होने वाला दान धर्म कार्यों और सेवा गतिविधियों में इस्तेमाल किया जाता है। (Donations received by Maa Foundation are utilized for religious works and social service activities.)</p>
          </div>

          {/* Selection Summary */}
          {(campaign || reel) && (
            <div className="rounded-2xl bg-primary/5 p-4 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 shadow-sm shrink-0">
                <img
                  src={campaign?.image || reel?.posterUrl}
                  className="h-full w-full object-cover"
                  alt="Selection"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Supporting</p>
                <h4 className="mt-1 font-bold text-secondary truncate">{campaign?.title || reel?.caption}</h4>
                <p className="text-xs text-muted">
                  {reel ? `${initialQty} x ${reel.itemLabel} (₹${reel.itemPrice})` : campaign?.category}
                </p>
              </div>
              <ChevronRight className="text-muted/30" />
            </div>
          )}

          {/* Amount Section */}
          <div className="space-y-4">
            <label className="text-sm font-black text-secondary uppercase tracking-widest">Select Amount</label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue("amount", amt)}
                  className={`rounded-xl py-3 text-sm font-bold transition-all ${selectedAmount === amt
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-surface text-secondary hover:bg-primary/10"
                    }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">₹</span>
              <input
                type="number"
                {...register("amount", { required: true, min: 1 })}
                className="w-full rounded-xl border border-gray-100 bg-surface pl-8 pr-4 py-4 text-xl font-black text-secondary outline-none transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Enter custom amount"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <label className="text-sm font-black text-secondary uppercase tracking-widest">Payment Method</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                disabled
                className="flex items-center gap-4 rounded-2xl border-2 border-gray-50 bg-surface/50 p-4 opacity-60 cursor-not-allowed"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-muted">
                  <CreditCard size={20} />
                </div>
                <div className="text-left leading-tight">
                  <p className="font-bold text-secondary">Pay Online</p>
                  <p className="text-[10px] text-red-500 font-bold">Temporarily Disabled</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("manual");
                  setValue("paymentMethod", "manual");
                }}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all ${paymentMethod === "manual"
                  ? "border-primary bg-primary/5"
                  : "border-gray-50 bg-surface hover:border-gray-200"
                  }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${paymentMethod === "manual" ? "bg-primary text-white" : "bg-gray-200 text-muted"}`}>
                  <QrCode size={20} />
                </div>
                <div className="text-left leading-tight">
                  <p className="font-bold text-secondary">Scan & Pay</p>
                  <p className="text-[10px] text-muted">Direct UPI Transfer</p>
                </div>
              </button>
            </div>
          </div>

          {/* Scan & Pay Specific UI */}
          {paymentMethod === "manual" && (
            <div className="space-y-6 rounded-3xl bg-amber-50/50 p-6 border border-amber-100 border-dashed">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  {/* Mock UPI QR Code */}
                  <img
                    src="/images/doanation-qr.jpeg"
                    alt="Maa Foundation UPI QR Code"
                    className="h-40 w-40 object-contain"
                  />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Scan this QR to pay</p>
                <p className="mt-1 text-sm font-bold text-secondary">maa-foundation@upi</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Step 2: Upload Payment Screenshot</label>
                <div className="group relative flex h-32 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-primary hover:bg-primary/5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                  />
                  {screenshotPreview ? (
                    <div className="flex items-center gap-3">
                      <img src={screenshotPreview} className="h-20 w-20 rounded-lg object-cover" alt="Screenshot" />
                      <div>
                        <p className="text-xs font-bold text-emerald-500">Screenshot Uploaded!</p>
                        <p className="text-[10px] text-muted underline">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="mb-2 text-muted group-hover:text-primary transition-colors" size={24} />
                      <p className="text-xs font-medium text-muted">Click or drag to upload proof</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Details */}
          <div className="space-y-6">
            <label className="text-sm font-black text-secondary uppercase tracking-widest">Donor Information</label>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Full Name</p>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-xl border border-gray-100 bg-surface px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Email Address</p>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-xl border border-gray-100 bg-surface px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phone Number</p>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full rounded-xl border border-gray-100 bg-surface px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="98765 43210"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Note (Optional)</p>
                <input
                  {...register("message")}
                  className="w-full rounded-xl border border-gray-100 bg-surface px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Wishes or instructions"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (paymentMethod === "manual" && !screenshotFile)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-5 text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {paymentMethod === "manual" ? "I Have Paid & Uploaded" : `Process Payment of ₹${selectedAmount?.toLocaleString() || ""}`}
          </button>

          <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest flex items-center justify-center gap-1">
            <Shield size={12} className="text-emerald-500" /> Secure Payment SSL Encrypted
          </p>
        </form>

        {/* Sidebar Info */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl bg-secondary p-8 text-white shadow-xl">
            <h3 className="text-xl font-black uppercase tracking-tighter">Impact Summary</h3>
            <p className="mt-2 text-sm text-gray-400">Your ₹{selectedAmount?.toLocaleString()} donation will provide:</p>

            <div className="mt-8 space-y-6">
              {[
                { value: Math.floor(selectedAmount / 100), label: "Days of Clean Water", icon: "💧" },
                { value: Math.floor(selectedAmount / 500), label: "Nutritious Meal Kits", icon: "🍱" },
                { value: Math.floor(selectedAmount / 2500), label: "Education Toolkits", icon: "📚" },
              ].filter(item => item.value > 0).map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black leading-none">{item.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-black text-secondary uppercase tracking-tighter">80G Certificate</h3>
            <p className="mt-2 text-sm text-muted text-gray-500">
              All donations are eligible for tax exemption under IT Section 80G. Certificate will be sent to your email.
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-500 p-8 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <Info size={24} className="shrink-0" />
              <div>
                <h4 className="font-black uppercase tracking-widest italic">Why Scan & Pay?</h4>
                <p className="mt-2 text-sm text-emerald-50 font-medium leading-relaxed">
                  UPI payments are instant and have **0% platform fees**, meaning 100% of your amount goes directly to the cause.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-[#2d2d4e] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-black lg:text-6xl tracking-tighter uppercase leading-none">
            Make an{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic px-2 py-1 box-decoration-clone inline-block">
              Impact
            </span>
          </h1>
          <p className="mt-6 text-lg font-medium text-gray-400">
            Choose a payment method and complete your secure contribution.
          </p>
        </div>
      </section>

      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <DonateContent />
      </Suspense>
    </div>
  );
}
