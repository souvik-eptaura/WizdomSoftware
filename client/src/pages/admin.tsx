import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./admin-login";
import AdminDashboard from "./admin-dashboard";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    // Invalidate and refetch admin user data after successful login
    queryClient.invalidateQueries({ queryKey: ["/api/admin/user"] });
  };

  const handleLogout = () => {
    // Clear all queries and reset authentication state
    queryClient.clear();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}