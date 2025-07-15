import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, MapPin, Clock, CheckCircle } from "lucide-react";
import { Order, OrderItem, Product } from "@shared/schema";

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["/api/orders/track", searchOrderNumber],
    queryFn: async () => {
      if (!searchOrderNumber) return null;
      const response = await apiRequest("GET", `/api/orders/track/${searchOrderNumber}`);
      return response.json();
    },
    enabled: !!searchOrderNumber,
  });

  const handleSearch = () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive",
      });
      return;
    }
    setSearchOrderNumber(orderNumber.trim());
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: "pending", label: "Order Placed", description: "Your order has been received" },
      { key: "processing", label: "Processing", description: "We're preparing your items" },
      { key: "shipped", label: "Shipped", description: "Your order is on the way" },
      { key: "delivered", label: "Delivered", description: "Order has been delivered" },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order number to track your jewelry delivery</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Tracking</span>
              </CardTitle>
              <CardDescription>
                Enter your order number to get real-time tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    placeholder="Enter your order number (e.g., ORD-2025-001)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "Searching..." : "Track Order"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <p>Order not found or invalid order number</p>
                  <p className="text-sm text-gray-500 mt-2">Please check your order number and try again</p>
                </div>
              </CardContent>
            </Card>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{order.orderNumber}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Details</h4>
                      <p className="text-sm text-gray-600">Total: ${order.totalAmount}</p>
                      <p className="text-sm text-gray-600">Payment: {order.paymentMethod || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Information</h4>
                      {order.trackingNumber && (
                        <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                      )}
                      {order.shippedAt && (
                        <p className="text-sm text-gray-600">
                          Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                      {order.deliveredAt && (
                        <p className="text-sm text-gray-600">
                          Delivered: {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTrackingSteps(order.status).map((step, index) => (
                      <div key={step.key} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-500 text-white" : 
                          step.current ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${step.completed ? "text-green-700" : 
                            step.current ? "text-blue-700" : "text-gray-500"}`}>
                            {step.label}
                          </h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item: OrderItem & { product: Product }) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}