import path from "path";
import { prisma } from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";

export const listCases = async (req, res) => {
  const { status, q } = req.query;
  const where = {
    AND: [
      status ? { status: status } : {},
      q ? { OR: [{ code: { contains: q } }, { diagnosis: { contains: q } }] } : {}
    ]
  };
  const cases = await prisma.case.findMany({
    where,
    include: { doctor: true, patient: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(cases);
};

export const createCase = async (req, res) => {
  const { code, diagnosis, status, doctorId, patientId } = req.body;
  const c = await prisma.case.create({
    data: { code, diagnosis, status, doctorId: Number(doctorId), patientId: Number(patientId) }
  });
  res.status(201).json(c);
};

export const updateCaseStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const c = await prisma.case.update({ where: { id }, data: { status } });
  res.json(c);
};

export const removeCase = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.case.delete({ where: { id } });
  res.json({ message: "Case deleted" });
};

// ---- Doctor portal helpers ----
async function generateCaseCode() {
  const year = new Date().getFullYear();
  const count = await prisma.case.count({ where: { createdAt: { gte: new Date(year, 0, 1) } } });
  const seq = String(count + 1).padStart(5, "0");
  return `CPA-${year}-${seq}`;
}

export const submitCase = async (req, res) => {
  const doctorId = req.doctor.id;
  const {
    patientName, patientEmail, patientPhone,
    caseType, complexity, treatmentDuration,
    previousTreatment, notes
  } = req.body;

  let patient = null;
  if (patientEmail) patient = await prisma.patient.findUnique({ where: { email: patientEmail } });
  if (!patient) {
    patient = await prisma.patient.create({
      data: { name: patientName || "Unknown Patient", email: patientEmail, phone: patientPhone }
    });
  }

  const code = await generateCaseCode();

  const created = await prisma.case.create({
    data: {
      code,
      diagnosis: caseType,
      status: "PENDING",
      caseType,
      complexity,
      treatmentDurationMonths: treatmentDuration ? Number(treatmentDuration) : null,
      previousTreatment,
      notes,
      doctorId,
      patientId: patient.id,
    }
  });

  const files = [
    ...(req.files?.stlFiles || []).map(f => ({ file: f, category: "stl" })),
    ...(req.files?.photos || []).map(f => ({ file: f, category: "photo" })),
    ...(req.files?.xrays || []).map(f => ({ file: f, category: "xray" })),
  ];

  for (const { file, category } of files) {
    await prisma.caseFile.create({
      data: {
        caseId: created.id,
        category,
        url: `/${uploadDir}/${path.basename(file.path)}`.replace(/\\/g, "/"),
        original_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
      }
    });
  }

  await prisma.activity.create({
    data: {
      userName: (await prisma.doctor.findUnique({ where: { id: doctorId } })).name,
      action: "Case Submitted",
      details: `${code} - ${caseType || "Unspecified"}`,
      status: "Pending",
    }
  });

  res.status(201).json({ caseId: code });
};

export const myCases = async (req, res) => {
  const doctorId = req.doctor.id;
  const rows = await prisma.case.findMany({
    where: { doctorId },
    include: { patient: true },
    orderBy: { createdAt: "desc" }
  });
  const mapped = rows.map(r => ({
    case_id: r.code,
    patient_name: r.patient?.name || "Unknown",
    submitted_at: r.createdAt,
    case_type: r.caseType || r.diagnosis || "",
    status: r.status
  }));
  res.json(mapped);
};

export const getCaseByCode = async (req, res) => {
  const doctorId = req.doctor.id;
  const code = req.params.code;
  const row = await prisma.case.findUnique({
    where: { code },
    include: { patient: true, files: true, doctor: true }
  });
  if (!row || row.doctorId !== doctorId) return res.status(404).json({ error: "Not found" });
  res.json({
    case_id: row.code,
    patient_name: row.patient?.name,
    case_type: row.caseType || row.diagnosis,
    status: row.status,
    files: row.files.map(f => ({
      url: f.url,
      original_name: f.original_name,
      mime_type: f.mime_type,
      file_size: f.file_size
    }))
  });
};
