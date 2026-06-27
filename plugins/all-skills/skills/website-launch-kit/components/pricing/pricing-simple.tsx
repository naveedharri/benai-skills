"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const included = [
  "Full strategy session (90 min)",
  "Custom growth roadmap",
  "Weekly check-in calls",
  "Slack access for questions",
  "Templates & frameworks",
  "30-day action plan",
]

export function PricingSimple() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Investment
            </h2>
            <p className="text-lg text-muted-foreground">
              One engagement, everything included.
            </p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">$2,500</div>
                <p className="text-muted-foreground">per month, 3-month minimum</p>
              </div>

              <ul className="space-y-4 mb-10">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full h-14 text-base font-medium rounded-lg">
                Book a Discovery Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Free 30-min consultation. No commitment required.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
