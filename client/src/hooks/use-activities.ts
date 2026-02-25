import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localDb } from "../lib/storage";
import { type InsertActivity } from "@shared/schema";
import { useToast } from "./use-toast";

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => localDb.getActivities(),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: InsertActivity) => localDb.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({ title: "Activity created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create activity", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<InsertActivity> }) => 
      localDb.updateActivity(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({ title: "Activity updated successfully" });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => localDb.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({ title: "Activity deleted successfully" });
    },
  });
}
