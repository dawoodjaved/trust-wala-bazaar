// Comprehensive dummy data for showcasing product listings

export interface DummyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: "NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  categoryId: string;
  category: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  videos?: string[];
  specifications?: any;
  ptaVerified?: boolean;
  ptaStatus?: string;
  trustScore: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    cnicVerified: boolean;
    videoVerified: boolean;
    trustScore: number;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory"];

const categories = [
  { id: "mobiles", name: "Mobiles" },
  { id: "laptops", name: "Laptops" },
  { id: "electronics", name: "Electronics" },
  { id: "cars", name: "Cars" },
  { id: "cameras", name: "Cameras" },
  { id: "gaming", name: "Gaming" },
  { id: "wearables", name: "Wearables" },
  { id: "audio", name: "Audio" },
];

const productTemplates = [
  // Mobiles
  { title: "iPhone 15 Pro Max 256GB", price: 350000, category: "mobiles", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop" },
  { title: "Samsung Galaxy S24 Ultra 512GB", price: 280000, category: "mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop" },
  { title: "OnePlus 12 256GB", price: 195000, category: "mobiles", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop" },
  { title: "Xiaomi 14 Pro 512GB", price: 175000, category: "mobiles", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop" },
  { title: "Google Pixel 8 Pro 256GB", price: 220000, category: "mobiles", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop" },
  
  // Laptops
  { title: "MacBook Pro M3 14-inch 512GB", price: 450000, category: "laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop" },
  { title: "Dell XPS 15 OLED 1TB", price: 380000, category: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop" },
  { title: "HP Spectre x360 13.5", price: 320000, category: "laptops", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop" },
  { title: "Lenovo ThinkPad X1 Carbon", price: 295000, category: "laptops", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop" },
  { title: "ASUS ROG Zephyrus G16", price: 420000, category: "laptops", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop" },
  
  // Electronics
  { title: "Sony WH-1000XM5 Headphones", price: 55000, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop" },
  { title: "Samsung 55\" QLED 4K TV", price: 180000, category: "electronics", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop" },
  { title: "Apple AirPods Pro 2", price: 65000, category: "electronics", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop" },
  { title: "iPad Pro 12.9\" M2 256GB", price: 320000, category: "electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop" },
  { title: "Samsung Galaxy Watch 6 Classic", price: 85000, category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop" },
  
  // Cameras
  { title: "Canon EOS R6 Mark II", price: 650000, category: "cameras", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop" },
  { title: "Sony A7 IV Full Frame", price: 720000, category: "cameras", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop" },
  { title: "Nikon Z6 III", price: 680000, category: "cameras", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop" },
  { title: "Fujifilm X-T5", price: 450000, category: "cameras", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop" },
  
  // Gaming
  { title: "PlayStation 5 Console", price: 125000, category: "gaming", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop" },
  { title: "Xbox Series X", price: 115000, category: "gaming", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop" },
  { title: "Nintendo Switch OLED", price: 75000, category: "gaming", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop" },
  { title: "Steam Deck 512GB", price: 145000, category: "gaming", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop" },
  
  // Audio
  { title: "Bose QuietComfort 45", price: 48000, category: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop" },
  { title: "JBL Flip 6 Bluetooth Speaker", price: 18000, category: "audio", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop" },
  { title: "Sennheiser HD 660S", price: 95000, category: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop" },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDummyProduct(template: typeof productTemplates[0], index: number): DummyProduct {
  const city = getRandomElement(cities);
  const province = getRandomElement(provinces);
  const category = categories.find(c => c.id === template.category) || categories[0];
  const condition = getRandomElement<DummyProduct["condition"]>(["NEW", "LIKE_NEW", "EXCELLENT", "GOOD", "FAIR"]);
  const trustScore = getRandomInt(75, 98);
  const rating = Number((Math.random() * 1.5 + 3.5).toFixed(1));
  const reviewCount = getRandomInt(5, 150);
  const hasOriginalPrice = Math.random() > 0.5;
  const originalPrice = hasOriginalPrice ? Math.round(template.price * 1.15) : undefined;
  
  return {
    id: `prod-${index + 1}`,
    title: template.title,
    description: `Premium ${template.title} in ${condition.toLowerCase()} condition. Original packaging included. ${hasOriginalPrice ? 'Great deal!' : 'Best price in market!'}`,
    price: template.price,
    originalPrice,
    condition,
    categoryId: category.id,
    category: category.name,
    city,
    province,
    latitude: 31.5204 + (Math.random() - 0.5) * 0.1,
    longitude: 74.3587 + (Math.random() - 0.5) * 0.1,
    images: [template.image, template.image, template.image],
    videos: Math.random() > 0.7 ? [template.image] : undefined,
    specifications: {
      brand: template.title.split(" ")[0],
      model: template.title,
      color: getRandomElement(["Black", "White", "Silver", "Blue", "Green"]),
      storage: template.title.includes("256GB") ? "256GB" : template.title.includes("512GB") ? "512GB" : "128GB",
    },
    ptaVerified: Math.random() > 0.4,
    ptaStatus: Math.random() > 0.4 ? "APPROVED" : undefined,
    trustScore,
    verified: Math.random() > 0.3,
    rating,
    reviewCount,
    seller: {
      id: `seller-${index + 1}`,
      name: getRandomElement(["Tech Store", "Electronics Hub", "Gadget Zone", "Mobile World", "Digital Mart", "Smart Solutions"]),
      cnicVerified: Math.random() > 0.2,
      videoVerified: Math.random() > 0.4,
      trustScore: getRandomInt(80, 95),
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };
}

export function getDummyProducts(limit?: number): DummyProduct[] {
  const products = productTemplates.map((template, index) => generateDummyProduct(template, index));
  
  // Duplicate and vary some products to get more listings
  const extendedProducts = [...products];
  for (let i = 0; i < 15; i++) {
    const template = getRandomElement(productTemplates);
    extendedProducts.push(generateDummyProduct(template, products.length + i));
  }
  
  // Shuffle
  for (let i = extendedProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [extendedProducts[i], extendedProducts[j]] = [extendedProducts[j], extendedProducts[i]];
  }
  
  return limit ? extendedProducts.slice(0, limit) : extendedProducts;
}

export function getDummyProductById(id: string): DummyProduct | null {
  const products = getDummyProducts();
  return products.find(p => p.id === id) || null;
}

export function getDummyProductsByCategory(categoryId: string, limit?: number): DummyProduct[] {
  const allProducts = getDummyProducts();
  const filtered = allProducts.filter(p => p.categoryId === categoryId);
  return limit ? filtered.slice(0, limit) : filtered;
}

export function searchDummyProducts(query: string, limit?: number): DummyProduct[] {
  const allProducts = getDummyProducts();
  const lowerQuery = query.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
  return limit ? filtered.slice(0, limit) : filtered;
}
