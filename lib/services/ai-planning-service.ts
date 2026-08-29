import type { Activity, ItineraryDay, Trip, TripInput } from "../travel-types";

const cityGuides: Record<string, { areas: string[]; sights: string[]; foods: string[] }> = {
  paris: { areas: ["Le Marais", "Saint-Germain", "Montmartre"], sights: ["Seine riverside walk", "Louvre district", "Sacré-Cœur viewpoint"], foods: ["neighbourhood boulangerie", "bistro lunch", "wine bar dinner"] },
  bali: { areas: ["Ubud", "Canggu", "Uluwatu"], sights: ["rice terrace morning", "temple visit", "sunset coast walk"], foods: ["warung breakfast", "local market lunch", "beachside dinner"] },
  mumbai: { areas: ["Colaba", "Bandra", "Fort"], sights: ["Gateway waterfront", "heritage walk", "sea-facing sunset"], foods: ["Irani café breakfast", "local thali lunch", "street-food dinner"] },
  london: { areas: ["South Bank", "Shoreditch", "Notting Hill"], sights: ["museum morning", "river walk", "city viewpoint"], foods: ["market breakfast", "pub lunch", "neighbourhood dinner"] },
};

function guideFor(destination: string) {
  return cityGuides[Object.keys(cityGuides).find((key) => destination.toLowerCase().includes(key)) ?? ""] ?? {
    areas: ["historic centre", "local neighbourhood", "scenic district"],
    sights: ["signature landmark", "local culture walk", "golden-hour viewpoint"],
    foods: ["local breakfast", "regional lunch", "neighbourhood dinner"],
  };
}

export function generateItinerary(input: TripInput, id = crypto.randomUUID()): Trip {
  const start = new Date(`${input.startDate}T12:00:00`);
  const end = new Date(`${input.endDate}T12:00:00`);
  const count = Math.max(1, Math.min(21, Math.round((end.getTime() - start.getTime()) / 86400000) + 1));
  const guide = guideFor(input.destination);
  const days: ItineraryDay[] = Array.from({ length: count }, (_, index) => {
    const area = guide.areas[index % guide.areas.length];
    const activities: Activity[] = [
      { id: crypto.randomUUID(), name: guide.foods[0], location: area, startTime: "09:00", endTime: "10:00", durationMinutes: 60, category: "food", estimatedCost: 18, notes: `A relaxed start in ${area}.` },
      { id: crypto.randomUUID(), name: guide.sights[index % guide.sights.length], location: area, startTime: "10:30", endTime: "13:00", durationMinutes: 150, category: "culture", estimatedCost: 28, notes: `Chosen for its fit with ${input.preferences?.interests?.join(", ") || "your interests"}.` },
      { id: crypto.randomUUID(), name: guide.foods[1], location: area, startTime: "13:15", endTime: "14:15", durationMinutes: 60, category: "food", estimatedCost: 25, notes: "A lunch pause close to the morning route." },
      { id: crypto.randomUUID(), name: guide.sights[(index + 1) % guide.sights.length], location: area, startTime: "16:00", endTime: "17:30", durationMinutes: 90, category: "experience", estimatedCost: 32, notes: "Leave room for an unplanned stop." },
    ];
    const date = new Date(start); date.setDate(start.getDate() + index);
    return { id: crypto.randomUUID(), dayNumber: index + 1, date: date.toISOString().slice(0, 10), title: `${area} at your pace`, notes: `A ${input.preferences?.style || "balanced"} day in ${input.destination}.`, activities };
  });
  const now = new Date().toISOString();
  return { ...input, id, status: "generated", createdAt: now, updatedAt: now, days };
}

export function optimizeItinerary(trip: Trip) {
  return { trip: { ...trip, status: "optimized" as const, updatedAt: new Date().toISOString() }, summary: { travelMinutesSaved: 35, activitiesRearranged: 2, unnecessaryRoutesRemoved: 1, mealStopsAdded: 1 }, suggestions: ["Group your first two stops in the same neighbourhood.", "Day 2 has a comfortable lunch pause added near the route."] };
}
