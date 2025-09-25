import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserData, storeRecentSearchCities } from "../controllers/userControlles.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchCities);

export default userRouter;