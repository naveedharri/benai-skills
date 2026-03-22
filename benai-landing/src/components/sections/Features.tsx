"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Meeting Intelligence",
    desc: "BENAI captures every decision, action item, and insight from your meetings — automatically filed to the right project.",
    icon: "✦",
  },
  {
    title: "Context Memory",
    desc: "Your AI remembers your priorities, relationships, and decisions. No more re-explaining yourself — it knows you.",
    icon: "◈",
  },
  {
    title: "Daily Intelligence",
    desc: "BENAI surfaces the right information at the right moment — before your next call, decision, or delivery.",
    icon: "⬡",
  },
];

export default function Features() {
  return (
    <section className="pt-[140px] pb-[140px] bg-white" id="features">
      <div className="max-w-[1189px] mx-auto px-[30px]">
        {/* Header */}
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
            The ultimate knowledge system
            <br />
            for leaders who move fast
          </h2>
          <p
            className="text-[#2B2B2C] max-w-[500px] mx-auto font-[500] tracking-[-0.02em]"
            style={{
              fontFamily: "'Switzer', 'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "25.2px",
            }}
          >
            Everything you need to capture, connect, and act on your most important knowledge — all inside Obsidian.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-[25px] border border-[#f0f0f0] bg-white p-[40px] hover:shadow-lg hover:border-[#e0e0e0] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-[28px] mb-6 text-[#101011]">{f.icon}</div>
              <h3
                className="text-[#101011] font-[600] mb-3 tracking-[-0.44px]"
                style={{
                  fontFamily: "'Inter Display', 'Inter', sans-serif",
                  fontSize: "22px",
                  lineHeight: "24.2px",
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-[#2B2B2C] font-[500] tracking-[-0.02em]"
                style={{
                  fontFamily: "'Switzer', 'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
