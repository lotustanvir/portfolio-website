import prisma from "../config/database.js";
import logger from "../config/logger.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError } from "../errors/index.js";
import * as certificateRepository from "../repositories/certificate.repository.js";

export async function getAllPublic(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, issuer, skillIds } = query;

  const where = { isVisible: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { issuer: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (issuer) {
    where.issuer = { contains: issuer, mode: "insensitive" };
  }

  if (skillIds) {
    const ids = Array.isArray(skillIds)
      ? skillIds
      : skillIds.split(",").map((id) => id.trim());
    where.skills = {
      some: {
        technologyId: { in: ids },
      },
    };
  }

  const orderBy = getSortParams(query, ["issueDate", "expiryDate", "createdAt", "updatedAt", "title", "issuer", "displayOrder"]);
  const [certificates, total] = await Promise.all([
    certificateRepository.findAll({ where, orderBy, skip, take: limit }),
    certificateRepository.count(where),
  ]);

  return {
    data: certificates,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, issuer, skillIds } = query;

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { issuer: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (issuer) {
    where.issuer = { contains: issuer, mode: "insensitive" };
  }

  if (skillIds) {
    const ids = Array.isArray(skillIds)
      ? skillIds
      : skillIds.split(",").map((id) => id.trim());
    where.skills = {
      some: {
        technologyId: { in: ids },
      },
    };
  }

  const orderBy = getSortParams(query, ["issueDate", "expiryDate", "createdAt", "updatedAt", "title", "issuer", "displayOrder"]);
  const [certificates, total] = await Promise.all([
    certificateRepository.findAll({ where, orderBy, skip, take: limit }),
    certificateRepository.count(where),
  ]);

  return {
    data: certificates,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getById(id) {
  const certificate = await certificateRepository.findById(id);
  if (!certificate) {
    throw new NotFoundError("Certificate not found");
  }
  return certificate;
}

export async function getByIdPublic(id) {
  const certificate = await certificateRepository.findById(id);
  if (!certificate || !certificate.isVisible) {
    throw new NotFoundError("Certificate not found");
  }
  return certificate;
}

export async function create(data) {
  const { skillIds, ...certificateData } = data;

  let displayOrder = data.displayOrder;
  if (displayOrder === undefined || displayOrder === null) {
    const maxOrder = await certificateRepository.findMaxDisplayOrder();
    displayOrder = maxOrder + 1;
  }

  const createData = {
    ...certificateData,
    displayOrder,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
  };

  if (skillIds && skillIds.length > 0) {
    createData.skills = {
      create: skillIds.map((id) => ({
        technology: { connect: { id } },
      })),
    };
  }

  const certificate = await certificateRepository.create(createData);

  logger.info({ certificateId: certificate.id, title: certificate.title }, "Certificate created");

  return certificate;
}

export async function update(id, data) {
  const existing = await certificateRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Certificate not found");
  }

  const { skillIds, ...certificateData } = data;

  if (skillIds !== undefined) {
    await prisma.certificateTechnology.deleteMany({ where: { certificateId: id } });

    if (skillIds.length > 0) {
      await prisma.certificateTechnology.createMany({
        data: skillIds.map((technologyId) => ({
          certificateId: id,
          technologyId,
        })),
      });
    }
  }

  const certificate = await certificateRepository.update(id, certificateData);

  logger.info({ certificateId: id }, "Certificate updated");

  return certificate;
}

export async function deleteCertificate(id) {
  const existing = await certificateRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Certificate not found");
  }

  await certificateRepository.deleteCertificate(id);

  logger.info({ certificateId: id, title: existing.title }, "Certificate deleted");
}

export async function reorder(orders) {
  const existingIds = await certificateRepository.findAll({
    where: { id: { in: orders.map((o) => o.id) } },
    orderBy: { displayOrder: "asc" },
    skip: undefined,
    take: undefined,
  });

  const existingIdSet = new Set(existingIds.map((c) => c.id));
  const missingIds = orders.filter((o) => !existingIdSet.has(o.id));

  if (missingIds.length > 0) {
    throw new NotFoundError(
      `Certificates not found: ${missingIds.map((o) => o.id).join(", ")}`
    );
  }

  await certificateRepository.updateManyOrders(orders);

  logger.info({ count: orders.length }, "Certificates reordered");
}

export async function toggleVisibility(id, isVisible) {
  const existing = await certificateRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Certificate not found");
  }

  const certificate = await certificateRepository.update(id, { isVisible });

  logger.info({ certificateId: id, isVisible }, "Certificate visibility toggled");

  return certificate;
}

export async function getStats() {
  const [total, visible, hidden, issuers] = await Promise.all([
    certificateRepository.count({}),
    certificateRepository.count({ isVisible: true }),
    certificateRepository.count({ isVisible: false }),
    certificateRepository.findDistinctIssuers(),
  ]);

  return {
    total,
    visible,
    hidden,
    issuers: issuers.length,
    issuerList: issuers,
  };
}
