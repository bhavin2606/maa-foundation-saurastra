"use client";

import { useForm } from "react-hook-form";
import { Heart, Shield, QrCode, CheckCircle2, Info } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

interface DonateFormData {
  amount: number;
}

const presets = [500, 1000, 2500, 5000, 10000];

function DonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignTitle = searchParams.get("campaignTitle") || "General Donation";

  const [isSuccess, setIsSuccess] = useState(false);

  // We keep some basic form logic for the amount selector
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<DonateFormData>({
    defaultValues: {
      amount: 1000,
    }
  });

  const selectedAmount = watch("amount");

  const onSubmit = () => {
    // For Phase 1, we just transition to a "Thank You" screen with instructions
    setIsSuccess(true);
    window.scrollTo(0, 0);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center px-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-secondary">
          Thank you for your support!
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Your intent to support <strong>Maa Foundation</strong> is deeply appreciated.
          Please share your payment screenshot on WhatsApp at <strong>+91 9925685995</strong> so we can verify and send your 80G tax benefit receipt.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-secondary px-8 py-3 font-semibold text-white transition-all hover:bg-secondary/90 shadow-lg text-sm"
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
        {/* Main Content */}
        <div className="space-y-8 rounded-3xl bg-white p-6 shadow-xl shadow-gray-100 sm:p-10 lg:col-span-3">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-black text-secondary tracking-tight uppercase">Support Maa Foundation</h2>
            <p className="mt-2 text-sm text-muted">माँ फाउंडेशन में प्राप्त होने वाला दान धर्म कार्यों और सेवा गतिविधियों में इस्तेमाल किया जाता है।<br />(Donations received by Maa Foundation are utilized for religious works and social service activities.)</p>
          </div>

          {/* Amount Section */}
          {/* <div className="space-y-4">
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
          </div> */}

          {/* QR Code Section */}
          <div className="space-y-6 rounded-3xl bg-amber-50/50 p-6 border border-amber-100 border-dashed">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <img
                  src="/images/doanation-qr.jpeg"
                  alt="Maa Foundation UPI QR Code"
                  className="h-48 w-48 object-contain"
                />
              </div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Scan this QR to pay via any UPI App</p>
              <p className="mt-1 text-sm font-bold text-secondary">maafoundationbg@okaxis</p>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-secondary">How to get your 80G Receipt?</h4>
                  <ul className="mt-2 text-xs text-muted space-y-2 list-disc ml-4">
                    <li>Scan the QR code above and pay your chosen amount.</li>
                    <li>Take a screenshot of the successful transaction.</li>
                    <li>Share the screenshot with us on WhatsApp: <strong>+91 9925685995</strong></li>
                    <li>Provide your name and email to receive your tax exemption certificate.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-5 text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            I've Made the Payment
          </button>

          <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest flex items-center justify-center gap-1">
            <Shield size={12} className="text-emerald-500" /> Secure Payment via UPI
          </p>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl bg-secondary p-8 text-white shadow-xl">
            <h3 className="text-xl font-black uppercase tracking-tighter">Your Contribution</h3>
            <p className="mt-2 text-sm text-gray-400 font-medium">Your donation will directly support our initiatives for stray animals, education, and social welfare.</p>

            <div className="mt-8 space-y-6">
              {[
                { value: Math.floor(selectedAmount / 100), label: "Animal Feeding Sessions", icon: "🐕" },
                { value: Math.floor(selectedAmount / 500), label: "Resource Kits", icon: "🍱" },
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
            <h3 className="text-lg font-black text-secondary uppercase tracking-tighter">80G Tax Benefit</h3>
            <p className="mt-2 text-sm text-muted">
              All donations to Maa Foundation are tax-exempt under Section 80G of the Income Tax Act.
            </p>
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
            Scan and pay securely to support our mission.
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
