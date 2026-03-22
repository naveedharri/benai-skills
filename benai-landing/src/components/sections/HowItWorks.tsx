"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Book a call",
    desc: "We set up your personal BENAI vault inside Obsidian — configured to your role, projects, and the way you work.",
  },
  {
    num: "02",
    title: "Connect your world",
    desc: "Link your meetings, notes, and decisions. BENAI starts capturing context from day one — no manual input needed.",
  },
  {
    num: "03",
    title: "Think with your AI",
    desc: "Ask questions, get briefings, surface forgotten decisions. Your AI chief of staff is always ready — and always remembers.",
  },
];

export default function HowItWorks() {
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
            className="text-[#101011] font-[700] tracking-[-0.04em]"
            style={{
              fontFamily: "'Inter Display', 'Inter', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: "1.1",
              letterSpacing: "-1.92px",
            }}
          >
            Get started. Get smart. Stay sharp.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <p
                className="text-[#101011] font-[700] mb-4 opacity-20"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "-0.3px",
                }}
              >
                {step.num}
              </p>
              <h3
                className="text-[#101011] font-[600] mb-3 tracking-[-0.44px]"
                style={{
                  fontFamily: "'Inter Display', 'Inter', sans-serif",
                  fontSize: "22px",
                  lineHeight: "24.2px",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-[#2B2B2C] font-[500] tracking-[-0.02em]"
                style={{
                  fontFamily: "'Switzer', 'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex items-center gap-3"
        >
          <span
            className="text-[13px] font-[500] text-[#2B2B2C]"
            style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}
          >
            Works inside Obsidian · Windows &amp; Mac
          </span>
        </motion.div>
      </div>
    </section>
  );
}
