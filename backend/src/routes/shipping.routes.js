import { Router } from "express";

const router = Router();

router.get("/estimate-pincode", async (req, res) => {
  const { pincode } = req.query;
  const token = process.env.SHIPROCKET_TOKEN;

  if (!pincode || pincode.length !== 6) {
    return res.status(400).json({ error: "Valid 6-digit pincode required", status: "error" });
  }

  // If no token exists, fallback to a mocked functional resolver so the frontend doesn't crash permanently.
  if (!token) {
    if (pincode.startsWith("9")) {
      return res.json({ status: "error", message: "Delivery unavailable" });
    }
    const date = new Date();
    date.setDate(date.getDate() + (pincode.startsWith("1") ? 2 : 5));
    return res.json({ 
       status: "success", 
       deliveryDate: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
    });
  }

  // Functional Shiprocket Implementation
  try {
    const courierRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=110030&delivery_postcode=${pincode}&weight=1&cod=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await courierRes.json();
    
    if (data.status === 200 && data.data && data.data.available_courier_companies.length > 0) {
      const bestCourier = data.data.available_courier_companies[0];
      return res.json({
        status: "success",
        deliveryDate: bestCourier.etd
      });
    } else {
      return res.json({ status: "error", message: "Delivery unavailable" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to establish Shiprocket API link", status: "error" });
  }
});

export default router;
