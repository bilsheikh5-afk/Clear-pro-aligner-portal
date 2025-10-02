import { prisma } from "../config/prisma.js";
import { hashPassword } from "../utils/hash.js";

export const listDoctors = async (req, res) => {
  const docs = await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
  res.json(docs);
};

export const getDoctor = async (req, res) => {
  const id = Number(req.params.id);
  const doc = await prisma.doctor.findUnique({ where: { id }, include: { cases: true } });
  if (!doc) return res.status(404).json({ message: "Doctor not found" });
  res.json(doc);
};

export const createDoctor = async (req, res) => {
  const { name, email, specialization, password } = req.body;
  const data = { name, email, specialization };
  if (password) data.passwordHash = await hashPassword(password);
  const doctor = await prisma.doctor.create({ data });
  res.status(201).json(doctor);
};

export const updateDoctor = async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, specialization, password } = req.body;
  const data = { name, email, specialization };
  if (password) data.passwordHash = await hashPassword(password);
  const doctor = await prisma.doctor.update({ where: { id }, data });
  res.json(doctor);
};

export const deleteDoctor = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.doctor.delete({ where: { id } });
  res.json({ message: "Doctor deleted" });
};
