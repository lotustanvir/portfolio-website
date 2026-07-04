import prisma from "../config/database.js";

const experienceIncludes = {
  technologies: {
    include: {
      technology: true,
    },
  },
};

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.experience.findMany({
    where,
    orderBy,
    skip,
    take,
    include: experienceIncludes,
  });
}

export async function findById(id) {
  return prisma.experience.findUnique({
    where: { id },
    include: experienceIncludes,
  });
}

export async function create(data) {
  return prisma.experience.create({
    data,
    include: experienceIncludes,
  });
}

export async function update(id, data) {
  return prisma.experience.update({
    where: { id },
    data,
    include: experienceIncludes,
  });
}

export async function deleteExperience(id) {
  return prisma.experience.delete({ where: { id } });
}

export async function count(where) {
  return prisma.experience.count({ where });
}

export async function findMaxDisplayOrder() {
  const max = await prisma.experience.aggregate({
    _max: { displayOrder: true },
  });
  return max._max.displayOrder ?? 0;
}

export async function updateManyOrders(entries) {
  const updates = entries.map(({ id, displayOrder }) =>
    prisma.experience.update({
      where: { id },
      data: { displayOrder },
    })
  );
  return prisma.$transaction(updates);
}

export async function findDistinctCompanies() {
  const result = await prisma.experience.findMany({
    select: { company: true },
    distinct: ["company"],
    orderBy: { company: "asc" },
  });
  return result.map((r) => r.company);
}
