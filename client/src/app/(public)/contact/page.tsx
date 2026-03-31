"use client";

import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Send } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // When backend is ready, replace with RTK Query mutation
    console.log("Contact form submitted:", data);
    alert("Thank you! We'll get back to you soon.");
    reset();
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-[#2d2d4e] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold lg:text-5xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            We would love to hear from you. Reach out to us anytime!
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-secondary">
              Contact <span className="text-primary">Information</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", value: "contact@maafoundation.org" },
                { icon: <Phone size={20} />, label: "Phone", value: "+91 98765 43210" },
                { icon: <MapPin size={20} />, label: "Location", value: "Mumbai, Maharashtra, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-muted">{item.label}</p>
                    <p className="font-semibold text-secondary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-2xl bg-white p-8 shadow-lg lg:col-span-3"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Subject</label>
              <input
                {...register("subject", { required: "Subject is required" })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="How can we help?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Message</label>
              <textarea
                rows={5}
                {...register("message", { required: "Message is required" })}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Write your message..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
