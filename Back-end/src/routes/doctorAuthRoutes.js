import { Router } from "express";
import { doctorLogin } from "../controllers/doctorAuthController.js";

const router = Router();
router.post("/login", doctorLogin);
export default router;
