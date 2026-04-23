import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findUnique({ where: { id: "cmo4jcqll0005fxmc8jla8dnj" } });
  console.log('PRODUCT_FOUND:' + !!p);
  const v = await prisma.variant.findUnique({ where: { id: "cmo4jcqll0005fxmc8jla8dnj" } });
  console.log('VARIANT_FOUND:' + !!v);
  
  const allv = await prisma.variant.findMany({ select: { id: true, productId: true } });
  console.log('ALL_VARIANTS:' + JSON.stringify(allv));
}

main().catch(console.error).finally(() => prisma.$disconnect());
