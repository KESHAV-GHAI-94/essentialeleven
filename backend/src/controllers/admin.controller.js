import { prisma } from "../utils/prisma.js";

export const AdminController = {
  getStats: async (req, res) => {
    try {
      const [orderCount, productCount, userCount, totalRevenue] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
        prisma.order.aggregate({
          where: { paymentStatus: "PAID" },
          _sum: { totalAmount: true }
        })
      ]);

      res.json({
        orders: orderCount,
        products: productCount,
        users: userCount,
        revenue: totalRevenue._sum.totalAmount || 0,
        trend: {
           revenue: "+12.5%",
           orders: "+8.2%",
           users: "+15.3%"
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  },

  getSalesReport: async (req, res) => {
     // Mock data for Recharts/Tremor for now
     const data = [
       { date: "Jan 24", sales: 45000, orders: 120 },
       { date: "Feb 24", sales: 52000, orders: 154 },
       { date: "Mar 24", sales: 48000, orders: 132 },
       { date: "Apr 24", sales: 61000, orders: 189 },
       { date: "May 24", sales: 75000, orders: 245 },
       { date: "Jun 24", sales: 89000, orders: 312 },
     ];
     res.json(data);
  },

  getRecentOrders: async (req, res) => {
     try {
       const orders = await prisma.order.findMany({
         take: 5,
         orderBy: { createdAt: "desc" },
         include: { user: true }
       });
       res.json(orders);
     } catch (error) {
       res.status(500).json({ error: "Failed to fetch orders" });
     }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, items: true }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },

  updateOrderStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status }
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  },

  getOrderDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
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
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order details" });
    }
  },

  getAllProducts: async (req, res) => {
     try {
       const products = await prisma.product.findMany({
         orderBy: { createdAt: "desc" },
         include: { variants: true }
       });
       res.json(products);
     } catch (error) {
       res.status(500).json({ error: "Failed to fetch products" });
     }
  },

  createProduct: async (req, res) => {
     const { name, slug, description, categoryId, images, isActive, variants } = req.body;
     try {
       const product = await prisma.product.create({
         data: {
           name, slug, description, categoryId, images, isActive,
           variants: {
             create: variants.map(({ id, productId, createdAt, updatedAt, ...rest }) => rest)
           }
         }
       });
       res.json(product);
     } catch (error) {
       console.error("Create Product Error:", error);
       res.status(500).json({ error: "Failed to create product" });
     }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, categoryId, images, isActive, variants } = req.body;
    try {
      // Clean delete existing variants to avoid SKU conflicts or orphan records
      await prisma.variant.deleteMany({ where: { productId: id } });
      
      const product = await prisma.product.update({
        where: { id },
        data: {
          name, slug, description, categoryId, images, isActive,
          variants: {
            create: variants.map(({ id, productId, createdAt, updatedAt, ...rest }) => rest)
          }
        }
      });
      res.json(product);
    } catch (error) {
       console.error("Update Product Error:", error);
       res.status(500).json({ error: "Failed to update product" });
    }
  },

  getAllCustomers: async (req, res) => {
    try {
      const customers = await prisma.user.findMany({
        where: { role: "USER" },
        include: {
          _count: {
            select: { orders: true }
          },
          addresses: {
            where: { isDefault: true },
            take: 1
          }
        },
        orderBy: { createdAt: "desc" }
      });
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  },

  getCustomerDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            orderBy: { createdAt: "desc" }
          },
          addresses: true
        }
      });
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer details" });
    }
  },

  getInventory: async (req, res) => {
    try {
      const inventory = await prisma.variant.findMany({
        include: { product: true },
        orderBy: { stock: "asc" }
      });
      res.json(inventory);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch inventory" });
    }
  },

  updateStock: async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    try {
      const variant = await prisma.variant.update({
        where: { id },
        data: { stock }
      });
      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock" });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
      });
      res.json(categories);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  createCategory: async (req, res) => {
    try {
      const category = await prisma.category.create({
        data: req.body
      });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  },

  getAllCoupons: async (req, res) => {
    try {
      const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" }
      });
      res.json(coupons);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch coupons" });
    }
  },

  createCoupon: async (req, res) => {
    try {
      const coupon = await prisma.coupon.create({
        data: req.body
      });
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to create coupon" });
    }
  },

  getAllVendors: async (req, res) => {
    try {
      const vendors = await prisma.vendor.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: "desc" }
      });
      res.json(vendors);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch vendors" });
    }
  },

  updateVendorStatus: async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
      const vendor = await prisma.vendor.update({
        where: { id },
        data: { isActive }
      });
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vendor status" });
    }
  }
};
