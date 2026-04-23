import { prisma } from '../utils/prisma.js';

export const CartController = {
  getCart: async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  },

  syncCart: async (req, res) => {
    const { userId, items } = req.body;
    try {
      // Deduplicate items by variantId, summing quantities if duplicates exist
      const mergedItemsMap = new Map();
      (items || []).forEach(item => {
        if (!item.variantId) return;
        if (mergedItemsMap.has(item.variantId)) {
          mergedItemsMap.set(item.variantId, mergedItemsMap.get(item.variantId) + item.quantity);
        } else {
          mergedItemsMap.set(item.variantId, item.quantity);
        }
      });

      const uniqueItems = Array.from(mergedItemsMap.entries()).map(([variantId, quantity]) => ({
        variantId,
        quantity
      }));

      // Filter out variants that no longer exist in DB (prevents Prisma P2003 Foreign Key constraint violations)
      const existingVariants = await prisma.variant.findMany({
         where: { id: { in: uniqueItems.map(u => u.variantId) } },
         select: { id: true }
      });
      const validVariantIds = new Set(existingVariants.map(v => v.id));
      const filteredUniqueItems = uniqueItems.filter(item => validVariantIds.has(item.variantId));

      // Simple strategy: Clear and re-insert or upsert
      await prisma.cart.upsert({
        where: { userId },
        create: {
          userId,
          items: {
            create: filteredUniqueItems
          }
        },
        update: {
          items: {
            deleteMany: {},
            create: filteredUniqueItems
          }
        }
      });
      res.json({ message: "Cart synced" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to sync cart" });
    }
  }
};
