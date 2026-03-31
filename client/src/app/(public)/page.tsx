import Link from "next/link";
import { ArrowRight, Users, Heart, Target } from "lucide-react";

const stats = [
  { label: "Total Donations", value: "₹45,20,000", icon: <Heart fill="currentColor" size={32} /> },
  { label: "People Helped", value: "12,500+", icon: <Users size={32} /> },
  { label: "Active Campaigns", value: "24", icon: <Target size={32} /> },
];

const campaigns = [
  {
    id: 1,
    title: "Feed the Homeless: Daily Meals",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    raised: "7,50,000",
    goal: "10,00,000",
    progress: 75,
  },
  {
    id: 2,
    title: "Clean Water for Rural Schools",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    raised: "12,00,000",
    goal: "15,00,000",
    progress: 80,
  },
  {
    id: 3,
    title: "Emergency Medical Relief Fund",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    raised: "5,00,000",
    goal: "20,00,000",
    progress: 25,
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-white py-24 lg:py-40">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-10 text-left">
            <span className="inline-block rounded-full bg-primary/10 px-6 py-2 text-sm font-black text-primary border border-primary/20 uppercase tracking-widest">
              Together, we can change lives
            </span>
            <div className="space-y-4">
              <h1 className="text-6xl font-black leading-none text-secondary lg:text-8xl xl:text-9xl tracking-tighter">
                Support a Cause, <br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
                  Make a Change
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-2xl leading-relaxed text-muted font-medium">
              Maa Foundation is dedicated to empowering the underprivileged. Your
              contribution creates a lasting impact.
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <Link
                href="/donate"
                className="rounded-full bg-primary px-12 py-6 text-xl font-black text-white shadow-2xl shadow-primary/40 transition-all hover:bg-secondary hover:shadow-secondary/30 hover:-translate-y-1 active:scale-95"
              >
                Donate Now
              </Link>
              <Link
                href="/campaigns"
                className="rounded-full border-4 border-secondary/10 px-12 py-6 text-xl font-black text-secondary transition-all hover:border-primary hover:text-primary active:scale-95"
              >
                Our Campaigns
              </Link>
            </div>
          </div>
          <div className="relative flex-1 w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[60px] blur-3xl opacity-50 transition-all duration-700 group-hover:opacity-100" />
              <div className="relative overflow-hidden rounded-[48px] shadow-2xl aspect-[4/5] lg:h-[650px] border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Helping children"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute bottom-8 left-8 flex items-center gap-4 rounded-3xl bg-white/95 px-8 py-6 shadow-2xl backdrop-blur-md border border-white/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <Heart size={28} fill="white" color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-secondary leading-tight">10K+</span>
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Lives Changed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-white relative z-10 border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid gap-12 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center gap-8 rounded-[40px] border border-gray-100 bg-white p-12 shadow-sm transition-all hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-secondary text-white transition-all duration-500 group-hover:bg-primary group-hover:rotate-12 shadow-xl group-hover:shadow-primary/30">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-5xl font-black text-secondary tracking-tighter">{stat.value}</h3>
                  <p className="text-lg font-bold text-muted/60 mt-2 uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="bg-surface py-32">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <span className="text-primary font-black tracking-[0.2em] uppercase text-sm">Our Initiatives</span>
              <h2 className="text-6xl md:text-7xl font-black text-secondary tracking-tighter leading-none">
                Featured <br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Campaigns
                </span>
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-4 group text-2xl font-black text-primary transition-all hover:gap-8"
            >
              All Campaigns <ArrowRight size={32} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
          <div className="grid gap-16 md:grid-cols-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="group overflow-hidden rounded-[48px] bg-white shadow-xl border border-gray-50 transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="overflow-hidden relative aspect-[4/3]">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-8 p-10">
                  <h3 className="text-3xl font-black text-secondary leading-tight">{camp.title}</h3>
                  <div className="space-y-4">
                    <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                        style={{ width: `${camp.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-base font-black uppercase tracking-tight">
                      <span className="text-primary">{camp.progress}%</span>
                      <span className="text-muted">Goal: ₹{camp.goal}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-secondary">₹{camp.raised}</span>
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Raised</span>
                    </div>
                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="rounded-2xl bg-secondary text-white px-10 py-5 text-sm font-black transition-all hover:bg-primary shadow-lg hover:shadow-primary/30 active:scale-95"
                    >
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reels Promo Section */}
      <section className="py-40 bg-white">
        <div className="w-full max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-none mb-10">
            Real Impact <br/>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
              In Action
            </span>
          </h2>
          <p className="text-2xl font-medium text-muted leading-relaxed mb-16">
            Watch our latest reels and directly donate specific items like meals,
            notebooks, or blankets.
          </p>
          <Link
            href="/reels"
            className="inline-flex items-center gap-4 rounded-full bg-primary px-16 py-8 text-2xl font-black text-white shadow-2xl shadow-primary/40 transition-all hover:bg-secondary hover:shadow-secondary/30 hover:-translate-y-2 active:scale-95"
          >
            Watch Reels & Donate <ArrowRight size={32} />
          </Link>
        </div>
      </section>
    </div>
  );
}
