"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for solo professionals getting started.",
    features: [
      "Personal vault setup",
      "AI daily summaries",
      "Meeting notes (5/mo)",
      "Basic decision tracking",
      "Community support",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For founders and consultants who need full context.",
    features: [
      "Everything in Starter",
      "Unlimited meeting intelligence",
      "Unlimited decision tracking",
      "AI project summaries",
      "Stakeholder tracking",
      "Priority support",
    ],
    cta: "Book a call",
    highlight: true,
  },
  {
    name: "Teams",
    price: "$79",
    period: "/mo",
    desc: "For leadership teams and growing organisations.",
    features: [
      "Everything in Pro",
      "Team vault (up to 10)",
      "Department SOPs",
      "Client project tracking",
      "Onboarding templates",
      "Dedicated onboarding",
    ],
    cta: "Book a call",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className="pt-[140px] pb-[0px] bg-white" id="pricing">
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
            Flexible pricing plans
          </h2>
          <p
            className="text-[#2B2B2C] font-[500] max-w-[420px] mx-auto tracking-[-0.02em]"
            style={{
              fontFamily: "'Switzer', 'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "25.2px",
            }}
          >
            Choose a plan that grows with you. Start for free and upgrade when ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-[25px] p-[40px] flex flex-col gap-6 transition-all duration-300 ${
                plan.highlight
                  ? "bg-[#101011] text-white border border-[#101011]"
                  : "bg-white border border-[#f0f0f0] hover:shadow-lg hover:border-[#e0e0e0] hover:-translate-y-1"
              }`}
            >
              <div>
                <p
                  className={`font-[600] mb-1 tracking-[-0.2px] ${plan.highlight ? "text-white/60" : "text-[#2B2B2C]"}`}
                  style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "13px" }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className={`font-[700] tracking-[-0.04em] ${plan.highlight ? "text-white" : "text-[#101011]"}`}
                    style={{
                      fontFamily: "'Inter Display', 'Inter', sans-serif",
                      fontSize: "42px",
                      lineHeight: "1.0",
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`pb-1 font-[500] ${plan.highlight ? "text-white/60" : "text-[#2B2B2C]"}`}
                      style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "15px" }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`font-[500] tracking-[-0.02em] ${plan.highlight ? "text-white/70" : "text-[#2B2B2C]"}`}
                  style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "14px", lineHeight: "20px" }}
                >
                  {plan.desc}
                </p>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      size={14}
                      className={`mt-0.5 shrink-0 ${plan.highlight ? "text-white" : "text-[#101011]"}`}
                    />
                    <span
                      className={`font-[500] tracking-[-0.01em] ${plan.highlight ? "text-white/80" : "text-[#2B2B2C]"}`}
                      style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "14px", lineHeight: "20px" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                className={`inline-flex items-center justify-center font-[500] rounded-[30px] transition-all duration-200 hover:scale-[1.02] ${
                  plan.highlight
                    ? "bg-white text-[#101011] hover:bg-white/90"
                    : "bg-[#101011] text-white hover:bg-[#2B2B2C]"
                }`}
                style={{
                  fontFamily: "'Switzer', 'Inter', sans-serif",
                  fontSize: "14px",
                  padding: "11px 24px",
                }}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
