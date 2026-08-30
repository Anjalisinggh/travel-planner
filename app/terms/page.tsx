import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — Voyage",
  description: "Terms for using the Voyage travel planning experience.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <p className="kicker">Legal</p>
      <h1>Terms of Use</h1>
      <p>
        Voyage is a planning tool. Itineraries, budgets, weather, and stay suggestions are estimates
        meant to help you explore options — not guaranteed bookings, prices, or travel advice.
      </p>
      <p>
        You are responsible for confirming visas, transport, accommodation, and safety requirements
        before you travel. Always verify live prices and availability with providers directly.
      </p>
      <p>
        By using Voyage, you agree to use the service lawfully and not to misuse trip generation or
        related APIs in ways that could harm the platform or other users.
      </p>
      <Link className="text-link" href="/">Back to Voyage <span>↗</span></Link>
    </main>
  );
}
