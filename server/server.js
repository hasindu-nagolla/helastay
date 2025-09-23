import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import getRawBody from "raw-body";

connectDB();
const app = express();
app.use(cors());

// Only use on /api/clerk for webhooks!
app.post("/api/clerk", async (req, res, next) => {
  req.rawBody = await getRawBody(req);
  next();
}, express.json(), clerkWebhooks);

app.use(clerkMiddleware());
app.get("/", (req, res) => res.send("API is working..."));
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

