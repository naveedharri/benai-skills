"use client"

import { motion } from "framer-motion"

const logos = [
  { name: "Company 1" },
  { name: "Company 2" },
  { name: "Company 3" },
  { name: "Company 4" },
  { name: "Company 5" },
]

export function LogosBar() {
  return (
    <section className="py-12 md:py-16 bg-background border-y border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-center text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted by innovative companies worldwide
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="text-xl font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-300"
            >
              {logo.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
