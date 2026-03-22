"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    quote: "Before BENAI, we juggled five different tools to manage clients, tasks, and reports. Now it's all in one place — inside Obsidian, where I already live.",
    name: "Sofia Delgado",
    role: "Product Manager, NovaTech",
    initials: "SD",
  },
  {
    quote: "The meeting intelligence alone is worth it. BENAI captures decisions I would've forgotten, connects them to the right project, and surfaces them exactly when I need them.",
    name: "Marcus Webb",
    role: "Founder, Clearpath Studio",
    initials: "MW",
  },
  {
    quote: "I've tried every AI productivity tool. BENAI is the first one that actually feels like it understands my context — because it does. It remembers everything.",
    name: "Priya Nair",
    role: "Consultant, Strategy Partner",
    initials: "PN",
  },
  {
    quote: "My team uses BENAI for stakeholder tracking and SOPs. The difference in how quickly we can onboard new people is remarkable.",
    name: "James Okafor",
    role: "Director of Operations",
    initials: "JO",
  },
  {
    quote: "Finally a tool that works the way my brain works. BENAI connects my daily notes to my bigger goals automatically.",
    name: "Elena Vasquez",
    role: "Freelance Designer",
    initials: "EV",
  },
  {
    quote: "The combination of AI + Obsidian is genius. All my client projects, decisions, and meeting notes are connected. I don't lose context anymore.",
    name: "Tom Hutchinson",
    role: "Managing Director, Axiom Group",
    initials: "TH",
  },
];

export default function Testimonials() {
  return (
    <section className="pt-[140px] pb-[140px] bg-white" id="about">
      <div className="max-w-[1189px] mx-auto px-[30px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-[#101011] font-[700] tracking-[-0.04em] mb-4"
            style={{
              fontFamily: "'Inter Display', 'Inter', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: "1.1",
              letterSpacing: "-1.92px",
            }}
          >
            Loved by founders &amp; teams
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-[25px] border border-[#f0f0f0] bg-white p-[40px] hover:shadow-lg hover:border-[#e0e0e0] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
            >
              <p
                className="text-[#2B2B2C] font-[500] leading-relaxed tracking-[-0.02em] flex-1"
                style={{
                  fontFamily: "'Switzer', 'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-[#101011] text-white text-[12px] font-[600] flex items-center justify-center shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p
                    className="text-[#101011] font-[600] leading-tight"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {r.name}
                  </p>
                  <p
                    className="text-[#2B2B2C] opacity-60"
                    style={{
                      fontFamily: "'Switzer', 'Inter', sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    {r.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
