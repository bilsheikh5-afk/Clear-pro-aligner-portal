import { prisma } from "../config/prisma.js";
import { comparePassword } from "../utils/hash.js";
import { signDoctor } from "../utils/token.js";

export const doctorLogin = async (req, res) => {
  const { email, password } = req.body;
  const doc = await prisma.doctor.findUnique({ where: { email } });
  if (!doc || !doc.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await comparePassword(password, doc.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signDoctor(doc);
  res.json({ token, doctor: { id: doc.id, name: doc.name, email: doc.email } });
};
