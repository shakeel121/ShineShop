import {
  users,
  categories,
  products,
  orders,
  orderItems,
  cartItems,
  wishlistItems,
  inventoryMovements,
  productReviews,
  coupons,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type InventoryMovement,
  type InsertInventoryMovement,
  type ProductReview,
  type InsertProductReview,
  type Coupon,
  type InsertCoupon,
  type UpdateUserProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, sql, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Product operations
  getProducts(filters?: {
    categoryId?: number;
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    products: (Product & { category: Category | null })[];
    total: number;
  }>;
  getProductById(id: number): Promise<(Product & { category: Category | null }) | undefined>;
  getProductBySlug(slug: string): Promise<(Product & { category: Category | null }) | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Order operations
  getOrders(filters?: {
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    orders: (Order & { items: (OrderItem & { product: Product })[] })[];
    total: number;
  }>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string }[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  generateOrderNumber(): Promise<string>;

  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<void>;

  // Inventory operations
  addInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement>;
  getInventoryMovements(productId: number): Promise<InventoryMovement[]>;
  updateProductStock(productId: number, quantity: number, type: string, reason?: string): Promise<void>;
  getLowStockProducts(): Promise<Product[]>;

  // Reviews operations
  getProductReviews(productId: number): Promise<(ProductReview & { user: User })[]>;
  addProductReview(review: InsertProductReview): Promise<ProductReview>;
  updateReviewStatus(id: number, isApproved: boolean): Promise<ProductReview>;

  // Coupons operations
  getCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon>;
  deleteCoupon(id: number): Promise<void>;

  // Analytics
  getAdminStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    recentOrders: (Order & { items: (OrderItem & { product: Product })[] })[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    products: (Product & { category: Category | null })[];
    total: number;
  }> {
    const conditions = [];

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }

    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(products.isFeatured, filters.isFeatured));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const [totalResult] = await totalQuery;
    const total = totalResult.count;

    let query = db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(products.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    const results = await query;
    const productsData = results.map((row) => ({
      ...row.products,
      category: row.categories,
    }));

    return { products: productsData, total };
  }

  async getProductById(id: number): Promise<(Product & { category: Category | null }) | undefined> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!result) return undefined;

    return {
      ...result.products,
      category: result.categories,
    };
  }

  async getProductBySlug(slug: string): Promise<(Product & { category: Category | null }) | undefined> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug));

    if (!result) return undefined;

    return {
      ...result.products,
      category: result.categories,
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values([product]).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() } as any)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order operations
  async getOrders(filters?: {
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    orders: (Order & { items: (OrderItem & { product: Product })[] })[];
    total: number;
  }> {
    const conditions = [];

    if (filters?.userId) {
      conditions.push(eq(orders.userId, filters.userId));
    }

    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);

    const [totalResult] = await totalQuery;
    const total = totalResult.count;

    let query = db.select().from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    const ordersData = await query;

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map((item) => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return { orders: ordersWithItems, total };
  }

  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items: items.map((item) => ({
        ...item.order_items,
        product: item.products!,
      })),
    };
  }

  async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(orderData: InsertOrder, items: { productId: number; quantity: number; price: string }[]): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();
    
    const [order] = await db
      .insert(orders)
      .values({ ...orderData, orderNumber })
      .returning();

    // Insert order items
    const orderItemsData = items.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Update inventory
    for (const item of items) {
      await this.updateProductStock(item.productId, -item.quantity, 'out', `Order ${order.orderNumber}`);
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const results = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return results.map((result) => ({
      ...result.cart_items,
      product: result.products!,
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, item.userId),
          eq(cartItems.productId, item.productId)
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Insert new item
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]> {
    const results = await db
      .select()
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.userId, userId));

    return results.map((result) => ({
      ...result.wishlist_items,
      product: result.products!,
    }));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db.insert(wishlistItems).values(item).returning();
    return newItem;
  }

  async removeFromWishlist(id: number): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }

  // Inventory operations
  async addInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement> {
    const [newMovement] = await db.insert(inventoryMovements).values(movement).returning();
    return newMovement;
  }

  async getInventoryMovements(productId: number): Promise<InventoryMovement[]> {
    return await db
      .select()
      .from(inventoryMovements)
      .where(eq(inventoryMovements.productId, productId))
      .orderBy(desc(inventoryMovements.createdAt));
  }

  async updateProductStock(productId: number, quantity: number, type: string, reason?: string): Promise<void> {
    // Get current product
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    
    if (!product) throw new Error('Product not found');

    // Update stock
    const newStock = (product.stock || 0) + quantity;
    await db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, productId));

    // Add inventory movement
    await this.addInventoryMovement({
      productId,
      type,
      quantity,
      reason,
    });
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.stock} <= ${products.lowStockThreshold}`
        )
      )
      .orderBy(asc(products.stock));
  }

  // Reviews operations
  async getProductReviews(productId: number): Promise<(ProductReview & { user: User })[]> {
    const results = await db
      .select()
      .from(productReviews)
      .leftJoin(users, eq(productReviews.userId, users.id))
      .where(and(eq(productReviews.productId, productId), eq(productReviews.isApproved, true)))
      .orderBy(desc(productReviews.createdAt));

    return results.map((result) => ({
      ...result.product_reviews,
      user: result.users!,
    }));
  }

  async addProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db.insert(productReviews).values(review).returning();
    return newReview;
  }

  async updateReviewStatus(id: number, isApproved: boolean): Promise<ProductReview> {
    const [updatedReview] = await db
      .update(productReviews)
      .set({ isApproved, updatedAt: new Date() })
      .where(eq(productReviews.id, id))
      .returning();
    return updatedReview;
  }

  // Coupons operations
  async getCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  async updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon> {
    const [updatedCoupon] = await db
      .update(coupons)
      .set({ ...coupon, updatedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return updatedCoupon;
  }

  async deleteCoupon(id: number): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  // Analytics
  async getAdminStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    recentOrders: (Order & { items: (OrderItem & { product: Product })[] })[];
  }> {
    const [productCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    const [orderCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [revenueResult] = await db
      .select({ total: sql<number>`sum(${orders.totalAmount})` })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'));

    const recentOrdersData = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const recentOrders = await Promise.all(
      recentOrdersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map((item) => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return {
      totalProducts: productCount.count,
      totalOrders: orderCount.count,
      totalUsers: userCount.count,
      totalRevenue: revenueResult.total || 0,
      recentOrders,
    };
  }
}

export const storage = new DatabaseStorage();