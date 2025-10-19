import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { adminRoute } from "../middleware/adminRoute.js";
import { getAdminOverview } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/overview", protectedRoute, adminRoute, getAdminOverview);

export default router;
