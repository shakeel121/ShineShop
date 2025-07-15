import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingCart, User, Heart } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartCount = cartItems.length;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-playfair font-bold text-gold cursor-pointer">
                Luxe Jewelry
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`text-gray-700 hover:text-gold transition duration-200 ${location === "/" ? "text-gold" : ""}`}>
                Home
              </a>
            </Link>
            <Link href="/products">
              <a className={`text-gray-700 hover:text-gold transition duration-200 ${location === "/products" ? "text-gold" : ""}`}>
                Collections
              </a>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <a className={`text-gray-700 hover:text-gold transition duration-200 ${location.startsWith("/admin") ? "text-gold" : ""}`}>
                  Admin
                </a>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {isAuthenticated && (
              <>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>

                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-gray-700">{user?.firstName || user?.email}</span>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/api/logout">Logout</a>
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" asChild>
                <a href="/api/login">Login</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/">
                  <a className="text-lg font-semibold text-gray-700 hover:text-gold transition duration-200">
                    Home
                  </a>
                </Link>
                <Link href="/products">
                  <a className="text-lg font-semibold text-gray-700 hover:text-gold transition duration-200">
                    Collections
                  </a>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin">
                    <a className="text-lg font-semibold text-gray-700 hover:text-gold transition duration-200">
                      Admin
                    </a>
                  </Link>
                )}

                {isAuthenticated ? (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                      {user?.profileImageUrl && (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-gray-700">{user?.firstName || user?.email}</span>
                    </div>
                    <Link href="/cart">
                      <a className="flex items-center space-x-2 text-gray-700 hover:text-gold transition duration-200 mb-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Cart ({cartCount})</span>
                      </a>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/api/logout">Logout</a>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <Button variant="default" size="sm" className="w-full" asChild>
                      <a href="/api/login">Login</a>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="max-w-md mx-auto">
              <Input
                placeholder="Search products..."
                className="w-full"
                onBlur={() => setIsSearchOpen(false)}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
