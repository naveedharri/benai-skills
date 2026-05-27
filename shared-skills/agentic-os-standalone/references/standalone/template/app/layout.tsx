import "./globals.css";
import type { Metadata } from "next";
import { RunToast } from "@/components/RunToast";

export const metadata: Metadata = {
  title: "{{ORG_NAME}} Command Center",
  description: "Agentic OS dashboard — connector-fed, skill-driven",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <RunToast />
      </body>
    </html>
  );
}
