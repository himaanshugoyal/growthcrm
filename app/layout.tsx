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
      default: "GrowthOS — Turn WhatsApp conversations into revenue",
      template: "%s · GrowthOS",
    },
    description:
      "Capture, qualify and convert WhatsApp leads with one AI-powered inbox, pipeline and revenue attribution workspace.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "GrowthOS — Turn WhatsApp conversations into revenue",
      description:
        "Capture, qualify and convert WhatsApp leads with one AI-powered growth CRM.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1726, height: 911, alt: "GrowthOS — Turn WhatsApp conversations into revenue" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "GrowthOS — Turn WhatsApp conversations into revenue",
      description: "Capture, qualify and convert WhatsApp leads with one AI-powered growth CRM.",
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
