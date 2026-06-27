"use client"

import { motion } from "framer-motion"
import { UserPlus, Settings, Rocket, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { icon: UserPlus, title: "Sign Up", description: "Create your account in 30 seconds. No credit card needed." },
  { icon: Settings, title: "Configure", description: "Connect your tools and customize your workspace in minutes." },
  { icon: Rocket, title: "Launch", description: "Start using immediately. Import existing data with one click." },
  { icon: TrendingUp, title: "Grow", description: "Watch your metrics improve as our AI optimizes your workflows." },
]

export function ProcessCards() {
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
            Up and Running in Minutes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform how you work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full text-center bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
