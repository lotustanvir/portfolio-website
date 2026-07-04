import prisma from "../config/database.js";

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.skill.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function findById(id) {
  return prisma.skill.findUnique({ where: { id } });
}

export async function findBySlug(slug) {
  return prisma.skill.findUnique({ where: { slug } });
}

export async function findByName(name) {
  return prisma.skill.findUnique({ where: { name } });
}

export async function create(data) {
  return prisma.skill.create({ data });
}

export async function update(id, data) {
  return prisma.skill.update({ where: { id }, data });
}

export async function deleteSkill(id) {
  return prisma.skill.delete({ where: { id } });
}

export async function count(where) {
  return prisma.skill.count({ where });
}

export async function findSlug(slug, excludeId) {
  const where = excludeId ? { slug, id: { not: excludeId } } : { slug };
  return prisma.skill.findFirst({ where });
}

export async function findMaxDisplayOrder() {
  const max = await prisma.skill.aggregate({
    _max: { displayOrder: true },
  });
  return max._max.displayOrder ?? 0;
}

export async function updateManyOrders(entries) {
  const updates = entries.map(({ id, displayOrder }) =>
    prisma.skill.update({
      where: { id },
      data: { displayOrder },
    })
  );
  return prisma.$transaction(updates);
}

export async function getCategoryCounts() {
  const skills = await prisma.skill.groupBy({
    by: ["category"],
    _count: { category: true },
    _avg: { percentage: true },
    orderBy: { category: "asc" },
  });
  return skills;
}

export async function getAveragePercentage() {
  const result = await prisma.skill.aggregate({
    _avg: { percentage: true },
  });
  return result._avg.percentage ?? 0;
}

export async function findDistinctCategories() {
  const result = await prisma.skill.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return result.map((r) => r.category);
}
