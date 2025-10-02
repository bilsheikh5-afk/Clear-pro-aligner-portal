import { Router } from "express";
import { login, registerAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", protect, registerAdmin);

export default router;
