"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="pt-[80px] pb-[140px] bg-white overflow-hidden relative">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #c8c8cc 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
        }}
      />
      <div className="max-w-[1189px] mx-auto px-[30px] relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-2 bg-[#101011] text-white text-[12px] font-[500] px-[10px] py-[4px] rounded-[30px]"
            style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}>
            <span className="w-[6px] h-[6px] rounded-full bg-white/60 inline-block" />
            New
          </div>
        </motion.div>

        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center text-[13px] font-[500] text-[#2B2B2C] mb-4 tracking-[-0.2px]"
          style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}
        >
          Now in early access
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-[#101011] font-[600] leading-[1.0] tracking-[-0.04em] mb-6"
          style={{
            fontFamily: "'Inter Display', 'Inter', sans-serif",
            fontSize: "clamp(48px, 7vw, 90px)",
            lineHeight: "1.0",
          }}
        >
          Think faster.
          <br />
          Remember everything.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-[#2B2B2C] font-[500] max-w-[560px] mx-auto mb-10 tracking-[-0.02em]"
          style={{
            fontFamily: "'Switzer', 'Inter', sans-serif",
            fontSize: "18px",
            lineHeight: "25.2px",
          }}
        >
          A personal AI chief of staff inside Obsidian. Captures your decisions, meetings, and knowledge — then uses it all to help you think, plan, and act faster.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <a
            href="#book"
            className="inline-flex items-center gap-3 bg-[#101011] text-white font-[500] rounded-[30px] hover:bg-[#2B2B2C] transition-all duration-200 hover:scale-[1.02]"
            style={{
              fontFamily: "'Switzer', 'Inter', sans-serif",
              fontSize: "15px",
              padding: "12px 28px",
            }}
          >
            Book a call • it&apos;s free
          </a>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 rounded-[25px] overflow-hidden border border-[#f0f0f0] shadow-2xl"
        >
          <Image
            src="/images/hero-dashboard.png"
            alt="BENAI – AI Chief of Staff Dashboard"
            width={1189}
            height={700}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
