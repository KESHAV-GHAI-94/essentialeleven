import { prisma } from '../utils/prisma.js';

export const AddressController = {
  getUserAddresses: async (req, res) => {
    const { userId } = req.params;
    try {
      const addresses = await prisma.address.findMany({
        where: { userId }
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  },

  addAddress: async (req, res) => {
    const { userId, street, city, state, country, zipCode, isDefault } = req.body;
    try {
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }
      
      const address = await prisma.address.create({
        data: { userId, street, city, state, country, zipCode, isDefault }
      });
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to add address" });
    }
  },

  deleteAddress: async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.address.delete({ where: { id } });
      res.json({ message: "Address deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  }
};
