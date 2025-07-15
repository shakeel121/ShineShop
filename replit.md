# Luxe Jewelry E-commerce Application

## Overview

This is a full-stack e-commerce application for a luxury jewelry business built with React, Node.js, Express, and PostgreSQL. The application features a modern, responsive design with a golden color scheme and comprehensive functionality for both customers and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (TanStack Query) for server state
- **Styling**: Tailwind CSS with custom jewelry-themed color palette
- **UI Components**: Radix UI components with shadcn/ui design system
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Project Structure
```
/client          # React frontend
/server          # Express backend
/shared          # Shared types and schemas
/migrations      # Database migrations
```

## Key Components

### Database Schema
- **users**: User profiles with admin flags
- **categories**: Product categories with slugs
- **products**: Product catalog with images, pricing, and inventory
- **orders**: Order management with status tracking
- **orderItems**: Order line items
- **cartItems**: Shopping cart persistence
- **wishlistItems**: User wishlists
- **sessions**: Session storage for authentication

### Authentication System
- Replit Auth integration for secure user authentication
- Admin role-based access control
- Session-based authentication with PostgreSQL storage
- Automatic login redirect for unauthorized users

### API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/categories` - Category management
- `/api/products` - Product catalog and management
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order processing
- `/api/wishlist` - Wishlist management
- `/api/admin/*` - Admin-only endpoints

### Frontend Features
- **Public Landing Page**: Marketing page for non-authenticated users
- **Product Catalog**: Searchable and filterable product listings
- **Shopping Cart**: Persistent cart with quantity management
- **Order Management**: Checkout process and order history
- **Admin Dashboard**: Product, order, and user management
- **Responsive Design**: Mobile-optimized interface

## Data Flow

### User Authentication Flow
1. Unauthenticated users see landing page
2. Login redirects to Replit Auth
3. Successful authentication creates/updates user session
4. User gains access to protected routes based on role

### Shopping Flow
1. Users browse products by category or search
2. Products can be added to cart or wishlist
3. Cart persists across sessions
4. Checkout process collects shipping information
5. Orders are created and tracked

### Admin Flow
1. Admin users access admin dashboard
2. CRUD operations on products and categories
3. Order management and status updates
4. User management capabilities

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **express**: Web server framework
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Accessible UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date formatting utilities

### Development Dependencies
- **vite**: Frontend build tool
- **tsx**: TypeScript execution
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development
- Vite development server for frontend
- TSX for running TypeScript server code
- Hot module replacement for fast development

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles server code
- Static files served from Express server

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit workspace identifier
- `ISSUER_URL`: OpenID Connect issuer URL

### Database Management
- Drizzle Kit for schema management
- Migration system for database updates
- PostgreSQL as primary data store

The application is designed to be deployed on Replit with seamless integration of their authentication system and database provisioning.