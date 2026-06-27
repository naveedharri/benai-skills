"use client"

import { motion } from "framer-motion"

const faqs = [
  { question: "How long is a typical engagement?", answer: "Most engagements run 3-6 months. We'll scope the exact timeline during our discovery call based on your goals." },
  { question: "What industries do you work with?", answer: "We specialize in B2B SaaS, professional services, and technology companies. Our frameworks adapt to most industries." },
  { question: "Do you offer a guarantee?", answer: "Yes. If you don't see measurable ROI within 90 days, we'll continue working for free until you do." },
  { question: "How involved do I need to be?", answer: "We need about 2-3 hours per week of your time for check-ins and approvals. We handle the heavy lifting." },
  { question: "What makes you different from other consultants?", answer: "We don't just advise — we execute. Our team embeds with yours to implement changes, not just recommend them." },
  { question: "Can you work with my existing team?", answer: "Absolutely. We're designed to complement your team, not replace them. We train and upskill as we go." },
]

export function FaqTwoColumn() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Common Questions
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
