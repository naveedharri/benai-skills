"use client"

import { motion } from "framer-motion"
import { Cpu, Layers, Lock, Workflow, Database, CloudUpload } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Engine",
    description: "Machine learning algorithms that adapt to your usage patterns and optimize workflows automatically. No manual configuration needed.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Pick and choose the modules you need. Start simple, scale complex. Every piece works independently or together.",
  },
  {
    icon: Lock,
    title: "Zero-Trust Security",
    description: "Every request is authenticated and encrypted. Your data never leaves your region. Full audit trail on every action.",
  },
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description: "Drag-and-drop interface to create complex automations in minutes. No code required, but extensible for developers.",
  },
  {
    icon: Database,
    title: "Unified Data Layer",
    description: "All your data sources in one place. Real-time sync, automatic deduplication, and smart conflict resolution.",
  },
  {
    icon: CloudUpload,
    title: "One-Click Deploy",
    description: "Push changes live instantly with built-in CI/CD. Rollback with a single click if anything goes wrong.",
  },
]

export function FeaturesIcons() {
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
            Built Different
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Every feature designed with one goal: make your work effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
