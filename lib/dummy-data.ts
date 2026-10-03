import catalog from "./pakistan-catalog.snapshot.json";

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

const CITY_META: Record<string, { province: string; lat: number; lng: number }> = {
  Lahore: { province: "Punjab", lat: 31.5204, lng: 74.3587 },
  Karachi: { province: "Sindh", lat: 24.8607, lng: 67.0011 },
  Islamabad: { province: "Islamabad Capital Territory", lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { province: "Punjab", lat: 33.5651, lng: 73.0169 },
  Faisalabad: { province: "Punjab", lat: 31.4504, lng: 73.135 },
  Multan: { province: "Punjab", lat: 30.1575, lng: 71.5249 },
  Peshawar: { province: "Khyber Pakhtunkhwa", lat: 34.0151, lng: 71.5249 },
  Quetta: { province: "Balochistan", lat: 30.1798, lng: 66.975 },
};

const categoryNames: Record<string, string> = {
  mobiles: "Mobiles",
  laptops: "Laptops",
  electronics: "Electronics",
  cars: "Cars",
  cameras: "Cameras",
  gaming: "Gaming",
  wearables: "Wearables",
  audio: "Audio",
};

const sellerNames = [
  "Ahmed Khan Mobiles",
  "Fatima Electronics",
  "Bilal Autos",
  "Tech Bazaar Lahore",
  "Karachi Gadget Hub",
  "Islamabad Digital Mart",
];

type SnapshotItem = (typeof catalog)[number];

function toDummyProduct(item: SnapshotItem, index: number): DummyProduct {
  const cityMeta = CITY_META[item.city] || CITY_META.Lahore;
  const conditionMap = {
    NEW: "NEW",
    USED: "GOOD",
    REFURBISHED: "EXCELLENT",
  } as const;

  return {
    id: `prod-${index + 1}`,
    title: item.title,
    description: item.description,
    price: item.price,
    originalPrice: item.originalPrice,
    condition: conditionMap[item.condition as keyof typeof conditionMap] || "GOOD",
    categoryId: item.category,
    category: categoryNames[item.category] || item.category,
    city: item.city,
    province: cityMeta.province,
    latitude: cityMeta.lat,
    longitude: cityMeta.lng,
    images: item.images,
    specifications: {
      brand: item.brand,
      model: item.title,
      color: item.color,
      storage: item.storage || "N/A",
      source: "dummyjson",
    },
    ptaVerified: !!item.pta,
    ptaStatus: item.pta ? "APPROVED" : undefined,
    trustScore: 75 + (index % 24),
    verified: index % 4 !== 0,
    rating: item.rating,
    reviewCount: item.reviewCount,
    seller: {
      id: `seller-${(index % sellerNames.length) + 1}`,
      name: sellerNames[index % sellerNames.length],
      cnicVerified: index % 5 !== 0,
      videoVerified: index % 3 === 0,
      trustScore: 80 + (index % 16),
    },
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };
}

const ALL_PRODUCTS: DummyProduct[] = catalog.map((item, index) => toDummyProduct(item, index));

export function getDummyProducts(limit?: number): DummyProduct[] {
  return limit ? ALL_PRODUCTS.slice(0, limit) : [...ALL_PRODUCTS];
}

export function getDeterministicDummyProducts(limit = 20): DummyProduct[] {
  return ALL_PRODUCTS.slice(0, Math.min(limit, ALL_PRODUCTS.length));
}

export function searchDummyProducts(query: string, limit?: number): DummyProduct[] {
  const lowerQuery = query.toLowerCase();
  const filtered = ALL_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.specifications?.brand?.toLowerCase?.().includes(lowerQuery),
  );
  return limit ? filtered.slice(0, limit) : filtered;
}
