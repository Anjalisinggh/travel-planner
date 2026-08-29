/** Provider-neutral routing boundary; credentials belong in server-only env vars. */
export type RouteEstimate = { distanceKm: number; durationMinutes: number };
export interface MapsService { estimate(origin: string, destination: string): Promise<RouteEstimate>; }
export const mapsService: MapsService = { async estimate() { return { distanceKm: 2.4, durationMinutes: 18 }; } };
