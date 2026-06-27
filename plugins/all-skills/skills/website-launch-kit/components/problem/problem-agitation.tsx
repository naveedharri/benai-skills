"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, DollarSign, Frown } from "lucide-react"

const painPoints = [
  { icon: Clock, text: "Spending 20+ hours/week on tasks that should take 2" },
  { icon: DollarSign, text: "Losing revenue to inefficient processes and manual errors" },
  { icon: Frown, text: "Team frustrated with tools that don't talk to each other" },
]

export function ProblemAgitation() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Sound Familiar?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              You're not alone. Most growing businesses hit the same wall.
            </p>
          </motion.div>

          <div className="space-y-6">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <point.icon className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center text-lg text-muted-foreground mt-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            There's a better way. And it doesn't require rebuilding everything from scratch.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
