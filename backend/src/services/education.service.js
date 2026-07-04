import logger from "../config/logger.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError } from "../errors/index.js";
import * as educationRepository from "../repositories/education.repository.js";

export async function getAllPublic(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, institution, degree } = query;

  const where = { isVisible: true };

  if (search) {
    where.OR = [
      { institution: { contains: search, mode: "insensitive" } },
      { degree: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (institution) {
    where.institution = { contains: institution, mode: "insensitive" };
  }

  if (degree) {
    where.degree = { contains: degree, mode: "insensitive" };
  }

  const orderBy = getSortParams(query, ["startYear", "endYear", "createdAt", "updatedAt", "institution", "degree", "displayOrder"]);
  const [educations, total] = await Promise.all([
    educationRepository.findAll({ where, orderBy, skip, take: limit }),
    educationRepository.count(where),
  ]);

  return {
    data: educations,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, institution, degree } = query;

  const where = {};

  if (search) {
    where.OR = [
      { institution: { contains: search, mode: "insensitive" } },
      { degree: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (institution) {
    where.institution = { contains: institution, mode: "insensitive" };
  }

  if (degree) {
    where.degree = { contains: degree, mode: "insensitive" };
  }

  const orderBy = getSortParams(query, ["startYear", "endYear", "createdAt", "updatedAt", "institution", "degree", "displayOrder"]);
  const [educations, total] = await Promise.all([
    educationRepository.findAll({ where, orderBy, skip, take: limit }),
    educationRepository.count(where),
  ]);

  return {
    data: educations,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getById(id) {
  const education = await educationRepository.findById(id);
  if (!education) {
    throw new NotFoundError("Education not found");
  }
  return education;
}

export async function getByIdPublic(id) {
  const education = await educationRepository.findById(id);
  if (!education || !education.isVisible) {
    throw new NotFoundError("Education not found");
  }
  return education;
}

export async function create(data) {
  let displayOrder = data.displayOrder;
  if (displayOrder === undefined || displayOrder === null) {
    const maxOrder = await educationRepository.findMaxDisplayOrder();
    displayOrder = maxOrder + 1;
  }

  const education = await educationRepository.create({
    institution: data.institution,
    degree: data.degree,
    department: data.department || null,
    cgpa: data.cgpa || null,
    startYear: data.startYear,
    endYear: data.endYear || null,
    isCurrent: data.isCurrent !== undefined ? data.isCurrent : false,
    description: data.description || null,
    displayOrder,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
  });

  logger.info({ educationId: education.id, institution: education.institution }, "Education created");

  return education;
}

export async function update(id, data) {
  const existing = await educationRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Education not found");
  }

  if (data.isCurrent && data.endYear === undefined) {
    data.endYear = null;
  }

  const education = await educationRepository.update(id, data);

  logger.info({ educationId: id }, "Education updated");

  return education;
}

export async function deleteEducation(id) {
  const existing = await educationRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Education not found");
  }

  await educationRepository.deleteEducation(id);

  logger.info({ educationId: id, institution: existing.institution }, "Education deleted");
}

export async function reorder(orders) {
  const existingIds = await educationRepository.findAll({
    where: { id: { in: orders.map((o) => o.id) } },
    orderBy: { displayOrder: "asc" },
    skip: undefined,
    take: undefined,
  });

  const existingIdSet = new Set(existingIds.map((e) => e.id));
  const missingIds = orders.filter((o) => !existingIdSet.has(o.id));

  if (missingIds.length > 0) {
    throw new NotFoundError(
      `Education records not found: ${missingIds.map((o) => o.id).join(", ")}`
    );
  }

  await educationRepository.updateManyOrders(orders);

  logger.info({ count: orders.length }, "Education reordered");
}

export async function toggleVisibility(id, isVisible) {
  const existing = await educationRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Education not found");
  }

  const education = await educationRepository.update(id, { isVisible });

  logger.info({ educationId: id, isVisible }, "Education visibility toggled");

  return education;
}

export async function getStats() {
  const [total, visible, hidden, institutions, degrees] = await Promise.all([
    educationRepository.count({}),
    educationRepository.count({ isVisible: true }),
    educationRepository.count({ isVisible: false }),
    educationRepository.findDistinctInstitutions(),
    educationRepository.findDistinctDegrees(),
  ]);

  return {
    total,
    visible,
    hidden,
    institutions: institutions.length,
    institutionList: institutions,
    degrees: degrees.length,
    degreeList: degrees,
  };
}
