import prisma from "../config/database.js";
import logger from "../config/logger.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError } from "../errors/index.js";
import * as experienceRepository from "../repositories/experience.repository.js";

export async function getAllPublic(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isCurrent, company, employmentType, technologyIds } = query;

  const where = { isVisible: true };

  if (search) {
    where.OR = [
      { company: { contains: search, mode: "insensitive" } },
      { position: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isCurrent !== undefined) {
    where.isCurrent = isCurrent === "true";
  }

  if (company) {
    where.company = { contains: company, mode: "insensitive" };
  }

  if (employmentType) {
    where.employmentType = employmentType;
  }

  if (technologyIds) {
    const ids = Array.isArray(technologyIds)
      ? technologyIds
      : technologyIds.split(",").map((id) => id.trim());
    where.technologies = {
      some: {
        technologyId: { in: ids },
      },
    };
  }

  const orderBy = getSortParams(query, ["startDate", "endDate", "createdAt", "updatedAt", "company", "displayOrder"]);
  const [experiences, total] = await Promise.all([
    experienceRepository.findAll({ where, orderBy, skip, take: limit }),
    experienceRepository.count(where),
  ]);

  return {
    data: experiences,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isCurrent, company, employmentType, technologyIds } = query;

  const where = {};

  if (search) {
    where.OR = [
      { company: { contains: search, mode: "insensitive" } },
      { position: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isCurrent !== undefined) {
    where.isCurrent = isCurrent === "true";
  }

  if (company) {
    where.company = { contains: company, mode: "insensitive" };
  }

  if (employmentType) {
    where.employmentType = employmentType;
  }

  if (technologyIds) {
    const ids = Array.isArray(technologyIds)
      ? technologyIds
      : technologyIds.split(",").map((id) => id.trim());
    where.technologies = {
      some: {
        technologyId: { in: ids },
      },
    };
  }

  const orderBy = getSortParams(query, ["startDate", "endDate", "createdAt", "updatedAt", "company", "displayOrder"]);
  const [experiences, total] = await Promise.all([
    experienceRepository.findAll({ where, orderBy, skip, take: limit }),
    experienceRepository.count(where),
  ]);

  return {
    data: experiences,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getById(id) {
  const experience = await experienceRepository.findById(id);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }
  return experience;
}

export async function getByIdPublic(id) {
  const experience = await experienceRepository.findById(id);
  if (!experience || !experience.isVisible) {
    throw new NotFoundError("Experience not found");
  }
  return experience;
}

export async function create(data) {
  const { technologyIds, ...experienceData } = data;

  let displayOrder = data.displayOrder;
  if (displayOrder === undefined || displayOrder === null) {
    const maxOrder = await experienceRepository.findMaxDisplayOrder();
    displayOrder = maxOrder + 1;
  }

  const createData = {
    ...experienceData,
    displayOrder,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
  };

  if (technologyIds && technologyIds.length > 0) {
    createData.technologies = {
      create: technologyIds.map((id) => ({
        technology: { connect: { id } },
      })),
    };
  }

  const experience = await experienceRepository.create(createData);

  logger.info({ experienceId: experience.id, company: experience.company }, "Experience created");

  return experience;
}

export async function update(id, data) {
  const existing = await experienceRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Experience not found");
  }

  const { technologyIds, ...experienceData } = data;

  if (technologyIds !== undefined) {
    await prisma.experienceTechnology.deleteMany({ where: { experienceId: id } });

    if (technologyIds.length > 0) {
      await prisma.experienceTechnology.createMany({
        data: technologyIds.map((technologyId) => ({
          experienceId: id,
          technologyId,
        })),
      });
    }
  }

  const experience = await experienceRepository.update(id, experienceData);

  logger.info({ experienceId: id }, "Experience updated");

  return experience;
}

export async function deleteExperience(id) {
  const existing = await experienceRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Experience not found");
  }

  await experienceRepository.deleteExperience(id);

  logger.info({ experienceId: id, company: existing.company }, "Experience deleted");
}

export async function reorder(orders) {
  const existingIds = await experienceRepository.findAll({
    where: { id: { in: orders.map((o) => o.id) } },
    orderBy: { displayOrder: "asc" },
    skip: undefined,
    take: undefined,
  });

  const existingIdSet = new Set(existingIds.map((e) => e.id));
  const missingIds = orders.filter((o) => !existingIdSet.has(o.id));

  if (missingIds.length > 0) {
    throw new NotFoundError(
      `Experiences not found: ${missingIds.map((o) => o.id).join(", ")}`
    );
  }

  await experienceRepository.updateManyOrders(orders);

  logger.info({ count: orders.length }, "Experiences reordered");
}

export async function toggleVisibility(id, isVisible) {
  const existing = await experienceRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Experience not found");
  }

  const experience = await experienceRepository.update(id, { isVisible });

  logger.info({ experienceId: id, isVisible }, "Experience visibility toggled");

  return experience;
}

export async function getStats() {
  const [total, visible, hidden, currentJobs, companies] = await Promise.all([
    experienceRepository.count({}),
    experienceRepository.count({ isVisible: true }),
    experienceRepository.count({ isVisible: false }),
    experienceRepository.count({ isCurrent: true }),
    experienceRepository.findDistinctCompanies(),
  ]);

  return {
    total,
    visible,
    hidden,
    currentJobs,
    companies: companies.length,
    companyList: companies,
  };
}
