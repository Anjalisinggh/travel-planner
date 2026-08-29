import { loadPersistedTrip, removeTrip, saveTrip, persistTrip } from "../../../../lib/services/trip-repository";
import type { TripInput } from "../../../../lib/travel-types";
type Context = { params: Promise<{ id: string }> };
export async function GET(_: Request, { params }: Context) { const trip = await loadPersistedTrip((await params).id); return trip ? Response.json({ trip }) : Response.json({ error: "Trip not found" }, { status: 404 }); }
export async function PUT(request: Request, { params }: Context) { const id = (await params).id; const trip = await loadPersistedTrip(id); if (!trip) return Response.json({ error: "Trip not found" }, { status: 404 }); const patch = await request.json() as Partial<TripInput>; const next = saveTrip({ ...trip, ...patch, id, updatedAt: new Date().toISOString() }); await persistTrip(next); return Response.json({ trip: next }); }
export async function DELETE(_: Request, { params }: Context) { return removeTrip((await params).id) ? new Response(null, { status: 204 }) : Response.json({ error: "Trip not found" }, { status: 404 }); }
