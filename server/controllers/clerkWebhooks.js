import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get required headers for verification
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify using raw body (NOT JSON.stringify)
    await whook.verify(req.rawBody, headers);

    // Parse body (already parsed by express.json() after raw-body middleware)
    const { data, type } = req.body;

    // Build user record
    const userData = {
      _id: data.id,
      username: (data.first_name || "") + " " + (data.last_name || ""),
      email:
        (data.email_addresses[0] && data.email_addresses[0].email_address) ||
        "",
      image: data.image_url || data.profile_image_url || "",
      role: "user", // Optional, can rely on default as well
      recentSearchCities: [], // Always provide an array to satisfy schema
    };

    // Handle Clerk webhook events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        break;
    }
    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error); // Show full error object
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
