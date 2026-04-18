import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create a Category
  const category = await prisma.category.upsert({
    where: { slug: "essentials" },
    update: {},
    create: {
      name: "Daily Essentials",
      slug: "essentials",
      description: "Must-have products for your high-performance lifestyle.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    },
  });

  console.log("✅ Created Category:", category.name);

  // 2. Create Products
  const products = [
    {
      name: "The Obsidian Watch",
      slug: "obsidian-watch",
      description: "A timeless masterpiece designed for those who value every second.",
      price: 12999,
      images: ["https://images.unsplash.com/photo-1524592093035-2396e00180d1?auto=format&fit=crop&q=80&w=800"],
    },
    {
        name: "Saffron Leather Wallet",
        slug: "saffron-wallet",
        description: "Handcrafted Italian leather with our signature saffron accents.",
        price: 4500,
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800"],
    },
    {
        name: "Navy Meridian Pen",
        slug: "meridian-pen",
        description: "The ultimate writing instrument for clear thoughts and bold ideas.",
        price: 3200,
        images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800"],
    }
  ];

  for (const p of products) {
    const { price, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        categoryId: category.id,
        isActive: true,
        variants: {
          create: {
            name: "Standard Edition",
            sku: `${p.slug}-std`,
            price: price,
            stock: 50,
          }
        }
      },
    });
    console.log(`🎁 Product Added: ${product.name}`);
  }

  console.log("✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
