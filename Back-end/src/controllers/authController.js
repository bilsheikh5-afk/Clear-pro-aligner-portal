import { prisma } from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signAdmin } from "../utils/token.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  return res.json({ token: signAdmin(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};

export const registerAdmin = async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: "User already exists" });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });
  return res.status(201).json({ token: signAdmin(user) });
};
