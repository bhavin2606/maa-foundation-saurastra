"use client";

import { useForm } from "react-hook-form";
import { useCreateDonationMutation } from "@/store/api/donationsApi";
import { Heart, CreditCard, Shield } from "lucide-react";

interface DonateFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  message: string;
}

const presets = [500, 1000, 2500, 5000, 10000];

export default function DonatePage() {
  const [createDonation] = useCreateDonationMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonateFormData>({ defaultValues: { amount: 1000 } });

  const selectedAmount = watch("amount");

  const onSubmit = async (data: DonateFormData) => {
    try {
      await createDonation({
        amount: data.amount,
        donorName: data.name,
        donorEmail: data.email,
        itemLabel: "General Donation",
        quantity: 1,
      }).unwrap();
      alert(`Thank you for your generous donation of ₹${data.amount}!`);
      reset();
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-[#2d2d4e] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold lg:text-5xl">
            Make a{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Donation
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Every contribution, no matter how small, makes a real difference.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-6 grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl bg-white p-8 shadow-lg lg:col-span-3"
          >
            {/* Amount Presets */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-secondary">
                Select Amount
              </label>
              <div className="grid grid-cols-5 gap-3">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setValue("amount", amt)}
                    className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                      selectedAmount === amt
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                        : "bg-surface text-secondary hover:bg-primary/10"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-secondary">
                  Or enter custom amount
                </label>
                <input
                  type="number"
                  {...register("amount", { required: true, min: 1 })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-bold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Full Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Phone</label>
              <input
                type="tel"
                {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" } })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="98765 43210"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Message (optional)</label>
              <textarea
                rows={3}
                {...register("message")}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Any message for us..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-50"
            >
              <CreditCard size={20} /> Donate ₹{selectedAmount?.toLocaleString() || ""}
            </button>
          </form>

          {/* Sidebar Info */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary">100% Secure</h3>
              <p className="mt-2 text-sm text-muted">
                All transactions are encrypted and processed through secure
                payment gateways.
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary">Tax Benefits</h3>
              <p className="mt-2 text-sm text-muted">
                All donations are eligible for tax exemption under Section 80G of
                the Income Tax Act.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
