"use client"

import { motion } from "framer-motion"
import { TrendingUp, Target, Lightbulb } from "lucide-react"

const features = [
  {
    icon: TrendingUp,
    title: "Strategic Growth Planning",
    description: "We analyze your market position, identify growth levers, and build a roadmap that turns ambitious goals into measurable milestones. No guesswork — just data-driven strategy.",
    highlights: ["Market analysis", "Growth roadmap", "KPI tracking"],
  },
  {
    icon: Target,
    title: "Precision Execution",
    description: "Strategy without execution is just a PowerPoint. We embed with your team to implement changes, track progress weekly, and course-correct in real time.",
    highlights: ["Weekly sprints", "Progress tracking", "Real-time adjustments"],
  },
  {
    icon: Lightbulb,
    title: "Lasting Systems",
    description: "We don't just solve today's problems — we build systems that keep working after we leave. Your team gets frameworks, playbooks, and processes they can run independently.",
    highlights: ["Custom playbooks", "Team training", "Self-sustaining systems"],
  },
]

export function FeaturesAlternating() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            How We Transform Your Business
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that's helped 200+ companies scale profitably.
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-32">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
