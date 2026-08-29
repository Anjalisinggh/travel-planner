import type { Trip, TripInput } from "../travel-types";
import { generateItinerary } from "./ai-planning-service";
import { getDb } from "../../db";
import { activities, itineraryDays, trips } from "../../db/schema";
import { eq } from "drizzle-orm";

const memory = new Map<string, Trip>();
export function createTrip(input: TripInput) { const trip = generateItinerary(input); trip.status = "draft"; trip.days = []; memory.set(trip.id, trip); return trip; }
export function getTrip(id: string) { return memory.get(id) ?? null; }
export function updateTrip(id: string, patch: Partial<TripInput>) { const current = memory.get(id); if (!current) return null; const next = { ...current, ...patch, updatedAt: new Date().toISOString() }; memory.set(id, next); return next; }
export function saveTrip(trip: Trip) { memory.set(trip.id, trip); return trip; }
export function removeTrip(id: string) { return memory.delete(id); }

// D1 is optional in local previews. These helpers make the same API durable as
// soon as the platform binds DB, while retaining a useful fallback otherwise.
export async function persistTrip(trip: Trip) {
  try {
    const db = getDb();
    await db.insert(trips).values({ id: trip.id, destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate, travelers: trip.travelers, budget: trip.budget, preferences: trip.preferences ?? {}, status: trip.status, createdAt: new Date(trip.createdAt), updatedAt: new Date(trip.updatedAt) }).onConflictDoUpdate({ target: trips.id, set: { destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate, travelers: trip.travelers, budget: trip.budget, preferences: trip.preferences ?? {}, status: trip.status, updatedAt: new Date(trip.updatedAt) } });
    await db.delete(itineraryDays).where(eq(itineraryDays.tripId, trip.id));
    for (const day of trip.days) {
      await db.insert(itineraryDays).values({ id: day.id, tripId: trip.id, date: day.date, dayNumber: day.dayNumber, title: day.title, notes: day.notes });
      if (day.activities.length) await db.insert(activities).values(day.activities.map((activity) => ({ id: activity.id, itineraryDayId: day.id, name: activity.name, location: activity.location, startTime: activity.startTime, endTime: activity.endTime, durationMinutes: activity.durationMinutes, category: activity.category, estimatedCost: activity.estimatedCost, notes: activity.notes })));
    }
  } catch { /* D1 unavailable: in-memory fallback remains active. */ }
  memory.set(trip.id, trip);
  return trip;
}

export async function loadPersistedTrip(id: string) {
  const cached = memory.get(id); if (cached) return cached;
  try {
    const db = getDb(); const [trip] = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
    if (!trip) return null;
    const dayRows = await db.select().from(itineraryDays).where(eq(itineraryDays.tripId, id));
    const days = await Promise.all(dayRows.map(async (day) => ({ ...day, notes: day.notes ?? "", activities: await db.select().from(activities).where(eq(activities.itineraryDayId, day.id)) })));
    const hydrated = { ...trip, createdAt: trip.createdAt.toISOString(), updatedAt: trip.updatedAt.toISOString(), preferences: trip.preferences ?? {}, days } as Trip;
    memory.set(id, hydrated); return hydrated;
  } catch { return null; }
}
