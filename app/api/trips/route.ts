import { createTrip, persistTrip } from "../../../lib/services/trip-repository";
import type { TripInput } from "../../../lib/travel-types";

function valid(payload: Partial<TripInput>): payload is TripInput {
  return Boolean(payload.destination?.trim() && /^\d{4}-\d{2}-\d{2}$/.test(payload.startDate ?? "") && /^\d{4}-\d{2}-\d{2}$/.test(payload.endDate ?? "") && Number(payload.travelers) > 0 && Number(payload.budget) > 0);
}
export async function POST(request: Request) {
  try { const payload = await request.json() as Partial<TripInput>; if (!valid(payload)) return Response.json({ error: "destination, valid dates, travelers and budget are required" }, { status: 400 }); const trip = createTrip({ ...payload, destination: payload.destination.trim() }); await persistTrip(trip); return Response.json({ trip }, { status: 201 }); }
  catch { return Response.json({ error: "Unable to create trip" }, { status: 500 }); }
}
