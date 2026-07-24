import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voyage — Japan, made unforgettable",
  description: "A premium AI travel concierge that turns your dream trip into a beautifully paced journey.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://voyage.travel"),
  openGraph: {
    title: "Voyage — Japan, made unforgettable",
    description: "Seven days. Three cities. One seamless journey.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Voyage Japan journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voyage — Japan, made unforgettable",
    description: "Seven days. Three cities. One seamless journey.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
