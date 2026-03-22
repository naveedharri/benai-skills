"use client";

import { motion } from "framer-motion";

export default function FeaturedQuote() {
  return (
    <section className="px-[100px] py-0 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#101011] rounded-[30px] px-[80px] py-[130px] text-center"
      >
        <blockquote
          className="text-white font-[600] max-w-[800px] mx-auto mb-8 tracking-[-0.04em]"
          style={{
            fontFamily: "'Inter Display', 'Inter', sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: "1.2",
          }}
        >
          &ldquo;You&rsquo;re not losing time. You&rsquo;re losing context. BENAI fixes that.&rdquo;
        </blockquote>
        <p
          className="text-white/60 font-[500] tracking-[-0.02em]"
          style={{
            fontFamily: "'Switzer', 'Inter', sans-serif",
            fontSize: "15px",
          }}
        >
          Naveed Harri, Founder &amp; CEO, BENAI
        </p>
      </motion.div>
    </section>
  );
}
