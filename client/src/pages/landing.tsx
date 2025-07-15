import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Gem, ShoppingBag, Award, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-playfair font-bold text-gold">
              Luxe Jewelry
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin/login">Admin</Link>
              </Button>
              <Button asChild>
                <a href="/api/login">Login</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080")',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Timeless Elegance
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Discover our exclusive collection of handcrafted jewelry and ornaments
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold"
            asChild
          >
            <a href="/api/login">Shop Now</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-charcoal mb-4">
              Why Choose Luxe Jewelry?
            </h2>
            <p className="text-gray-600 text-lg">
              Experience luxury, quality, and craftsmanship like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Gem className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  Each piece is carefully crafted with the finest materials and attention to detail
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  Award Winning
                </h3>
                <p className="text-gray-600">
                  Recognized for excellence in jewelry design and craftsmanship
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  Lifetime Warranty
                </h3>
                <p className="text-gray-600">
                  All our pieces come with a comprehensive lifetime warranty
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  Easy Shopping
                </h3>
                <p className="text-gray-600">
                  Intuitive online shopping experience with secure checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-charcoal mb-4">
              Our Collections
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our carefully curated selection of premium jewelry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Rings",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
                items: "24 items",
              },
              {
                title: "Necklaces",
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
                items: "18 items",
              },
              {
                title: "Earrings",
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
                items: "32 items",
              },
              {
                title: "Bracelets",
                image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
                items: "15 items",
              },
            ].map((category, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-playfair font-semibold">
                      {category.title}
                    </h3>
                    <p className="text-sm">{category.items}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of satisfied customers who trust Luxe Jewelry for their most precious moments.
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold"
            asChild
          >
            <a href="/api/login">Get Started</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-playfair font-bold text-gold mb-4">
              Luxe Jewelry
            </h3>
            <p className="text-gray-400">
              Premium jewelry and ornaments crafted with passion and precision.
            </p>
            <div className="mt-8 text-gray-500">
              <p>&copy; 2024 Luxe Jewelry. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
