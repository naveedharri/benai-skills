"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#f0f0f0] h-[80px] flex items-center">
      <div className="w-full max-w-[1189px] mx-auto px-[30px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/images/benai-logo.avif"
            alt="BENAI"
            width={32}
            height={32}
            className="rounded-full"
            priority
          />
          <span
            className="font-semibold text-[16px] tracking-[-0.5px] text-[#101011]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            BenAI
          </span>
        </a>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Features", "Pricing", "Blog"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[13px] font-[500] text-[#2B2B2C] hover:text-[#101011] transition-colors duration-200"
              style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA - desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#book"
            className="text-[13px] font-[500] text-[#2B2B2C] hover:text-[#101011] transition-colors duration-200"
            style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}
          >
            Sign in
          </a>
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-[#101011] text-white text-[13px] font-[500] px-[20px] py-[9px] rounded-[30px] hover:bg-[#2B2B2C] transition-colors duration-200"
            style={{ fontFamily: "'Switzer', 'Inter', sans-serif" }}
          >
            Book a call
          </a>
        </div>

        {/* Hamburger - mobile */}
        <button
          className="md:hidden p-2 text-[#101011]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white border-b border-[#f0f0f0] px-[30px] py-6 flex flex-col gap-4 md:hidden">
          {["About", "Features", "Pricing", "Blog"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[14px] font-[500] text-[#2B2B2C]"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#book"
            className="inline-flex items-center justify-center bg-[#101011] text-white text-[14px] font-[500] px-[20px] py-[10px] rounded-[30px]"
            onClick={() => setMobileOpen(false)}
          >
            Book a call
          </a>
        </div>
      )}
    </header>
  );
}
