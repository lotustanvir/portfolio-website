import logger from "../config/logger.js";
import { slugify, uniqueSlug } from "../utils/slug.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError, ConflictError } from "../errors/index.js";
import * as skillRepository from "../repositories/skill.repository.js";

export async function getAllPublic(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, category } = query;

  const where = { isVisible: true };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (category) {
    where.category = category;
  }

  const orderBy = getSortParams(query, ["displayOrder", "createdAt", "updatedAt", "name", "percentage"]);
  const [skills, total] = await Promise.all([
    skillRepository.findAll({ where, orderBy, skip, take: limit }),
    skillRepository.count(where),
  ]);

  return {
    data: skills,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, category } = query;

  const where = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (category) {
    where.category = category;
  }

  const orderBy = getSortParams(query, ["displayOrder", "createdAt", "updatedAt", "name", "percentage"]);
  const [skills, total] = await Promise.all([
    skillRepository.findAll({ where, orderBy, skip, take: limit }),
    skillRepository.count(where),
  ]);

  return {
    data: skills,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getBySlug(slug) {
  const skill = await skillRepository.findBySlug(slug);
  if (!skill || !skill.isVisible) {
    throw new NotFoundError("Skill not found");
  }
  return skill;
}

export async function getById(id) {
  const skill = await skillRepository.findById(id);
  if (!skill) {
    throw new NotFoundError("Skill not found");
  }
  return skill;
}

export async function getCategories() {
  return skillRepository.findDistinctCategories();
}

export async function create(data) {
  const existing = await skillRepository.findByName(data.name);
  if (existing) {
    throw new ConflictError("A skill with this name already exists");
  }

  let slug = slugify(data.name);
  const slugExists = await skillRepository.findSlug(slug);
  if (slugExists) {
    slug = uniqueSlug(slug);
  }

  let displayOrder = data.displayOrder;
  if (displayOrder === undefined || displayOrder === null) {
    const maxOrder = await skillRepository.findMaxDisplayOrder();
    displayOrder = maxOrder + 1;
  }

  const skill = await skillRepository.create({
    name: data.name,
    slug,
    category: data.category,
    percentage: data.percentage,
    icon: data.icon || null,
    color: data.color || null,
    displayOrder,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
  });

  logger.info({ skillId: skill.id, name: skill.name }, "Skill created");

  return skill;
}

export async function update(id, data) {
  const existing = await skillRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Skill not found");
  }

  if (data.name && data.name !== existing.name) {
    const nameExists = await skillRepository.findByName(data.name);
    if (nameExists) {
      throw new ConflictError("A skill with this name already exists");
    }
  }

  const updateData = { ...data };

  if (data.name && data.name !== existing.name) {
    let slug = slugify(data.name);
    const slugExists = await skillRepository.findSlug(slug, id);
    if (slugExists) {
      slug = uniqueSlug(slug);
    }
    updateData.slug = slug;
  }

  const skill = await skillRepository.update(id, updateData);

  logger.info({ skillId: id }, "Skill updated");

  return skill;
}

export async function deleteSkill(id) {
  const existing = await skillRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Skill not found");
  }

  await skillRepository.deleteSkill(id);

  logger.info({ skillId: id, name: existing.name }, "Skill deleted");
}

export async function reorder(orders) {
  const existingIds = await skillRepository.findAll({
    where: { id: { in: orders.map((o) => o.id) } },
    orderBy: { displayOrder: "asc" },
    skip: undefined,
    take: undefined,
  });

  const existingIdSet = new Set(existingIds.map((s) => s.id));
  const missingIds = orders.filter((o) => !existingIdSet.has(o.id));

  if (missingIds.length > 0) {
    throw new NotFoundError(
      `Skills not found: ${missingIds.map((o) => o.id).join(", ")}`
    );
  }

  await skillRepository.updateManyOrders(orders);

  logger.info({ count: orders.length }, "Skills reordered");
}

export async function toggleVisibility(id, isVisible) {
  const existing = await skillRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Skill not found");
  }

  const skill = await skillRepository.update(id, { isVisible });

  logger.info({ skillId: id, isVisible }, "Skill visibility toggled");

  return skill;
}

export async function getStats() {
  const [total, visible, hidden, categories, avgPercentage, maxDisplay] = await Promise.all([
    skillRepository.count({}),
    skillRepository.count({ isVisible: true }),
    skillRepository.count({ isVisible: false }),
    skillRepository.getCategoryCounts(),
    skillRepository.getAveragePercentage(),
    skillRepository.findMaxDisplayOrder(),
  ]);

  const topSkills = await skillRepository.findAll({
    where: {},
    orderBy: { percentage: "desc" },
    skip: 0,
    take: 5,
  });

  return {
    total,
    visible,
    hidden,
    averagePercentage: Math.round(avgPercentage * 100) / 100,
    categories: categories.map((c) => ({
      category: c.category,
      count: c._count.category,
      averagePercentage: Math.round(c._avg.percentage * 100) / 100,
    })),
    topSkills: topSkills.map((s) => ({
      id: s.id,
      name: s.name,
      percentage: s.percentage,
      category: s.category,
    })),
  };
}
