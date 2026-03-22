import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#101011] text-white pt-[80px] pb-[60px]">
      <div className="max-w-[1189px] mx-auto px-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/benai-logo.avif"
                alt="BENAI"
                width={28}
                height={28}
                className="rounded-full brightness-0 invert"
              />
              <p
                className="font-[700] text-[18px] tracking-[-0.5px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                BenAI
              </p>
            </div>
            <p
              className="text-white/50 font-[500] max-w-[300px] tracking-[-0.02em]"
              style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "14px", lineHeight: "22px" }}
            >
              Your personal AI chief of staff inside Obsidian — capturing knowledge, connecting context, helping you act faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <p
              className="text-white/40 font-[600] text-[11px] uppercase tracking-[0.08em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Product
            </p>
            <ul className="flex flex-col gap-3">
              {["Features", "Pricing", "Changelog", "Roadmap"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/60 hover:text-white transition-colors duration-200 font-[500]"
                    style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "14px" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p
              className="text-white/40 font-[600] text-[11px] uppercase tracking-[0.08em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {["About", "Blog", "Contact", "Privacy"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/60 hover:text-white transition-colors duration-200 font-[500]"
                    style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "14px" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/40 font-[500]"
            style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "13px" }}
          >
            © 2026 BENAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/40 hover:text-white/70 transition-colors duration-200 font-[500]"
                style={{ fontFamily: "'Switzer', 'Inter', sans-serif", fontSize: "13px" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
