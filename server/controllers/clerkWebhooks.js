import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with your webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Extract headers for verification
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Use raw body string for verification
    const payload = req.body.toString("utf8");
    await whook.verify(payload, headers);

    // Parse event data after verification
    const event = JSON.parse(payload);
    const { data, type } = event;

    // Prepare user data to store in MongoDB
    const userData = {
      _id: data.id,
      email: data.email_addresses[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      image: data.image_url || "",
    };

    // Handle different webhook events
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
        console.log("Unhandled event type:", type);
        break;
    }

    return res.json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
