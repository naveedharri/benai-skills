"use client";

import Image from "next/image";

const logos = [
  { name: "Obsidian",  slug: "obsidian"  },
  { name: "Notion",    slug: "notion"    },
  { name: "Slack",     slug: "slack"     },
  { name: "Zoom",      slug: "zoom"      },
  { name: "Fireflies", slug: "fireflyai" },
  { name: "Linear",    slug: "linear"    },
  { name: "GitHub",    slug: "github"    },
  { name: "Figma",     slug: "figma"     },
  { name: "Loom",      slug: "loom"      },
  { name: "Calendly",  slug: "calendly"  },
  { name: "HubSpot",   slug: "hubspot"   },
  { name: "Zapier",    slug: "zapier"    },
];

export default function LogosStrip() {
  const items = [...logos, ...logos];

  return (
    <section className="py-[40px] border-y border-[#f0f0f0] overflow-hidden bg-white">
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((logo, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-[40px] opacity-40 hover:opacity-70 transition-opacity duration-200"
            >
              <Image
                src={`https://cdn.simpleicons.org/${logo.slug}`}
                alt={logo.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
                unoptimized
              />
              <span
                className="text-[#101011] text-[13px] font-[600] tracking-[-0.3px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {logo.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
