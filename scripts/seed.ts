import { storage } from "../server/storage";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    description: "Elegant rings for every occasion"
  },
  {
    name: "Necklaces",
    slug: "necklaces", 
    description: "Beautiful necklaces and pendants"
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Stunning earrings collection"
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Luxury bracelets and bangles"
  }
];

const products = [
  {
    name: "Diamond Engagement Ring",
    slug: "diamond-engagement-ring",
    description: "A stunning 2-carat diamond engagement ring set in 18k white gold",
    shortDescription: "Elegant 2-carat diamond engagement ring",
    price: "4999.99",
    comparePrice: "5999.99",
    sku: "DER001",
    stock: 5,
    categoryId: 1,
    material: "18k White Gold",
    weight: "5.2",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      "https://images.unsplash.com/photo-1603561596112-db542da93656?w=400"
    ],
    isActive: true,
    isFeatured: true,
    tags: ["diamond", "engagement", "wedding"]
  },
  {
    name: "Pearl Necklace",
    slug: "pearl-necklace",
    description: "Classic freshwater pearl necklace with sterling silver clasp",
    shortDescription: "Timeless pearl necklace",
    price: "299.99",
    comparePrice: "399.99",
    sku: "PN001",
    stock: 12,
    categoryId: 2,
    material: "Sterling Silver",
    weight: "15.8",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      "https://images.unsplash.com/photo-1566146967-6b2c28e7e7b9?w=400"
    ],
    isActive: true,
    isFeatured: true,
    tags: ["pearl", "classic", "elegant"]
  },
  {
    name: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    description: "Contemporary 14k gold hoop earrings with brushed finish",
    shortDescription: "Modern gold hoop earrings",
    price: "199.99",
    sku: "GHE001",
    stock: 8,
    categoryId: 3,
    material: "14k Gold",
    weight: "3.4",
    images: [
      "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400"
    ],
    isActive: true,
    isFeatured: false,
    tags: ["gold", "hoops", "contemporary"]
  },
  {
    name: "Tennis Bracelet",
    slug: "tennis-bracelet",
    description: "Luxury tennis bracelet featuring brilliant cut diamonds",
    shortDescription: "Diamond tennis bracelet",
    price: "1899.99",
    comparePrice: "2299.99",
    sku: "TB001",
    stock: 3,
    categoryId: 4,
    material: "18k White Gold",
    weight: "12.7",
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6c4932a881b?w=400"
    ],
    isActive: true,
    isFeatured: true,
    tags: ["diamond", "tennis", "luxury"]
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database...");
    
    // Create categories
    console.log("Creating categories...");
    const createdCategories = [];
    for (const category of categories) {
      try {
        const created = await storage.createCategory(category);
        createdCategories.push(created);
        console.log(`Created category: ${created.name}`);
      } catch (error) {
        console.log(`Category ${category.name} might already exist`);
      }
    }
    
    // Create products
    console.log("Creating products...");
    for (const product of products) {
      try {
        const created = await storage.createProduct(product);
        console.log(`Created product: ${created.name}`);
      } catch (error) {
        console.log(`Product ${product.name} might already exist`);
      }
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();