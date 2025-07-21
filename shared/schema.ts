import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table (required for Replit Auth)
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  address: text("address", { mode: "json" }).$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  phoneVerified: integer("phone_verified", { mode: "boolean" }).default(false),
  preferences: text("preferences", { mode: "json" }).$type<{
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
    theme: string;
  }>().default({
    newsletter: true,
    promotions: true,
    orderUpdates: true,
    theme: "light",
  }),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Product categories
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Products table
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: text("price").notNull(),
  comparePrice: text("compare_price"),
  sku: text("sku"),
  stock: integer("stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  reservedStock: integer("reserved_stock").default(0),
  trackInventory: integer("track_inventory", { mode: "boolean" }).default(true),
  allowBackorder: integer("allow_backorder", { mode: "boolean" }).default(false),
  images: text("images", { mode: "json" }).$type<string[]>().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  material: text("material"),
  weight: text("weight"),
  dimensions: text("dimensions"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Orders table
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").unique().notNull(),
  status: text("status").default("pending"),
  totalAmount: text("total_amount").notNull(),
  subtotal: text("subtotal").notNull(),
  taxAmount: text("tax_amount").default("0"),
  shippingAmount: text("shipping_amount").default("0"),
  discountAmount: text("discount_amount").default("0"),
  shippingAddress: text("shipping_address", { mode: "json" }).$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  billingAddress: text("billing_address", { mode: "json" }).$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  paymentStatus: text("payment_status").default("pending"),
  paymentMethod: text("payment_method"),
  paymentIntentId: text("payment_intent_id"),
  trackingNumber: text("tracking_number"),
  shippedAt: text("shipped_at"),
  deliveredAt: text("delivered_at"),
  notes: text("notes"),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Order items table
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Cart items table
export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Wishlist items table
export const wishlistItems = sqliteTable("wishlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Inventory movements table for advanced inventory management
export const inventoryMovements = sqliteTable("inventory_movements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id).notNull(),
  type: text("type").notNull(), // 'in', 'out', 'adjustment', 'reserved', 'released'
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  reference: text("reference"), // order id, adjustment id, etc.
  notes: text("notes"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Product reviews table
export const productReviews = sqliteTable("product_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isApproved: integer("is_approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Coupons table for discounts
export const coupons = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'percentage', 'fixed'
  value: text("value").notNull(),
  minimumAmount: text("minimum_amount"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  startsAt: text("starts_at"),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  reviews: many(productReviews),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  inventoryMovements: many(inventoryMovements),
  reviews: many(productReviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  product: one(products, {
    fields: [inventoryMovements.productId],
    references: [products.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryMovementSchema = createInsertSchema(inventoryMovements).omit({
  id: true,
  createdAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User profile schema for updates
export const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  gender: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }).optional(),
  preferences: z.object({
    newsletter: z.boolean(),
    promotions: z.boolean(),
    orderUpdates: z.boolean(),
    theme: z.string(),
  }).optional(),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type InsertInventoryMovement = z.infer<typeof insertInventoryMovementSchema>;

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
