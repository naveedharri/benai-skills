# Component Patterns

React + Tailwind component patterns. Use shadcn/ui for structure, then customize styling.

---

## Icon Usage

All icons use **Lucide React** (default). Install:

```bash
npm install lucide-react
```

Import icons as needed:

```typescript
import { 
  ArrowRight, 
  Check, 
  Clock, 
  Shield, 
  Zap, 
  TrendingUp,
  AlertTriangle 
} from 'lucide-react';

// Usage in JSX
<Clock className="w-6 h-6" />
<Shield className="w-8 h-8 text-primary" />
```

**Finding icons:** Use `npx better-icons search [query] --prefix lucide` to search.

See `12-visual-assets.md` for the full visual assets guide.

---

## Base Component Pattern

Every component follows this structure:

```typescript
import { cn } from "@/lib/utils";

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
  // Component-specific props
}

export function Component({ children, className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
}
```

---

## Section Wrapper

Consistent section container:

```typescript
// components/layout/section-wrapper.tsx
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "primary";
}

export function Section({
  children,
  className,
  id,
  background = "default"
}: SectionProps) {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-muted/50",
    primary: "bg-primary text-primary-foreground",
  };

  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-32",
        bgClasses[background],
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
```

---

## Hero Section

```typescript
// components/sections/hero.tsx
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroProps {
  headline: string;
  subtitle: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image?: string;
}

export function Hero({ headline, subtitle, primaryCta, secondaryCta, image }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background gradient or image */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href={primaryCta.href}>{primaryCta.text}</a>
              </Button>
              {secondaryCta && (
                <Button size="lg" variant="outline" asChild>
                  <a href={secondaryCta.href}>{secondaryCta.text}</a>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Visual */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src={image}
                alt=""
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## Problem Section

```typescript
// components/sections/problem.tsx
import { Section } from "@/components/layout/section-wrapper";
import { motion } from "framer-motion";

interface ProblemProps {
  headline: string;
  problems: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
}

export function Problem({ headline, problems }: ProblemProps) {
  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          {headline}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-lg border bg-card"
          >
            {problem.icon && (
              <div className="mb-4 text-primary">{problem.icon}</div>
            )}
            <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
            <p className="text-muted-foreground">{problem.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
```

---

## Process Section

```typescript
// components/sections/process.tsx
import { Section } from "@/components/layout/section-wrapper";
import { motion } from "framer-motion";

interface ProcessProps {
  headline: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export function Process({ headline, steps }: ProcessProps) {
  return (
    <Section background="muted">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          {headline}
        </h2>
      </div>

      <div className="relative">
        {/* Connection line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center relative"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

---

## Testimonials Section

```typescript
// components/sections/testimonials.tsx
import { Section } from "@/components/layout/section-wrapper";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

interface TestimonialsProps {
  headline: string;
  testimonials: Testimonial[];
}

export function Testimonials({ headline, testimonials }: TestimonialsProps) {
  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          {headline}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-lg bg-card border"
          >
            <blockquote className="text-lg mb-6">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
```

---

## FAQ Section

```typescript
// components/sections/faq.tsx
"use client";

import { Section } from "@/components/layout/section-wrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  headline: string;
  items: FAQItem[];
}

export function FAQ({ headline, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          {headline}
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{item.question}</span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 pt-0 text-muted-foreground">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

---

## CTA Section

```typescript
// components/sections/cta.tsx
import { Section } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTAProps {
  headline: string;
  description?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

export function CTA({ headline, description, primaryCta, secondaryCta }: CTAProps) {
  return (
    <Section background="primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
          {headline}
        </h2>
        {description && (
          <p className="text-lg mb-8 opacity-90">
            {description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <a href={primaryCta.href}>{primaryCta.text}</a>
          </Button>
          {secondaryCta && (
            <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" asChild>
              <a href={secondaryCta.href}>{secondaryCta.text}</a>
            </Button>
          )}
        </div>
      </motion.div>
    </Section>
  );
}
```

---

## Button Component

```typescript
// components/ui/button.tsx
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
```

---

## Card Component

```typescript
// components/ui/card.tsx
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-4", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
```

---

## Input Component

```typescript
// components/ui/input.tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
```

---

## Customization Principles

1. **Use CSS variables** - All colors come from theme variables
2. **Accept className prop** - Allow overrides via cn()
3. **Motion ready** - Structure supports Framer Motion
4. **Responsive first** - Mobile base, scale up
5. **Accessible** - Proper semantics, focus states, ARIA
6. **Composable** - Build complex from simple
