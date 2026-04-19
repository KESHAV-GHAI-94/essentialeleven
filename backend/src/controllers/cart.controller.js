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
      // Simple strategy: Clear and re-insert or upsert
      await prisma.cart.upsert({
        where: { userId },
        create: {
          userId,
          items: {
            create: items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity
            }))
          }
        },
        update: {
          items: {
            deleteMany: {},
            create: items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity
            }))
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
