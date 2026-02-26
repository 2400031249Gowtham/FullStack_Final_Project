import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localDb } from "../lib/storage";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => localDb.getUsers(),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => localDb.getCurrentUser(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      localDb.login(username, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
    },
  });
}

export function useLoginById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => localDb.login(userId),
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => localDb.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
