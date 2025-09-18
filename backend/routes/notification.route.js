import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  deleteAllNotifications,
  getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("", protectedRoute, getNotifications);
router.delete("", protectedRoute, deleteAllNotifications);

export default router;
