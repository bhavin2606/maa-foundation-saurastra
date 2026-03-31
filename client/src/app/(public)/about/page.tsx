import { Heart, Users, Target, Award } from "lucide-react";

const values = [
  { icon: <Heart size={28} />, title: "Compassion", desc: "We believe in the power of empathy and kindness to transform lives." },
  { icon: <Users size={28} />, title: "Community", desc: "Building strong communities through collective effort and shared purpose." },
  { icon: <Target size={28} />, title: "Impact", desc: "Every initiative is designed to create measurable, lasting change." },
  { icon: <Award size={28} />, title: "Transparency", desc: "Complete accountability in how every rupee is utilized." },
];

const team = [
  { name: "Priya Sharma", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop" },
  { name: "Rahul Verma", role: "Operations Head", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
  { name: "Anita Desai", role: "Community Lead", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-[#2d2d4e] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold lg:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Maa Foundation
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Since 2015, we have been working tirelessly to uplift the
            underprivileged through education, food, healthcare, and community
            empowerment programs across India.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-secondary">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-muted leading-relaxed">
              To create a world where every individual, regardless of their
              background, has access to basic necessities — food, clean water,
              education, and healthcare. We aim to bridge the gap between those
              who want to help and those who need it most.
            </p>
            <p className="text-muted leading-relaxed">
              Through innovative campaigns, community-driven reels, and
              transparent fund management, we ensure every donation reaches its
              intended purpose with maximum impact.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Our mission"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-20">
        <div className="container px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-secondary">
            Our Core <span className="text-primary">Values</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {v.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-secondary">{v.title}</h3>
                <p className="text-sm text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-secondary">
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {team.map((member, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-secondary">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
