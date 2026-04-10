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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-20 lg:pt-32">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-float" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-12 text-left">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full glass-morphism px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Making a Difference
              </span>
              <h1 className="text-6xl font-black leading-[0.9] text-secondary lg:text-8xl xl:text-9xl tracking-tighter">
                Fuel Hope, <br/>
                <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent italic px-8">
                  Change Lives
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-xl lg:text-2xl leading-relaxed text-muted font-medium">
              Maa Foundation is a catalyst for change, dedicated to empowering 
              the underprivileged through sustainable community action.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <Link
                href="/donate"
                className="group relative overflow-hidden rounded-full bg-secondary px-12 py-6 text-base font-black uppercase tracking-widest text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">Donate Now</span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
              <Link
                href="/campaigns"
                className="rounded-full border-2 border-secondary/10 px-12 py-6 text-base font-black uppercase tracking-widest text-secondary transition-all hover:border-primary hover:text-primary active:scale-95"
              >
                Our Initiatives
              </Link>
            </div>
          </div>
          
          <div className="relative flex-1 w-full max-w-2xl lg:mt-0">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[60px] blur-2xl opacity-50 transition-all duration-700 group-hover:opacity-80" />
              <div className="relative overflow-hidden rounded-[56px] shadow-premium aspect-[4/5] lg:h-[700px] border-[12px] border-white glass-morphism">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="A child smiling"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Floating Impact Card */}
                <div className="absolute bottom-10 left-10 right-10 glass-morphism p-8 rounded-[32px] border-white/40 flex items-center gap-6 animate-float">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-glow">
                    <Heart size={32} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-secondary tracking-tighter leading-none">12,500+</h4>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1">Lives Impacted To Date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-32 bg-surface relative z-10 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center gap-8 glass-card p-12 transition-all duration-500 hover:-translate-y-3 hover:shadow-premium rounded-[48px]"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-secondary text-white shadow-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:rotate-12 group-hover:shadow-glow">
                  {stat.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-black text-secondary tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="bg-white py-40 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
              <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">Our Initiatives</span>
              <h2 className="text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.85]">
                Changing <br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic px-6">
                  The World
                </span>
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-6 group text-xl font-black text-secondary uppercase tracking-widest transition-all hover:text-primary"
            >
              All Campaigns <ArrowRight size={28} className="transition-transform group-hover:translate-x-4 text-primary" />
            </Link>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {campaigns.map((camp) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Progress Overlay */}
                  <div className="absolute top-6 right-6">
                    <div className="glass-morphism h-20 w-20 rounded-full flex items-center justify-center border-white/40">
                      <span className="text-xl font-black text-secondary">{camp.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6 transform transition-transform duration-500">
                  <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{camp.title}</h3>
                  <div className="space-y-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-glow transition-all duration-1000"
                        style={{ width: `${camp.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/60">
                      <span>Raised</span>
                      <span>Target: ₹{camp.goal}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-3xl font-black text-white">₹{camp.raised}</span>
                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="rounded-2xl glass-morphism border-white/20 text-white px-8 py-4 text-xs font-black uppercase tracking-widest transition-all hover:bg-white hover:text-secondary active:scale-95"
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
      <section className="py-48 bg-secondary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="w-full max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-primary mb-12 animate-float">
            <Target size={40} />
          </div>
          <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] mb-12">
            Real Impact <br/>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent italic bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] px-10">
              In Motion
            </span>
          </h2>
          <p className="text-xl md:text-2xl font-medium text-slate-400 leading-relaxed mb-20 max-w-3xl mx-auto">
            Experience the journey of transformation. Watch our impact stories directly 
            and support specific causes with a single click.
          </p>
          <Link
            href="/reels"
            className="group relative inline-flex items-center gap-6 rounded-full bg-primary px-16 py-8 text-xl font-black uppercase tracking-[0.2em] text-white shadow-glow transition-all hover:bg-white hover:text-secondary hover:-translate-y-2 active:scale-95"
          >
            Watch Reels & Support <ArrowRight size={28} className="transition-transform group-hover:translate-x-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
