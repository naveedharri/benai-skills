"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaCentered() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-foreground text-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-2xl mx-auto">
            Join thousands of teams already using our platform to grow faster.
            Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base font-medium rounded-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-medium rounded-lg border-background/20 text-background hover:bg-background/10"
            >
              Talk to Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
