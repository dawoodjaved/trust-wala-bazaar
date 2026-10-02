/**
 * Shared Pakistan marketplace catalog helpers.
 * Product title + images come from DummyJSON (cdn.dummyjson.com) so names always match photos.
 */

export type CatalogCategorySlug =
  | "mobiles"
  | "laptops"
  | "electronics"
  | "cars"
  | "cameras"
  | "gaming"
  | "wearables"
  | "audio";

export type MarketplaceProduct = {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CatalogCategorySlug;
  city: string;
  brand: string;
  color: string;
  storage?: string;
  pta?: boolean;
  condition: "NEW" | "USED" | "REFURBISHED";
  images: string[];
  rating: number;
  reviewCount: number;
};

export const PAKISTAN_CITIES = [
  { city: "Lahore", province: "Punjab", lat: 31.5204, lng: 74.3587 },
  { city: "Karachi", province: "Sindh", lat: 24.8607, lng: 67.0011 },
  { city: "Islamabad", province: "Islamabad Capital Territory", lat: 33.6844, lng: 73.0479 },
  { city: "Rawalpindi", province: "Punjab", lat: 33.5651, lng: 73.0169 },
  { city: "Faisalabad", province: "Punjab", lat: 31.4504, lng: 73.135 },
  { city: "Multan", province: "Punjab", lat: 30.1575, lng: 71.5249 },
  { city: "Peshawar", province: "Khyber Pakhtunkhwa", lat: 34.0151, lng: 71.5249 },
  { city: "Quetta", province: "Balochistan", lat: 30.1798, lng: 66.975 },
] as const;

const CATEGORY_MAP: Record<string, { slug: CatalogCategorySlug; pkrPerUsd: number }> = {
  smartphones: { slug: "mobiles", pkrPerUsd: 280 },
  laptops: { slug: "laptops", pkrPerUsd: 280 },
  tablets: { slug: "electronics", pkrPerUsd: 280 },
  "mobile-accessories": { slug: "audio", pkrPerUsd: 280 },
  "mens-watches": { slug: "wearables", pkrPerUsd: 300 },
  vehicle: { slug: "cars", pkrPerUsd: 220 },
  motorcycle: { slug: "cars", pkrPerUsd: 220 },
};

const SOURCE_CATEGORIES = Object.keys(CATEGORY_MAP);

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  images: string[];
  thumbnail?: string;
};

function roundToNearest(value: number, step: number) {
  return Math.round(value / step) * step;
}

function toPkr(usd: number, rate: number, step = 500) {
  return Math.max(step, roundToNearest(usd * rate, step));
}

function pickCity(index: number) {
  return PAKISTAN_CITIES[index % PAKISTAN_CITIES.length];
}

function conditionFor(index: number): MarketplaceProduct["condition"] {
  return (["NEW", "USED", "REFURBISHED"] as const)[index % 3];
}

function mapProduct(raw: DummyJsonProduct, index: number): MarketplaceProduct | null {
  const mapping = CATEGORY_MAP[raw.category];
  if (!mapping) return null;

  const images = (raw.images?.length ? raw.images : raw.thumbnail ? [raw.thumbnail] : []).filter(Boolean);
  if (!images.length) return null;

  const cityInfo = pickCity(index);
  const price = toPkr(raw.price, mapping.pkrPerUsd, mapping.slug === "cars" ? 5000 : 500);
  const discount = raw.discountPercentage && raw.discountPercentage > 5 ? raw.discountPercentage : 0;
  const originalPrice = discount
    ? roundToNearest(price / (1 - discount / 100), mapping.slug === "cars" ? 5000 : 500)
    : undefined;

  const brand = raw.brand || raw.title.split(" ")[0] || "Generic";
  const isPhone = mapping.slug === "mobiles";

  return {
    title: raw.title.trim(),
    description: `${raw.description.trim()} Available in ${cityInfo.city}, Pakistan. Meetup preferred in a public place. Cash / bank transfer accepted.`,
    price,
    originalPrice,
    category: mapping.slug,
    city: cityInfo.city,
    brand,
    color: ["Black", "White", "Silver", "Blue", "Graphite"][index % 5],
    storage: isPhone ? ["64GB", "128GB", "256GB", "512GB"][index % 4] : undefined,
    pta: isPhone ? index % 3 !== 0 : undefined,
    condition: conditionFor(index),
    images,
    rating: Number((raw.rating ?? 4.2).toFixed(1)),
    reviewCount: Math.max(3, Math.round((raw.stock ?? 20) / 2) + (index % 12)),
  };
}

export async function fetchPakistanMarketplaceCatalog(): Promise<MarketplaceProduct[]> {
  const results: MarketplaceProduct[] = [];
  let index = 0;

  for (const category of SOURCE_CATEGORIES) {
    const response = await fetch(`https://dummyjson.com/products/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch DummyJSON category: ${category}`);
    }
    const data = (await response.json()) as { products?: DummyJsonProduct[] };
    for (const product of data.products || []) {
      const mapped = mapProduct(product, index);
      if (mapped) {
        results.push(mapped);
        index += 1;
      }
    }
  }

  // Prefer phones/laptops first for homepage
  const priority: CatalogCategorySlug[] = ["mobiles", "laptops", "electronics", "audio", "wearables", "cars"];
  results.sort((a, b) => priority.indexOf(a.category) - priority.indexOf(b.category));
  return results;
}
