import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  preferences: text("preferences", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const trips = sqliteTable("trips", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  travelers: integer("travelers").notNull(),
  budget: integer("budget").notNull(),
  preferences: text("preferences", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const itineraryDays = sqliteTable("itinerary_days", {
  id: text("id").primaryKey(),
  tripId: text("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  dayNumber: integer("day_number").notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
});

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  itineraryDayId: text("itinerary_day_id").notNull().references(() => itineraryDays.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  location: text("location").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  durationMinutes: integer("duration_minutes"),
  category: text("category").notNull(),
  estimatedCost: integer("estimated_cost").notNull().default(0),
  notes: text("notes"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  openingHours: text("opening_hours"),
});
