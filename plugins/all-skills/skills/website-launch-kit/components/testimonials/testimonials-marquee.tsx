"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  { quote: "Game-changer for our workflow. 10x faster than our old process.", name: "Alex Kim", role: "CTO, Vertex", initials: "AK" },
  { quote: "The best tool we've adopted this year. Period.", name: "Rachel Torres", role: "PM, CloudBase", initials: "RT" },
  { quote: "Support is incredible. They helped us migrate in 48 hours.", name: "David Park", role: "Ops Lead, FlowState", initials: "DP" },
  { quote: "We saved $30k/month after switching. Wish we'd found it sooner.", name: "Maria Santos", role: "CFO, ScaleUp", initials: "MS" },
  { quote: "My team actually enjoys using it. That never happens with enterprise tools.", name: "Chris Lee", role: "VP Eng, Nexus", initials: "CL" },
  { quote: "Onboarding took 20 minutes. We were productive from day one.", name: "Nina Patel", role: "Director, BrightPath", initials: "NP" },
]

export function TestimonialsMarquee() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-center mb-4">
          What People Are Saying
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto">
          Join thousands of happy teams.
        </p>
      </div>

      {/* Marquee row 1 */}
      <div className="flex gap-6 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
        {[...testimonials, ...testimonials].map((t, i) => (
          <Card key={i} className="flex-shrink-0 w-[350px] bg-card">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
