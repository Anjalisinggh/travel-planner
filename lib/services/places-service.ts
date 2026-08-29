/** Provider-neutral boundary for a future Google Places, Foursquare, or OSM adapter. */
export type Place = { name: string; category: string; latitude?: number; longitude?: number; openingHours?: string };
export interface PlacesService { search(destination: string, interests: string[]): Promise<Place[]>; nearby(latitude: number, longitude: number, category?: string): Promise<Place[]>; }
export const placesService: PlacesService = {
  async search(destination, interests) { return interests.slice(0, 3).map((interest) => ({ name: `${interest} highlight in ${destination}`, category: interest })); },
  async nearby() { return []; },
};
