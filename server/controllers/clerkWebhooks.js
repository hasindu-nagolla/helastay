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
      email: data.email_addresses[0].email_address,
      username: (data.first_name || "") + " " + (data.last_name || ""),
      image: data.image_url,
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
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
