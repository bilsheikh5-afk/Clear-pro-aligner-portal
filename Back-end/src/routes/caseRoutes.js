import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { protectDoctor } from "../middleware/authDoctor.js";
import { listCases, createCase, updateCaseStatus, removeCase, submitCase, myCases, getCaseByCode } from "../controllers/caseController.js";
import { upload } from "../config/upload.js";

const router = Router();

// Admin endpoints
router.get("/", protect, listCases);
router.post("/", protect, createCase);
router.put("/:id/status", protect, updateCaseStatus);
router.delete("/:id", protect, removeCase);

// Doctor portal endpoints
const multi = upload.fields([
  { name: "stlFiles", maxCount: 20 },
  { name: "photos", maxCount: 50 },
  { name: "xrays", maxCount: 50 },
]);
router.post("/submit", protectDoctor, multi, submitCase);
router.get("/my-cases", protectDoctor, myCases);
router.get("/:code", protectDoctor, getCaseByCode);

export default router;
