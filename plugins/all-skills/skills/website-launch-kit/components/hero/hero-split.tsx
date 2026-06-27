"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSplit() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
              Expert Consulting
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Grow Your Business with{" "}
              <span className="text-primary">Proven Strategy</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              We help ambitious businesses scale revenue, optimize operations,
              and build systems that grow without burning out.
            </p>

            <ul className="space-y-3 mb-8">
              {["Revenue growth strategy", "Operational efficiency", "Scalable systems"].map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8 text-base font-medium rounded-lg">
                Book a Free Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium rounded-lg">
                View Case Studies
              </Button>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-xl bg-card border border-border shadow-2xl p-6">
                  <div className="h-3 w-24 bg-primary/20 rounded mb-4" />
                  <div className="h-2 w-full bg-muted rounded mb-2" />
                  <div className="h-2 w-3/4 bg-muted rounded mb-6" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-lg bg-primary/10" />
                    <div className="h-16 rounded-lg bg-accent/10" />
                    <div className="h-16 rounded-lg bg-secondary/10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
