import { generateItinerary } from "../../../../../lib/services/ai-planning-service";
import { loadPersistedTrip, persistTrip } from "../../../../../lib/services/trip-repository";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) { const trip = await loadPersistedTrip((await params).id); if (!trip) return Response.json({ error: "Trip not found" }, { status: 404 }); const generated = generateItinerary(trip, trip.id); await persistTrip(generated); return Response.json({ trip: generated }); }
