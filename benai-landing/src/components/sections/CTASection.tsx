"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="pt-[200px] pb-[200px] bg-white" id="book">
      <div className="max-w-[1189px] mx-auto px-[30px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#101011] rounded-[30px] px-[80px] py-[100px] text-center"
        >
          <h2
            className="text-white font-[700] mb-6 tracking-[-0.04em] max-w-[700px] mx-auto"
            style={{
              fontFamily: "'Inter Display', 'Inter', sans-serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: "1.1",
              letterSpacing: "-1.92px",
            }}
          >
            Your AI chief of staff
            <br />
            is ready when you are.
          </h2>
          <p
            className="text-white/70 font-[500] max-w-[420px] mx-auto mb-10 tracking-[-0.02em]"
            style={{
              fontFamily: "'Switzer', 'Inter', sans-serif",
              fontSize: "17px",
              lineHeight: "25px",
            }}
          >
            Book a free call and we&apos;ll set up your BENAI vault — built around how you actually think and work.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-[#101011] font-[600] rounded-[30px] hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]"
            style={{
              fontFamily: "'Switzer', 'Inter', sans-serif",
              fontSize: "15px",
              padding: "14px 32px",
            }}
          >
            Book a call • it&apos;s free
          </a>
        </motion.div>
      </div>
    </section>
  );
}
