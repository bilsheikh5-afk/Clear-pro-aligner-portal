import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";

const router = Router();

router.get("/", protect, listDoctors);
router.get("/:id", protect, getDoctor);
router.post("/", protect, createDoctor);
router.put("/:id", protect, updateDoctor);
router.delete("/:id", protect, deleteDoctor);

export default router;
