import { MailService } from '@sendgrid/mail';
import { Order, OrderItem, Product, User } from "@shared/schema";

const SENDGRID_ENABLED = !!process.env.SENDGRID_API_KEY;

let mailService: MailService | null = null;

if (SENDGRID_ENABLED) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY!);
} else {
  console.warn("SENDGRID_API_KEY not set - email functionality will be disabled");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!SENDGRID_ENABLED || !mailService) {
    console.log('Email would be sent to:', params.to, 'Subject:', params.subject);
    return true; // Return true to not break the application flow
  }
  
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendOrderConfirmation(
  order: Order & { items: (OrderItem & { product: Product })[] },
  user: User
): Promise<boolean> {
  if (!user.email) {
    console.error('User email is required for order confirmation');
    return false;
  }

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.product.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${parseFloat(item.price).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-details { margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th { background-color: #f5f5f5; padding: 10px; border-bottom: 2px solid #ddd; }
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${user.firstName || 'Valued Customer'},</p>
          <p>Thank you for your order! We're excited to confirm that we've received your order and are preparing it for shipment.</p>
          
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt!).toLocaleDateString()}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin: 20px 0;">
            <p><strong>Total: $${parseFloat(order.totalAmount).toFixed(2)}</strong></p>
          </div>

          ${order.shippingAddress ? `
            <div class="order-details">
              <h3>Shipping Address</h3>
              <p>
                ${order.shippingAddress.name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
          ` : ''}

          <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Thank you for choosing our jewelry store!</p>
        </div>
        <div class="footer">
          <p>© 2024 Luxe Jewelry. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    from: 'orders@luxejewelry.com', // Replace with your verified sender
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
  });
}

export async function sendOrderStatusUpdate(
  order: Order,
  user: User,
  oldStatus: string,
  newStatus: string
): Promise<boolean> {
  if (!user.email) {
    console.error('User email is required for order status update');
    return false;
  }

  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  const message = statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to ${newStatus}`;

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .status-update { background-color: #f0f8ff; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0; }
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${user.firstName || 'Valued Customer'},</p>
          
          <div class="status-update">
            <h2>${message}</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>New Status:</strong> ${newStatus}</p>
          </div>

          ${order.trackingNumber ? `
            <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
          ` : ''}

          <p>You can track your order status anytime by logging into your account.</p>
          
          <p>Thank you for choosing our jewelry store!</p>
        </div>
        <div class="footer">
          <p>© 2024 Luxe Jewelry. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    from: 'orders@luxejewelry.com', // Replace with your verified sender
    subject: `Order Status Update - ${order.orderNumber}`,
    html,
  });
}