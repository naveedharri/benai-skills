import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import LogosStrip from "@/components/sections/LogosStrip";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedQuote from "@/components/sections/FeaturedQuote";
import PowerUps from "@/components/sections/PowerUps";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-full bg-white">
      <Navbar />
      <div className="pt-[80px]">
        <Hero />
        <LogosStrip />
        <Features />
        <HowItWorks />
        <FeaturedQuote />
        <PowerUps />
        <Testimonials />
        <Pricing />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
