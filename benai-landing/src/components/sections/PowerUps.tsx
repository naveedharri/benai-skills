"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { label: "AI that learns your voice, priorities, and decision patterns over time." },
  { label: "Automatically links meeting notes to active projects and stakeholders." },
  { label: "Surfaces forgotten decisions exactly when they're relevant again." },
];

export default function PowerUps() {
  return (
    <section className="pt-[140px] pb-[140px] bg-white" id="features">
      <div className="max-w-[1189px] mx-auto px-[30px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-[#101011] font-[700] mb-8 tracking-[-0.04em]"
              style={{
                fontFamily: "'Inter Display', 'Inter', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                lineHeight: "1.1",
                letterSpacing: "-1.92px",
              }}
            >
              Power up your thinking
              <br />
              with next-gen AI memory
            </h2>

            <div className="flex flex-col gap-4 mb-10">
              {[
                { title: "Runs inside Obsidian", desc: "No new app to learn. BENAI lives inside the tool you already use — your vault is your command centre." },
                { title: "Private & local-first", desc: "Your notes stay on your machine. BENAI processes context locally — your knowledge never leaves your control." },
              ].map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#f0f0f0] p-6 bg-white hover:shadow-md transition-shadow duration-300">
                  <h3
                    className="text-[#101011] font-[600] mb-2 tracking-[-0.3px]"
                    style={{
                      fontFamily: "'Inter Display', 'Inter', sans-serif",
                      fontSize: "17px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#2B2B2C] font-[500] tracking-[-0.02em]"
                    style={{
                      fontFamily: "'Switzer', 'Inter', sans-serif",
                      fontSize: "15px",
                      lineHeight: "22px",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <ul className="flex flex-col gap-3">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[#2B2B2C] font-[500]"
                  style={{
                    fontFamily: "'Switzer', 'Inter', sans-serif",
                    fontSize: "15px",
                    lineHeight: "22px",
                  }}
                >
                  <span className="mt-1 w-[5px] h-[5px] rounded-full bg-[#101011] shrink-0" />
                  {f.label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right - image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[25px] overflow-hidden border border-[#f0f0f0] shadow-xl"
          >
            <Image
              src="/images/powerups-feature.png"
              alt="BENAI Power Features"
              width={580}
              height={640}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
