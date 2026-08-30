import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voyage — journeys, composed by hand",
  description: "An editorial travel atelier that shapes your dream trip into a beautifully paced journey.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://voyage.travel"),
  openGraph: {
    title: "Voyage — journeys, composed by hand",
    description: "Seven days. Three cities. One seamless journey.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Voyage journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voyage — journeys, composed by hand",
    description: "Seven days. Three cities. One seamless journey.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
