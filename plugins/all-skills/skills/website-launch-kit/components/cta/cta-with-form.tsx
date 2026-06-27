"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function CtaWithForm() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-foreground text-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Let's Talk About Your Growth
            </h2>
            <p className="text-lg opacity-80 mb-6">
              Book a free 30-minute discovery call. We'll analyze your current situation
              and show you exactly how we can help — no strings attached.
            </p>
            <ul className="space-y-3 opacity-70">
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-background" />
                No commitment required
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-background" />
                Custom action plan included
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-background" />
                Response within 24 hours
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-background text-foreground">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6">Get Your Free Consultation</h3>
                <form className="space-y-4">
                  <Input placeholder="Full name" className="h-12 rounded-lg" />
                  <Input type="email" placeholder="Work email" className="h-12 rounded-lg" />
                  <Input placeholder="Company name" className="h-12 rounded-lg" />
                  <Button size="lg" className="w-full h-12 text-base font-medium rounded-lg">
                    Book My Free Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  We respect your privacy. No spam, ever.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
