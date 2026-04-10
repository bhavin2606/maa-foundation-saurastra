"use client";

import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useSubmitMessageMutation } from "@/store/api/contactApi";
import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitMessage, { isLoading: isSubmitting }] = useSubmitMessageMutation();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      await submitMessage(data).unwrap();
      setSubmitSuccess(true);
      reset();
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setSubmitError(err.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass-morphism px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
            Get In Touch
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-secondary tracking-tighter leading-[0.85] mb-12">
            Let's Start <br/>
            <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent italic px-6">
              A Dialogue
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted font-medium leading-relaxed">
            Whether you want to volunteer, donate, or just say hello, 
            we're here to listen and collaborate for a better future.
          </p>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8">
              {[
                { icon: <Mail size={32} />, label: "Email Us", val: "info@maafoundation.com", sub: "Support & Inquiries" },
                { icon: <Phone size={32} />, label: "Call Us", val: "+91 98765 43210", sub: "Mon - Sat, 9am - 6pm" },
                { icon: <MapPin size={32} />, label: "Visit Us", val: "Rajkot, Gujarat", sub: "Maa Foundation HQ" },
              ].map((item, i) => (
                <div key={i} className="group p-10 rounded-[48px] glass-card border-slate-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-premium">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:rotate-12 group-hover:shadow-glow">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{item.label}</p>
                  <h3 className="text-2xl font-black text-secondary tracking-tight mb-1">{item.val}</h3>
                  <p className="text-sm font-medium text-muted">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[60px] blur-2xl opacity-50" />
                <div className="relative glass-morphism p-12 md:p-16 rounded-[56px] border-white shadow-premium">
                  {submitSuccess && (
                    <div className="mb-10 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 text-emerald-700 animate-in fade-in slide-in-from-top-4 duration-500">
                      <CheckCircle2 size={24} className="shrink-0" />
                      <div>
                        <p className="font-black uppercase tracking-wider text-xs">Message Sent!</p>
                        <p className="text-sm font-medium opacity-80">Thank you for reaching out. We'll get back to you soon.</p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-10 p-6 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-4 duration-500">
                      <AlertCircle size={24} className="shrink-0" />
                      <div>
                        <p className="font-black uppercase tracking-wider text-xs">Submission Error</p>
                        <p className="text-sm font-medium opacity-80">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-1 space-y-4">
                      <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Full Name</label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        placeholder="John Doe"
                        className={`w-full rounded-2xl border ${errors.name ? 'border-red-500' : 'border-slate-100'} bg-surface px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow`}
                      />
                      {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.name.message}</p>}
                    </div>
                    <div className="md:col-span-1 space-y-4">
                      <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Email Address</label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        placeholder="john@example.com"
                        className={`w-full rounded-2xl border ${errors.email ? 'border-red-500' : 'border-slate-100'} bg-surface px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow`}
                      />
                      {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.email.message}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Subject</label>
                      <input
                        {...register("subject", { required: "Subject is required" })}
                        placeholder="How can we help?"
                        className={`w-full rounded-2xl border ${errors.subject ? 'border-red-500' : 'border-slate-100'} bg-surface px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow`}
                      />
                      {errors.subject && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.subject.message}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Message</label>
                      <textarea
                        {...register("message", { required: "Message is required" })}
                        rows={6}
                        placeholder="Tell us more about your mission..."
                        className={`w-full rounded-3xl border ${errors.message ? 'border-red-500' : 'border-slate-100'} bg-surface px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow resize-none`}
                      />
                      {errors.message && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.message.message}</p>}
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-secondary py-8 text-xl font-black uppercase tracking-[0.2em] text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                      >
                        <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Send size={24} className="relative z-10" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
