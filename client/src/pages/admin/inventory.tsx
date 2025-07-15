import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, AlertTriangle, Plus, Minus, TrendingUp, TrendingDown, History } from "lucide-react";
import { format } from "date-fns";

export default function AdminInventory() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['/api/admin/inventory/low-stock'],
  });

  const { data: movements } = useQuery({
    queryKey: ['/api/admin/inventory/movements', selectedProduct],
    enabled: !!selectedProduct,
  });

  const adjustInventoryMutation = useMutation({
    mutationFn: async (data: { productId: number; quantity: number; reason: string }) => {
      const response = await apiRequest("POST", "/api/admin/inventory/adjust", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory adjusted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/movements', selectedProduct] });
      setShowAdjustmentDialog(false);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to adjust inventory",
        variant: "destructive",
      });
    },
  });

  const handleAdjustInventory = () => {
    if (!selectedProduct || adjustmentQuantity === 0) return;
    
    adjustInventoryMutation.mutate({
      productId: selectedProduct,
      quantity: adjustmentQuantity,
      reason: adjustmentReason,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
              <p className="text-gray-600">Monitor and manage product inventory levels</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">All Products</TabsTrigger>
                <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                <TabsTrigger value="movements">Movements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {products?.products?.length || 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {lowStockProducts?.length || 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${products?.products?.reduce((sum: number, product: any) => 
                          sum + (product.stock || 0) * parseFloat(product.price || 0), 0
                        ).toFixed(2) || '0.00'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {lowStockProducts && lowStockProducts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>Low Stock Alerts</span>
                      </CardTitle>
                      <CardDescription>
                        Products that are running low on stock
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {lowStockProducts.map((product: any) => (
                          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Stock: {product.stock} / Threshold: {product.lowStockThreshold}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="destructive">Low Stock</Badge>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setShowAdjustmentDialog(true);
                                }}
                              >
                                Adjust Stock
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Products Inventory</CardTitle>
                    <CardDescription>
                      View and manage inventory for all products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {productsLoading ? (
                      <div className="text-center py-8">Loading products...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Threshold</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products?.products?.map((product: any) => (
                              <tr key={product.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-gray-600">${product.price}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                  {product.stock || 0}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  {product.lowStockThreshold || 0}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  {(product.stock || 0) <= (product.lowStockThreshold || 0) ? (
                                    <Badge variant="destructive">Low Stock</Badge>
                                  ) : (
                                    <Badge variant="default">In Stock</Badge>
                                  )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedProduct(product.id);
                                        setShowAdjustmentDialog(true);
                                      }}
                                    >
                                      Adjust
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedProduct(product.id)}
                                    >
                                      History
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="low-stock" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Products</CardTitle>
                    <CardDescription>
                      Products that need immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lowStockProducts && lowStockProducts.length > 0 ? (
                      <div className="space-y-4">
                        {lowStockProducts.map((product: any) => (
                          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Current Stock: {product.stock} (Threshold: {product.lowStockThreshold})
                                </p>
                                <p className="text-sm font-medium text-red-600">
                                  Needs {(product.lowStockThreshold || 0) - (product.stock || 0) + 10} more units
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedProduct(product.id);
                                setAdjustmentQuantity((product.lowStockThreshold || 0) - (product.stock || 0) + 10);
                                setShowAdjustmentDialog(true);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Restock
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No low stock products found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="movements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Movements</CardTitle>
                    <CardDescription>
                      {selectedProduct ? 'Showing movements for selected product' : 'Select a product to view movements'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedProduct && movements ? (
                      <div className="space-y-4">
                        {movements.map((movement: any) => (
                          <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {movement.type === 'in' ? (
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium capitalize">{movement.type}</div>
                                <div className="text-sm text-gray-600">{movement.reason}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${
                                movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {movement.type === 'in' ? '+' : ''}{movement.quantity}
                              </div>
                              <div className="text-sm text-gray-600">
                                {format(new Date(movement.createdAt), 'MMM d, yyyy HH:mm')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Select a product to view inventory movements</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Adjustment Dialog */}
            <Dialog open={showAdjustmentDialog} onOpenChange={setShowAdjustmentDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adjust Inventory</DialogTitle>
                  <DialogDescription>
                    Make adjustments to product inventory levels
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity Adjustment</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAdjustmentQuantity(Math.max(adjustmentQuantity - 1, -1000))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={adjustmentQuantity}
                        onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                        className="text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAdjustmentQuantity(adjustmentQuantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Use positive numbers to increase stock, negative to decrease
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="reason">Reason for Adjustment</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter reason for inventory adjustment..."
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAdjustmentDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAdjustInventory}
                      disabled={adjustmentQuantity === 0 || !adjustmentReason.trim() || adjustInventoryMutation.isPending}
                    >
                      {adjustInventoryMutation.isPending ? 'Adjusting...' : 'Adjust Inventory'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}