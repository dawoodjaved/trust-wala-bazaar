import { PrismaClient, ProductCondition, UserRole, MessageType } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

type SnapshotProduct = {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  city: string;
  brand: string;
  color: string;
  storage?: string;
  pta?: boolean;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  images: string[];
  rating: number;
  reviewCount: number;
};

const CITY_COORDS: Record<string, { lat: number; lng: number; province: string }> = {
  Lahore: { lat: 31.5204, lng: 74.3587, province: 'Punjab' },
  Karachi: { lat: 24.8607, lng: 67.0011, province: 'Sindh' },
  Islamabad: { lat: 33.6844, lng: 73.0479, province: 'Islamabad Capital Territory' },
  Rawalpindi: { lat: 33.5651, lng: 73.0169, province: 'Punjab' },
  Faisalabad: { lat: 31.4504, lng: 73.135, province: 'Punjab' },
  Multan: { lat: 30.1575, lng: 71.5249, province: 'Punjab' },
  Peshawar: { lat: 34.0151, lng: 71.5249, province: 'Khyber Pakhtunkhwa' },
  Quetta: { lat: 30.1798, lng: 66.975, province: 'Balochistan' },
};

const categories = [
  { name: 'Mobiles', slug: 'mobiles', description: 'Smartphones and mobile devices', icon: '📱' },
  { name: 'Laptops', slug: 'laptops', description: 'Laptops and notebooks', icon: '💻' },
  { name: 'Electronics', slug: 'electronics', description: 'Tablets and gadgets', icon: '🔌' },
  { name: 'Cars', slug: 'cars', description: 'Cars and vehicles', icon: '🚗' },
  { name: 'Cameras', slug: 'cameras', description: 'Cameras and photography', icon: '📷' },
  { name: 'Gaming', slug: 'gaming', description: 'Consoles and gaming gear', icon: '🎮' },
  { name: 'Wearables', slug: 'wearables', description: 'Smartwatches and bands', icon: '⌚' },
  { name: 'Audio', slug: 'audio', description: 'Headphones and speakers', icon: '🎧' },
];

function loadCatalog(): SnapshotProduct[] {
  const snapshotPath = join(__dirname, '../../lib/pakistan-catalog.snapshot.json');
  return JSON.parse(readFileSync(snapshotPath, 'utf8')) as SnapshotProduct[];
}

async function main() {
  console.log('🌱 Seeding TrustWala Bazaar from DummyJSON catalog (title-matched images)...');
  const products = loadCatalog();

  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedProduct.deleteMany();
  await prisma.order.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'seed_seller_ahmed',
        email: 'ahmed.mobiles@trustwala.local',
        firstName: 'Ahmed',
        lastName: 'Khan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        role: UserRole.SELLER,
        city: 'Lahore',
        province: 'Punjab',
        address: 'MM Alam Road, Gulberg',
        latitude: 31.5204,
        longitude: 74.3587,
        cnicVerified: true,
        videoVerified: true,
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        totalReviews: 56,
        language: 'en',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'seed_seller_fatima',
        email: 'fatima.electronics@trustwala.local',
        firstName: 'Fatima',
        lastName: 'Ali',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        role: UserRole.BOTH,
        city: 'Karachi',
        province: 'Sindh',
        address: 'Tariq Road, PECHS',
        latitude: 24.8607,
        longitude: 67.0011,
        cnicVerified: true,
        videoVerified: true,
        verificationStatus: 'VERIFIED',
        rating: 4.6,
        totalReviews: 34,
        language: 'en',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'seed_seller_bilal',
        email: 'bilal.autos@trustwala.local',
        firstName: 'Bilal',
        lastName: 'Hassan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        role: UserRole.SELLER,
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        address: 'Blue Area',
        latitude: 33.6844,
        longitude: 73.0479,
        cnicVerified: true,
        videoVerified: false,
        verificationStatus: 'VERIFIED',
        rating: 4.4,
        totalReviews: 21,
        language: 'ur',
      },
    }),
  ]);

  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'seed_buyer_sara',
        email: 'sara@trustwala.local',
        firstName: 'Sara',
        lastName: 'Malik',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        role: UserRole.BUYER,
        city: 'Lahore',
        province: 'Punjab',
        language: 'en',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'seed_buyer_usman',
        email: 'usman@trustwala.local',
        firstName: 'Usman',
        lastName: 'Raza',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        role: UserRole.BUYER,
        city: 'Karachi',
        province: 'Sindh',
        language: 'en',
      },
    }),
  ]);

  const reviewTemplates = [
    {
      rating: 5,
      title: 'Excellent seller',
      content: 'Product was exactly as described. Seller was polite and packing was secure. Highly recommended.',
      pros: ['Accurate description', 'Fast response', 'Good packaging'],
      cons: ['Slight delay in meetup'],
    },
    {
      rating: 4,
      title: 'Good deal',
      content: 'Fair price for the condition. Verified seller made me comfortable buying online.',
      pros: ['Fair price', 'Verified seller'],
      cons: ['Minor cosmetic wear not in photos'],
    },
    {
      rating: 5,
      title: 'Trustworthy',
      content: 'CNIC verified seller. Met in a public place. Everything checked out. Will buy again.',
      pros: ['Verified identity', 'Honest condition report'],
      cons: [],
    },
  ];

  const createdProducts = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    let seller = sellers[0];
    if (p.category === 'cars') {
      seller = sellers[2];
    } else if (['Karachi', 'Peshawar', 'Quetta', 'Multan'].includes(p.city)) {
      seller = sellers[1];
    } else if (p.city === 'Islamabad') {
      seller = sellers[2];
    }

    const loc = CITY_COORDS[p.city] || CITY_COORDS.Lahore;
    const condition = p.condition as ProductCondition;
    const slug = `${p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${i + 1}`;

    if (!categoryMap[p.category]) {
      console.warn(`Skipping unknown category for ${p.title}: ${p.category}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        condition,
        categoryId: categoryMap[p.category],
        sellerId: seller.id,
        city: p.city,
        province: loc.province,
        latitude: loc.lat,
        longitude: loc.lng,
        images: p.images,
        videos: [],
        thumbnail: p.images[0],
        specifications: {
          brand: p.brand,
          model: p.title,
          color: p.color,
          storage: p.storage || 'N/A',
          source: 'dummyjson',
        },
        trustScore: 0,
        ptaVerified: !!p.pta,
        ptaStatus: p.pta ? 'APPROVED' : null,
        aiPriceSuggestion: Math.round(p.price * (0.95 + (i % 5) * 0.02)),
        aiPriceConfidence: 0.82,
        views: 20 + i * 7,
        likes: 3 + (i % 10),
        isActive: true,
      },
    });

    createdProducts.push(product);

    const reviewCount = i % 3 === 0 ? 2 : 1;
    for (let r = 0; r < reviewCount; r++) {
      const tpl = reviewTemplates[(i + r) % reviewTemplates.length];
      const reviewer = buyers[(i + r) % buyers.length];
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: reviewer.id,
          sellerId: seller.id,
          rating: tpl.rating,
          title: tpl.title,
          content: tpl.content,
          pros: tpl.pros,
          cons: tpl.cons,
          isVerified: true,
        },
      });
    }
  }

  await prisma.savedProduct.deleteMany({ where: { userId: buyers[0].id } });
  for (const product of createdProducts.slice(0, 4)) {
    await prisma.savedProduct.create({
      data: { userId: buyers[0].id, productId: product.id },
    });
  }

  const convoId = `${buyers[0].id}_${sellers[0].id}`;
  await prisma.message.createMany({
    data: [
      {
        conversationId: convoId,
        senderId: buyers[0].id,
        receiverId: sellers[0].id,
        type: MessageType.TEXT,
        content: `Assalam o Alaikum! Is the ${createdProducts[0]?.title || 'phone'} still available?`,
      },
      {
        conversationId: convoId,
        senderId: sellers[0].id,
        receiverId: buyers[0].id,
        type: MessageType.TEXT,
        content: 'Walaikum Assalam! Yes, it is available. Photos match the exact model.',
        isRead: true,
      },
      {
        conversationId: convoId,
        senderId: buyers[0].id,
        receiverId: sellers[0].id,
        type: MessageType.OFFER,
        content: `I'm offering PKR ${Math.round((createdProducts[0]?.price || 100000) * 0.95).toLocaleString()}`,
        offerPrice: Math.round((createdProducts[0]?.price || 100000) * 0.95),
      },
    ],
  });

  for (const product of createdProducts) {
    const full = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        seller: { select: { cnicVerified: true, videoVerified: true } },
        reviews: true,
      },
    });
    if (!full) continue;

    let sellerVerification = 0;
    if (full.seller.cnicVerified) sellerVerification += 50;
    if (full.seller.videoVerified) sellerVerification += 50;

    let productAuthenticity = 0;
    if (full.ptaVerified) productAuthenticity += 50;
    if (full.specifications) productAuthenticity += 50;

    let reviewsScore = 0;
    if (full.reviews.length > 0) {
      const avg = full.reviews.reduce((s, r) => s + r.rating, 0) / full.reviews.length;
      reviewsScore = Math.round((avg / 5) * 100);
    }

    let priceFairness = 50;
    if (full.aiPriceSuggestion) {
      const diff = Math.abs(full.price - full.aiPriceSuggestion) / full.aiPriceSuggestion;
      priceFairness = Math.round(Math.max(0, (1 - diff) * 100));
    }

    const trustScore = Math.round(
      sellerVerification * 0.4 +
        productAuthenticity * 0.3 +
        reviewsScore * 0.2 +
        priceFairness * 0.1,
    );

    await prisma.product.update({
      where: { id: product.id },
      data: { trustScore },
    });
  }

  console.log(
    `✅ Seeded ${categories.length} categories, ${createdProducts.length} products (DummyJSON images match titles), ${sellers.length} sellers, ${buyers.length} buyers`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
