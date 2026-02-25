/**
 * MOCK LOCAL STORAGE DATABASE
 * This completely replaces the backend API to satisfy the user's constraint:
 * "frontend only use local storage for database, strictly restrict backend apis"
 */
import { type User, type Activity, type Registration, type InsertActivity, type InsertRegistration } from "@shared/schema";

const STORAGE_KEY = "student_portal_db";

interface DatabaseState {
  users: User[];
  activities: Activity[];
  registrations: Registration[];
  sessionUserId: number | null;
}

const INITIAL_DATA: DatabaseState = {
  users: [
    { id: 1, name: "Admin Alice", role: "admin" },
    { id: 2, name: "Student Bob", role: "student" },
    { id: 3, name: "Student Charlie", role: "student" },
  ],
  activities: [
    { id: 1, name: "Varsity Soccer Tryouts", description: "Open tryouts for the varsity soccer team. Bring cleats and water.", date: new Date(Date.now() + 86400000 * 2).toISOString(), category: "sport" },
    { id: 2, name: "Debate Club Meeting", description: "Weekly meeting. Topic: The impact of AI on education.", date: new Date(Date.now() + 86400000 * 5).toISOString(), category: "club" },
    { id: 3, name: "Spring Hackathon", description: "Annual 24-hour coding competition. Food provided!", date: new Date(Date.now() + 86400000 * 14).toISOString(), category: "event" },
  ],
  registrations: [
    { id: 1, userId: 2, activityId: 2, status: "registered" },
    { id: 2, userId: 3, activityId: 3, status: "registered" },
  ],
  sessionUserId: null,
};

class LocalStorageDB {
  private getDb(): DatabaseState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveDb(INITIAL_DATA);
        return INITIAL_DATA;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse local storage DB", e);
      return INITIAL_DATA;
    }
  }

  private saveDb(state: DatabaseState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Simulate network delay
  private async delay<T>(value: T, ms = 300): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  }

  // --- Auth Methods ---
  async getUsers() {
    return this.delay(this.getDb().users);
  }

  async getCurrentUser() {
    const db = this.getDb();
    const user = db.users.find(u => u.id === db.sessionUserId) || null;
    return this.delay(user);
  }

  async login(userId: number) {
    const db = this.getDb();
    db.sessionUserId = userId;
    this.saveDb(db);
    return this.delay(db.users.find(u => u.id === userId)!);
  }

  async logout() {
    const db = this.getDb();
    db.sessionUserId = null;
    this.saveDb(db);
    return this.delay(true);
  }

  // --- Activity Methods ---
  async getActivities() {
    return this.delay(this.getDb().activities);
  }

  async createActivity(activity: InsertActivity) {
    const db = this.getDb();
    const newActivity: Activity = {
      ...activity,
      id: Math.max(0, ...db.activities.map(a => a.id)) + 1,
    };
    db.activities.push(newActivity);
    this.saveDb(db);
    return this.delay(newActivity);
  }

  async updateActivity(id: number, updates: Partial<InsertActivity>) {
    const db = this.getDb();
    const index = db.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Activity not found");
    
    db.activities[index] = { ...db.activities[index], ...updates };
    this.saveDb(db);
    return this.delay(db.activities[index]);
  }

  async deleteActivity(id: number) {
    const db = this.getDb();
    db.activities = db.activities.filter(a => a.id !== id);
    // Cleanup related registrations
    db.registrations = db.registrations.filter(r => r.activityId !== id);
    this.saveDb(db);
    return this.delay(true);
  }

  // --- Registration Methods ---
  async getRegistrations() {
    return this.delay(this.getDb().registrations);
  }

  async createRegistration(registration: InsertRegistration) {
    const db = this.getDb();
    
    // Check if already registered
    const exists = db.registrations.find(
      r => r.userId === registration.userId && r.activityId === registration.activityId
    );
    if (exists) throw new Error("Already registered for this activity");

    const newReg: Registration = {
      ...registration,
      id: Math.max(0, ...db.registrations.map(r => r.id)) + 1,
    };
    db.registrations.push(newReg);
    this.saveDb(db);
    return this.delay(newReg);
  }

  async updateRegistrationStatus(id: number, status: string) {
    const db = this.getDb();
    const index = db.registrations.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Registration not found");
    
    db.registrations[index].status = status;
    this.saveDb(db);
    return this.delay(db.registrations[index]);
  }

  async deleteRegistration(id: number) {
    const db = this.getDb();
    db.registrations = db.registrations.filter(r => r.id !== id);
    this.saveDb(db);
    return this.delay(true);
  }
}

export const localDb = new LocalStorageDB();
