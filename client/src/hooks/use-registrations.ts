import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localDb } from "../lib/storage";
import { type InsertRegistration } from "@shared/schema";
import { useToast } from "./use-toast";

export function useRegistrations() {
  return useQuery({
    queryKey: ["registrations"],
    queryFn: () => localDb.getRegistrations(),
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: InsertRegistration) => localDb.createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({ title: "Successfully registered!" });
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      localDb.updateRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({ title: "Status updated successfully" });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => localDb.deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({ title: "Registration cancelled" });
    },
  });
}
