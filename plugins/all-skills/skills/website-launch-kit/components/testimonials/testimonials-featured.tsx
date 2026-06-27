"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TestimonialsFeatured() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Quote className="h-12 w-12 text-primary/30 mx-auto mb-8" />
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed mb-10">
            "Working with them was the best investment we made last year. Revenue is up 3x, our team is half the size, and I actually take weekends off now."
          </blockquote>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg text-foreground">James Davidson</p>
              <p className="text-muted-foreground">Founder & CEO, Meridian Labs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
