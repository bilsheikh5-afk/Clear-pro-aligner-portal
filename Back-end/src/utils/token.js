import jwt from "jsonwebtoken";
export const signAdmin = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
export const signDoctor = (doctor) =>
  jwt.sign({ id: doctor.id, email: doctor.email, name: doctor.name, type: "DOCTOR" }, process.env.JWT_SECRET, { expiresIn: "7d" });
