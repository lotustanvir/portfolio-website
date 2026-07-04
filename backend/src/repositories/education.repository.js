import prisma from "../config/database.js";

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.education.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function findById(id) {
  return prisma.education.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.education.create({ data });
}

export async function update(id, data) {
  return prisma.education.update({ where: { id }, data });
}

export async function deleteEducation(id) {
  return prisma.education.delete({ where: { id } });
}

export async function count(where) {
  return prisma.education.count({ where });
}

export async function findMaxDisplayOrder() {
  const max = await prisma.education.aggregate({
    _max: { displayOrder: true },
  });
  return max._max.displayOrder ?? 0;
}

export async function updateManyOrders(entries) {
  const updates = entries.map(({ id, displayOrder }) =>
    prisma.education.update({
      where: { id },
      data: { displayOrder },
    })
  );
  return prisma.$transaction(updates);
}

export async function findDistinctInstitutions() {
  const result = await prisma.education.findMany({
    select: { institution: true },
    distinct: ["institution"],
    orderBy: { institution: "asc" },
  });
  return result.map((r) => r.institution);
}

export async function findDistinctDegrees() {
  const result = await prisma.education.findMany({
    select: { degree: true },
    distinct: ["degree"],
    orderBy: { degree: "asc" },
  });
  return result.map((r) => r.degree);
}
