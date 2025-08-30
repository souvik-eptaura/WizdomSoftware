import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LogOut, 
  Users, 
  Mail, 
  Calendar,
  ExternalLink,
  Building,
  MessageSquare,
  User
} from "lucide-react";
import { format } from "date-fns";
import type { ContactSubmission } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch admin user data
  const { data: adminUser } = useQuery({
    queryKey: ["/api/admin/user"],
    retry: false,
  });

  // Fetch contact submissions
  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the admin panel",
      });
      queryClient.clear();
      onLogout();
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getServiceBadgeColor = (service: string | null) => {
    if (!service) return "secondary";
    switch (service.toLowerCase()) {
      case "custom software development":
        return "default";
      case "ai saas products":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary" data-testid="admin-dashboard-title">
                Admin Dashboard
              </h1>
              {adminUser && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span data-testid="admin-username">{adminUser.username}</span>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="stat-total-submissions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="total-submissions-count">
                {submissions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All time contact form submissions
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-recent-submissions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Submissions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="recent-submissions-count">
                {submissions.filter(s => {
                  const submissionDate = new Date(s.createdAt);
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return submissionDate >= sevenDaysAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-unique-companies">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="unique-companies-count">
                {new Set(submissions.filter(s => s.company).map(s => s.company)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Companies that contacted us
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Submissions Table */}
        <Card data-testid="contact-submissions-table">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Contact Submissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8" data-testid="no-submissions-message">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No contact submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id} data-testid={`submission-row-${submission.id}`}>
                        <TableCell className="font-medium" data-testid={`name-${submission.id}`}>
                          {submission.firstName} {submission.lastName}
                        </TableCell>
                        <TableCell data-testid={`email-${submission.id}`}>
                          <a 
                            href={`mailto:${submission.email}`}
                            className="text-primary hover:underline flex items-center space-x-1"
                          >
                            <span>{submission.email}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell data-testid={`company-${submission.id}`}>
                          {submission.company || (
                            <span className="text-muted-foreground italic">No company</span>
                          )}
                        </TableCell>
                        <TableCell data-testid={`service-${submission.id}`}>
                          {submission.service ? (
                            <Badge variant={getServiceBadgeColor(submission.service)}>
                              {submission.service}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground italic">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs" data-testid={`message-${submission.id}`}>
                          <div className="truncate" title={submission.message}>
                            {submission.message}
                          </div>
                        </TableCell>
                        <TableCell data-testid={`date-${submission.id}`}>
                          {format(new Date(submission.createdAt), "MMM d, yyyy h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}