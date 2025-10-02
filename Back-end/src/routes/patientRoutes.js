import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listPatients, getPatient, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";

const router = Router();

router.get("/", protect, listPatients);
router.get("/:id", protect, getPatient);
router.post("/", protect, createPatient);
router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, deletePatient);

export default router;
