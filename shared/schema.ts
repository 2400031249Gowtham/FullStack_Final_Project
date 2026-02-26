/**
 * Shared type definitions — plain TypeScript, no backend dependencies.
 * Used by the frontend localStorage-based storage layer.
 */

// ─── Entity Types ──────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: string; // "admin" | "student"
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  date: string;
  category: string; // "club" | "sport" | "event"
}

export interface Registration {
  id: number;
  userId: number;
  activityId: number;
  status: string; // "registered" | "attended" | "cancelled"
}

// ─── Insert Types (omit auto-generated id) ─────────────────────────────────

export type InsertUser = Omit<User, "id">;
export type InsertActivity = Omit<Activity, "id">;
export type InsertRegistration = Omit<Registration, "id">;
