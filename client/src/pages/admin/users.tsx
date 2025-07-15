import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Search,
  Shield,
  User,
  Calendar,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import { User as UserType } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdminSidebar from "@/components/admin-sidebar";
import { useState } from "react";

export default function AdminUsers() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
    }
  }, [user, authLoading, isAuthenticated, toast]);

  // For now, we'll show a basic user list with mock data since we don't have a user listing endpoint
  // In a real application, you'd create an API endpoint to list users
  const mockUsers = [
    {
      id: user?.id || "1",
      email: user?.email || "admin@example.com",
      firstName: user?.firstName || "Admin",
      lastName: user?.lastName || "User",
      isAdmin: user?.isAdmin || true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileImageUrl: user?.profileImageUrl,
    }
  ];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">
              You don't have permission to access the admin panel.
            </p>
            <Link href="/">
              <a className="text-gold hover:text-yellow-600">Go back to home</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminSidebar />

          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-playfair font-bold text-charcoal mb-4">
                User Management
              </h1>
              <p className="text-gray-600">
                View and manage user accounts
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">
                {filteredUsers.length} users
              </Badge>
            </div>

            {/* User Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {filteredUsers.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Admin Users</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {filteredUsers.filter(u => u.isAdmin).length}
                      </p>
                    </div>
                    <div className="bg-purple-100 rounded-full p-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Regular Users</p>
                      <p className="text-2xl font-bold text-green-600">
                        {filteredUsers.filter(u => !u.isAdmin).length}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-charcoal flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gold" />
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((userData) => (
                          <TableRow key={userData.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                {userData.profileImageUrl ? (
                                  <img
                                    src={userData.profileImageUrl}
                                    alt={userData.firstName || userData.email}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-charcoal">
                                    {userData.firstName || userData.lastName 
                                      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                                      : userData.email}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {userData.id}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{userData.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={userData.isAdmin ? "default" : "secondary"}>
                                {userData.isAdmin ? (
                                  <div className="flex items-center space-x-1">
                                    <Shield className="h-3 w-3" />
                                    <span>Admin</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>User</span>
                                  </div>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Note about user management */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">User Management Note</h4>
                    <p className="text-sm text-gray-600">
                      This is a basic user listing showing registered users. In a production environment, 
                      you would typically have more advanced user management features such as:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li>User role management and permissions</li>
                      <li>Account activation/deactivation</li>
                      <li>User activity logs and analytics</li>
                      <li>Bulk user operations</li>
                      <li>User authentication method management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
