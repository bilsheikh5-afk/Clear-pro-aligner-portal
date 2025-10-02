import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { kpis, trends, recentActivity } from "../controllers/analyticsController.js";

const router = Router();

router.get("/kpis", protect, kpis);
router.get("/trends", protect, trends);
router.get("/recent-activity", protect, recentActivity);

export default router;
