import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import doctorAuthRoutes from "./routes/doctorAuthRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { uploadDir } from "./config/upload.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/", (_req, res) => res.json({ ok: true, name: "ClearPro Backend (Unified)" }));

// Static uploads
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);            // admin auth
app.use("/api/doctors", doctorAuthRoutes);   // doctor login
app.use("/api/doctor-admin", doctorRoutes);  // admin manage doctors
app.use("/api/patients", patientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://clear-pro-aligner-portal10.onrender.com${PORT}`));
