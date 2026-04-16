import Link from "next/link";
import { Heart, Users, Target, Award, ArrowRight } from "lucide-react";

const values = [
  { icon: <Heart size={28} />, title: "Compassion", desc: "We believe in the power of empathy and kindness to transform lives." },
  { icon: <Users size={28} />, title: "Community", desc: "Building strong communities through collective effort and shared purpose." },
  { icon: <Target size={28} />, title: "Impact", desc: "Every initiative is designed to create measurable, lasting change." },
  { icon: <Award size={28} />, title: "Transparency", desc: "Complete accountability in how every rupee is utilized." },
];

const team = [
  { name: "Swargwashi Dineshbhai Chauhan", role: "Founder of Maa Foundation & Sanatan Group", image: "/images/founder.jpeg" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-40 pb-32 bg-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass-morphism px-6 py-2.5 text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">
            Our Journey
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-secondary tracking-tighter leading-[0.85] mb-12">
            The Vision Of <br />
            <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent italic px-2 py-1 box-decoration-clone inline-block">
              Maa Foundation
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted font-medium leading-relaxed">
            माँ फाउंडेशन की स्थापना 14 मार्च 2020 को स्वर्गवासी दिनेशभाई चौहान द्वारा की गई थी। हमारा मुख्य उद्देश्य सनातन धर्म के कार्यों को बढ़ावा देना और समाज में निस्वार्थ सेवा भावना को जागृत करना है। (Founded by Swargwashi Dineshbhai Chauhan on March 14, 2020, Maa Foundation is dedicated to the service of Sanatan Dharma and various social welfare activities.)
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-surface relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[48px] blur-2xl opacity-50 transition-all duration-700 group-hover:opacity-80" />
              <div className="relative rounded-[40px] overflow-hidden shadow-premium border-8 border-white glass-morphism aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Our mission in action"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">Our Mission</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tighter leading-none">
                  Empowering <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2 py-1 box-decoration-clone inline-block">Every Life</span>
                </h2>
              </div>
              <p className="text-lg text-muted font-medium leading-relaxed">
                माँ फाउंडेशन सम्पूर्ण सनातन धर्म के उत्सवों को मनाकर समाज में समरसता और एकता स्थापित करने का मुख्य लक्ष्य रखता है। हम प्राकृतिक आपदाओं में सहायता, मंदिर जीर्णोद्धार, शिक्षा, और पशु आहार जैसी सेवाओं के माध्यम से समाज को सशक्त बनाने के लिए तत्पर हैं।
              </p>
              <p className="text-lg text-muted font-medium leading-relaxed">
                माँ फाउंडेशन में प्राप्त होने वाला हर एक दान सीधे धर्म कार्यों और निस्वार्थ सेवा गतिविधियों में इस्तेमाल किया जाता है। हमारी पारदर्शिता हमारी सबसे बड़ी ताकत है।
              </p>
              <div className="pt-6">
                <Link href="/campaigns" className="inline-flex items-center gap-4 group text-lg font-black text-secondary uppercase tracking-widest transition-all hover:text-primary">
                  See Our Impact <ArrowRight size={24} className="transition-transform group-hover:translate-x-3 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">What Drives Us</span>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-none">
              Our Core <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2 py-1 box-decoration-clone">Values</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="group p-10 rounded-[48px] glass-card border-slate-100 transition-all duration-500 hover:-translate-y-4 hover:shadow-premium"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:rotate-12 group-hover:shadow-glow">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-black text-secondary mb-4 tracking-tight">{v.title}</h3>
                <p className="text-sm font-medium text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-40 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 space-y-6">
            <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">The Visionaries</span>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-none">
              Meet The <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2 py-1 box-decoration-clone">Team</span>
            </h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {team.map((member, i) => (
              <div
                key={i}
                className="group relative rounded-[56px] overflow-hidden glass-card p-4 transition-all duration-700 hover:-translate-y-4"
              >
                <div className="relative aspect-square rounded-[40px] overflow-hidden mb-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="px-6 pb-6 text-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tight mb-1">{member.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
