import { prisma } from "../config/prisma.js";
import { CaseStatus } from "@prisma/client";

export const kpis = async (req, res) => {
  const [doctorCount, caseCount, patientCount, approvedCount, pendingCount, inReviewCount, rejectedCount] = await Promise.all([
    prisma.doctor.count(),
    prisma.case.count(),
    prisma.patient.count(),
    prisma.case.count({ where: { status: CaseStatus.APPROVED } }),
    prisma.case.count({ where: { status: CaseStatus.PENDING } }),
    prisma.case.count({ where: { status: CaseStatus.IN_REVIEW } }),
    prisma.case.count({ where: { status: CaseStatus.REJECTED } }),
  ]);

  const successRate = caseCount ? Math.round((approvedCount / caseCount) * 100) : 0;
  const avgReviewDays = 2.3;

  res.json({
    doctors: doctorCount,
    cases: caseCount,
    patients: patientCount,
    successRate,
    statusBreakdown: {
      pending: pendingCount,
      inReview: inReviewCount,
      approved: approvedCount,
      rejected: rejectedCount
    },
    avgReviewDays
  });
};

export const trends = async (req, res) => {
  const year = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);
  const data = await Promise.all(months.map(async (m) => {
    const start = new Date(year, m, 1);
    const end = new Date(year, m + 1, 1);
    const count = await prisma.case.count({ where: { createdAt: { gte: start, lt: end } } });
    return count;
  }));
  res.json({ labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], data });
};

export const recentActivity = async (req, res) => {
  const items = await prisma.activity.findMany({ orderBy: { date: "desc" }, take: 50 });
  res.json(items);
};
