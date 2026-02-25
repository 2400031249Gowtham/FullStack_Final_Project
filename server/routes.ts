import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Strictly restricted backend APIs as requested.
  // No API routes are defined; the frontend uses local storage for all data.
  return httpServer;
}
