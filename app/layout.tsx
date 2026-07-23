import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: {
      default: "GrowthOS — AI Growth CRM",
      template: "%s · GrowthOS",
    },
    description:
      "The founder command center for turning product demand into paying, satisfied customers.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "GrowthOS — Demand to delighted customers",
      description:
        "One focused AI Growth CRM across your products, campaigns, conversations, and revenue.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "GrowthOS — Demand to delighted customers" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "GrowthOS — Demand to delighted customers",
      description: "One focused AI Growth CRM across products, campaigns, conversations, and revenue.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
