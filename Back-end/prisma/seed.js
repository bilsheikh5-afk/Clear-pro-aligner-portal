import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@cpa.local" },
    update: {},
    create: { email: "admin@cpa.local", name: "Admin User", passwordHash }
  });

  const dr = await prisma.doctor.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: { name: "Dr. Sarah Johnson", email: "sarah@example.com", specialization: "Orthodontics" }
  });

  const patient = await prisma.patient.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: { name: "John Doe", email: "john@example.com", phone: "+1 555-0101" }
  });

  await prisma.case.upsert({
    where: { code: "CPA-2023-04562" },
    update: {},
    create: {
      code: "CPA-2023-04562",
      diagnosis: "Crowding",
      status: "PENDING",
      doctorId: dr.id,
      patientId: patient.id
    }
  });

  await prisma.activity.createMany({
    data: [
      { userName: "Dr. Sarah Johnson", action: "Case Submitted", details: "CPA-2023-04562 - Crowding", status: "Pending" },
      { userName: "Dr. Michael Chen", action: "Case Approved", details: "CPA-2023-04561 - Spacing", status: "Approved" },
      { userName: "Dr. Emily Rodriguez", action: "Case Submitted", details: "CPA-2023-04560 - Overbite", status: "In Review" }
    ],
    skipDuplicates: true
  });

  console.log("Admin seed complete.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
