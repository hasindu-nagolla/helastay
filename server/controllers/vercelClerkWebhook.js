import { Webhook } from "svix";
import mongoose from "mongoose";
import User from "../models/User.js";

export const config = {
  api: { bodyParser: false } // important for raw body
};

async function connectMongo() {
  if (mongoose.connection.readyState === 1) return; // already connected
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export default async function handler(req, res) {
  try {
    await connectMongo();

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // read raw body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // prepare headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    await whook.verify(rawBody, headers); // verify signature

    const event = JSON.parse(rawBody.toString());
    const { data, type } = event;

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      email: data.email_addresses[0]?.email_address || "",
      image: data.image_url || "",
      recentSearchCities: [] // default empty
    };

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
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
}
