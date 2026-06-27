"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How long does it take to see results?",
    answer: "Most clients see measurable improvements within the first 30 days. Significant results typically appear within 60-90 days depending on your starting point and goals.",
  },
  {
    question: "What if it doesn't work for my business?",
    answer: "We offer a satisfaction guarantee. If you're not seeing progress within the first 30 days, we'll refund your investment in full — no questions asked.",
  },
  {
    question: "Do I need technical expertise?",
    answer: "Not at all. Our platform is designed for non-technical users. We handle the complex stuff so you can focus on running your business.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your dashboard.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include email support. Professional and Enterprise plans get priority support with guaranteed response times and a dedicated success manager.",
  },
]

export function FaqAccordion() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know. Can't find your answer? Reach out to our team.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border rounded-xl px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
