import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Archivo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
