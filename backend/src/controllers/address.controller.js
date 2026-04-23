import { prisma } from '../utils/prisma.js';
import { parsePhoneNumber } from '../utils/phone.js';

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
    const { userId, street, city, state, country, zipCode, isDefault, phoneNumber } = req.body;
    try {
      // Deduplication: return existing address if same street+city+zipCode already saved
      const existing = await prisma.address.findFirst({
        where: {
          userId,
          street: { equals: street, mode: 'insensitive' },
          city:   { equals: city,   mode: 'insensitive' },
          zipCode
        }
      });
      if (existing) {
        return res.json({ ...existing, _duplicate: true });
      }

      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }
      
      const address = await prisma.address.create({
        data: { 
          userId, 
          street, 
          city, 
          state: state || null, 
          country: country || null, 
          zipCode, 
          isDefault: isDefault ?? false,
          phoneNumber: parsePhoneNumber(phoneNumber)
        }
      });
      res.json(address);
    } catch (error) {
      console.error('addAddress error:', error);
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
