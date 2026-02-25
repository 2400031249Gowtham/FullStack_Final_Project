// No backend storage required since the app uses strictly local storage on the frontend.
export interface IStorage {}
export class MemStorage implements IStorage {}
export const storage = new MemStorage();
