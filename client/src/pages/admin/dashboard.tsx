import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Star
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  if (authLoading || statsLoading) {
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
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
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-charcoal mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || user?.email}! Here's what's happening with your store.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <AdminSidebar />

          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gold">
                        {stats?.totalProducts || 0}
                      </p>
                    </div>
                    <div className="bg-gold/10 rounded-full p-3">
                      <Package className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats?.totalOrders || 0}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats?.totalUsers || 0}
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
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${stats?.totalRevenue?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="bg-purple-100 rounded-full p-3">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-charcoal flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-gold" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent orders</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-semibold text-charcoal">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                order.status === "completed" ? "default" :
                                order.status === "pending" ? "secondary" :
                                "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gold">${order.totalAmount}</p>
                          <p className="text-sm text-gray-600">
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/products">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      Manage Products
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Add, edit, or remove products from your catalog
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      Process Orders
                    </h3>
                    <p className="text-gray-600 text-sm">
                      View and manage customer orders and shipments
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/users">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      Manage Users
                    </h3>
                    <p className="text-gray-600 text-sm">
                      View customer accounts and user activity
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
