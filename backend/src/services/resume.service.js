import logger from "../config/logger.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError, ConflictError } from "../errors/index.js";
import * as resumeRepository from "../repositories/resume.repository.js";

export async function getActive() {
  const resume = await resumeRepository.findActive();
  if (!resume) {
    throw new NotFoundError("No active resume found");
  }
  return resume;
}

export async function getActivePublic() {
  const resume = await resumeRepository.findActive();
  if (!resume) {
    throw new NotFoundError("No active resume found");
  }
  return {
    id: resume.id,
    title: resume.title,
    version: resume.version,
    downloadCount: resume.downloadCount,
    uploadedAt: resume.uploadedAt,
    updatedAt: resume.updatedAt,
  };
}

export async function downloadActive() {
  const resume = await resumeRepository.findActive();
  if (!resume) {
    throw new NotFoundError("No active resume found");
  }

  const updated = await resumeRepository.incrementDownloadCount(resume.id);

  logger.info({ resumeId: resume.id, title: resume.title }, "Resume downloaded");

  return {
    fileUrl: updated.fileUrl,
    downloadCount: updated.downloadCount,
    filename: `resume-${resume.version}.pdf`,
  };
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search } = query;

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { version: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = getSortParams(query, ["uploadedAt", "updatedAt", "title", "version", "downloadCount"]);
  const [resumes, total] = await Promise.all([
    resumeRepository.findAll({ where, orderBy, skip, take: limit }),
    resumeRepository.count(where),
  ]);

  return {
    data: resumes,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getById(id) {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    throw new NotFoundError("Resume not found");
  }
  return resume;
}

export async function create(data) {
  if (data.isActive) {
    await resumeRepository.deactivateAll();
  }

  const resume = await resumeRepository.create({
    title: data.title,
    version: data.version,
    fileUrl: data.fileUrl,
    isActive: data.isActive === true,
  });

  logger.info({ resumeId: resume.id, title: resume.title, version: resume.version }, "Resume created");

  return resume;
}

export async function update(id, data) {
  const existing = await resumeRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Resume not found");
  }

  if (data.isActive && !existing.isActive) {
    await resumeRepository.deactivateAll();
  }

  const resume = await resumeRepository.update(id, data);

  logger.info({ resumeId: id }, "Resume updated");

  return resume;
}

export async function activate(id) {
  const existing = await resumeRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Resume not found");
  }

  if (existing.isActive) {
    return existing;
  }

  await resumeRepository.deactivateAll();

  const resume = await resumeRepository.update(id, { isActive: true });

  logger.info({ resumeId: id, title: resume.title }, "Resume activated");

  return resume;
}

export async function deleteResume(id) {
  const existing = await resumeRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Resume not found");
  }

  await resumeRepository.deleteResume(id);

  logger.info({ resumeId: id, title: existing.title }, "Resume deleted");
}

export async function getStats() {
  const [total, active, totalDownloads] = await Promise.all([
    resumeRepository.count({}),
    resumeRepository.findActive(),
    resumeRepository.getTotalDownloads(),
  ]);

  return {
    total,
    active: active
      ? { id: active.id, title: active.title, version: active.version, downloadCount: active.downloadCount }
      : null,
    totalDownloads,
  };
}
