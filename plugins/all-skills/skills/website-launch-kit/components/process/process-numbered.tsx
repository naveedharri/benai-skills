"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description: "We learn about your business, goals, and challenges. You get a clear picture of how we can help.",
  },
  {
    number: "02",
    title: "Custom Strategy",
    description: "We build a tailored roadmap with specific milestones, KPIs, and actionable next steps.",
  },
  {
    number: "03",
    title: "Execute & Optimize",
    description: "We implement the strategy alongside your team, tracking progress weekly and adjusting as needed.",
  },
  {
    number: "04",
    title: "Scale & Systemize",
    description: "Once results are proven, we build systems and train your team to maintain growth independently.",
  },
]

export function ProcessNumbered() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven 4-step process that delivers results, every time.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[27px] top-14 bottom-0 w-px bg-border" />
              )}

              {/* Number circle */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{step.number}</span>
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
