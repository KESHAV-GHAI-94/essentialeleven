import { prisma } from '../utils/prisma.js';

const MEILI_HOST = 'https://getmeilimeilisearchv190-production-3be0.up.railway.app';
const API_KEY = '6u0mgssp89wnnefdwroyvp3ef973uzvu';

async function run() {
  console.log("Starting Meilisearch sync...");
  const productsRaw = await prisma.product.findMany({
    include: { variants: true, category: true }
  });

  const products = productsRaw.map(p => ({
     id: p.id,
     name: p.name,
     description: p.description,
     category: p.category?.name || "Essentials",
     price: p.variants?.[0]?.price || 0,
     image: p.images?.[0] || ""
  }));

  console.log(`Indexing ${products.length} products...`);

  // Update Settings
  await fetch(`${MEILI_HOST}/indexes/products/settings`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searchableAttributes: ['name', 'description', 'category'],
      filterableAttributes: ['category', 'price']
    })
  });

  // Add Documents
  const res = await fetch(`${MEILI_HOST}/indexes/products/documents`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });

  const data = await res.json();
  console.log("Sync task queued with Meilisearch! Task Response:", data);
  console.log("Database records have been passed to the search engine.");
}

run().catch(console.error).finally(() => prisma.$disconnect());
