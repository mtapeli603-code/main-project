import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Date With Dave?",
  description: "A playful Creamy Inn invitation from Dave to Shekaina.",
  openGraph: {
    title: "A Date With Dave?",
    description: "A playful Creamy Inn invitation from Dave to Shekaina.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
