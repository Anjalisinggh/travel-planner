import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Voyage",
  description: "How Voyage handles your trip data and personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <p className="kicker">Legal</p>
      <h1>Privacy Policy</h1>
      <p>
        Voyage stores the trip details you enter — destination, dates, budget, and preferences — so your
        itinerary can be generated and updated. We do not sell your personal information.
      </p>
      <p>
        Weather data is fetched from Open-Meteo when you plan a trip. Map views use OpenStreetMap. Those
        services receive only the location information needed to show forecasts and routes.
      </p>
      <p>
        If you share a journey, your browser may send the trip summary through your device&apos;s native
        share sheet. We do not receive that share unless you choose to send it to us directly.
      </p>
      <Link className="text-link" href="/">Back to Voyage <span>↗</span></Link>
    </main>
  );
}
