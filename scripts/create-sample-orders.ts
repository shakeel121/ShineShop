import { storage } from "../server/storage";

async function createSampleOrders() {
  try {
    console.log("Creating sample orders...");
    
    // Create sample orders with different statuses
    const sampleOrders = [
      {
        userId: "45075646",
        totalAmount: "599.99",
        subtotal: "599.99",
        status: "delivered",
        paymentMethod: "paypal",
        trackingNumber: "1Z999AA1234567890",
        shippedAt: new Date("2025-01-10"),
        deliveredAt: new Date("2025-01-15"),
        items: [
          { productId: 1, quantity: 1, price: "599.99" }
        ]
      },
      {
        userId: "45075646",
        totalAmount: "299.99",
        subtotal: "299.99",
        status: "shipped",
        paymentMethod: "paypal",
        trackingNumber: "1Z999AA1234567891",
        shippedAt: new Date("2025-01-13"),
        items: [
          { productId: 2, quantity: 1, price: "299.99" }
        ]
      },
      {
        userId: "45075646",
        totalAmount: "1899.99",
        subtotal: "1899.99",
        status: "processing",
        paymentMethod: "paypal",
        items: [
          { productId: 4, quantity: 1, price: "1899.99" }
        ]
      }
    ];

    for (const orderData of sampleOrders) {
      try {
        const order = await storage.createOrder(orderData, orderData.items);
        console.log(`Created order: ${order.orderNumber}`);
        
        // Update order status and tracking info
        if (orderData.status !== "pending") {
          await storage.updateOrderStatus(order.id, orderData.status);
        }
      } catch (error) {
        console.error("Error creating order:", error);
      }
    }
    
    console.log("Sample orders created successfully!");
  } catch (error) {
    console.error("Error creating sample orders:", error);
  }
}

createSampleOrders();