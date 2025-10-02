import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main(){
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.doctor.upsert({
    where: { email: "admin@clearproaligner.com" },
    update: { passwordHash },
    create: { name: "Dr. Sarah Johnson", email: "admin@clearproaligner.com", passwordHash, specialization: "Dental Surgeon" }
  });
  console.log("Seeded demo doctor.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
