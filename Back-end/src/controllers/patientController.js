import { prisma } from "../config/prisma.js";

export const listPatients = async (req, res) => {
  const pts = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
  res.json(pts);
};

export const getPatient = async (req, res) => {
  const id = Number(req.params.id);
  const pt = await prisma.patient.findUnique({ where: { id }, include: { cases: true } });
  if (!pt) return res.status(404).json({ message: "Patient not found" });
  res.json(pt);
};

export const createPatient = async (req, res) => {
  const { name, email, phone } = req.body;
  const patient = await prisma.patient.create({ data: { name, email, phone } });
  res.status(201).json(patient);
};

export const updatePatient = async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone } = req.body;
  const patient = await prisma.patient.update({ where: { id }, data: { name, email, phone } });
  res.json(patient);
};

export const deletePatient = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.patient.delete({ where: { id } });
  res.json({ message: "Patient deleted" });
};
