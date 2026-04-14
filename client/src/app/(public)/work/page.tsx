import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake } from "lucide-react";
import { initiatives } from "@/lib/initiatives";

export default function WorkPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-24 right-0 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full glass-morphism px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em]">
              Seva • Shiksha • Sanskar • Paryavaran
            </span>
            <h1 className="mt-8 text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.85]">
              Our Work, <br />
              <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent italic px-6">
                Real & Regular
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-2xl text-muted font-medium leading-relaxed">
              हम छोटे-छोटे daily actions से बड़ा बदलाव लाते हैं—service with heart, and impact with consistency.
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                href="/donate"
                className="group relative overflow-hidden rounded-full bg-secondary px-12 py-6 text-base font-black uppercase tracking-widest text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">Donate / दान करें</span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
              <a
                href="#initiatives"
                className="rounded-full border-2 border-secondary/10 px-12 py-6 text-base font-black uppercase tracking-widest text-secondary transition-all hover:border-primary hover:text-primary active:scale-95"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Grid */}
      <section id="initiatives" className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-14 flex items-end justify-between gap-10 flex-col md:flex-row">
            <div className="space-y-3">
              <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">What We Do</span>
              <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter">
                सेवा के <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2">मुख्य</span> कार्य
              </h2>
            </div>
            <p className="max-w-xl text-muted font-medium leading-relaxed text-base md:text-lg">
              Each initiative has a clear purpose, a simple process, and a community-first approach.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group glass-card rounded-[40px] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-white shadow-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:rotate-6 group-hover:shadow-glow">
                    {item.icon}
                  </div>
                  <ArrowRight className="text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </div>
                <h3 className="mt-8 text-2xl font-black text-secondary tracking-tight">{item.title}</h3>
                <p className="mt-2 text-[11px] font-black text-primary uppercase tracking-[0.22em]">{item.subtitle}</p>
                <p className="mt-6 text-sm font-medium text-muted leading-relaxed line-clamp-3">{item.short}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="bg-white py-28">
        <div className="container mx-auto px-6 space-y-24">
          {initiatives.map((item, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <div
                key={item.id}
                id={item.id}
                className="grid items-center gap-14 lg:gap-20 lg:grid-cols-2 scroll-mt-32"
              >
                <div className={reversed ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-3 rounded-full glass-morphism px-5 py-2 border-white/30">
                    <span className="text-primary">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary/70">
                      Initiative
                    </span>
                  </div>
                  <h3 className="mt-6 text-4xl md:text-5xl font-black text-secondary tracking-tighter leading-tight">
                    {item.title} <span className="text-muted">/</span>{" "}
                    <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {item.subtitle}
                    </span>
                  </h3>
                  <p className="mt-6 text-base md:text-lg text-muted font-medium leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-10 space-y-3">
                    {item.bullets.map((b) => (
                      <div key={b} className="flex items-start gap-3 text-secondary">
                        <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                        <span className="text-sm md:text-base font-semibold text-secondary/80">{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-5">
                    <Link
                      href="/donate"
                      className="inline-flex items-center gap-3 rounded-2xl bg-secondary px-7 py-4 text-xs font-black uppercase tracking-widest text-white shadow-premium transition-all hover:bg-primary active:scale-95"
                    >
                      Support This Work <HeartHandshake size={18} className="text-primary" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 rounded-2xl border border-secondary/10 px-7 py-4 text-xs font-black uppercase tracking-widest text-secondary transition-all hover:border-primary hover:text-primary active:scale-95"
                    >
                      Volunteer / जुड़ें
                      <ArrowRight size={18} className="text-primary" />
                    </Link>
                  </div>
                </div>

                <div className={reversed ? "lg:order-1" : ""}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[48px] blur-2xl opacity-50 transition-all duration-700 group-hover:opacity-80" />
                    <div className="relative overflow-hidden rounded-[44px] shadow-premium border-[10px] border-white glass-morphism aspect-[4/3]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-70" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass-morphism rounded-[56px] border-white/10 p-12 md:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Join The Mission</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                Small daily seva. Big long-term impact.
              </h3>
              <p className="text-slate-300 font-medium leading-relaxed">
                Donate, volunteer, or collaborate—आपका support हमारे काम को regular और transparent बनाता है।
              </p>
            </div>
            <div className="flex flex-wrap gap-5">
              <Link
                href="/donate"
                className="rounded-full bg-primary px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-glow transition-all hover:bg-white hover:text-secondary active:scale-95"
              >
                Donate Now
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-white/15 px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:border-primary hover:text-primary active:scale-95"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

