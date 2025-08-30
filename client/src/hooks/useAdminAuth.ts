import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/admin/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}