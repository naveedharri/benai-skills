"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CtaBanner() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            Don't Miss the Launch
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Be the first to get access. Join the waitlist and get 50% off at launch.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 rounded-lg bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
            />
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-6 rounded-lg font-medium whitespace-nowrap"
            >
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-primary-foreground/60 mt-4">
            2,847 people already on the list. No spam.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
