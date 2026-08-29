export type TripPreferences = { interests?: string[]; style?: string; food?: string; activityLevel?: string; vibe?: string };
export type Activity = { id: string; name: string; location: string; startTime: string; endTime: string; durationMinutes: number; category: string; estimatedCost: number; notes: string };
export type ItineraryDay = { id: string; dayNumber: number; date: string; title: string; notes: string; activities: Activity[] };
export type TripInput = { destination: string; startDate: string; endDate: string; travelers: number; budget: number; preferences?: TripPreferences };
export type Trip = TripInput & { id: string; status: "draft" | "generated" | "optimized"; createdAt: string; updatedAt: string; days: ItineraryDay[] };
