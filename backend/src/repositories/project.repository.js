import prisma from "../config/database.js";

const projectIncludes = {
  technologies: {
    include: {
      technology: true,
    },
  },
};

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.project.findMany({
    where,
    orderBy,
    skip,
    take,
    include: projectIncludes,
  });
}

export async function findById(id) {
  return prisma.project.findUnique({
    where: { id },
    include: projectIncludes,
  });
}

export async function findBySlug(slug) {
  return prisma.project.findUnique({
    where: { slug },
    include: projectIncludes,
  });
}

export async function create(data) {
  return prisma.project.create({
    data,
    include: projectIncludes,
  });
}

export async function update(id, data) {
  return prisma.project.update({
    where: { id },
    data,
    include: projectIncludes,
  });
}

export async function deleteProject(id) {
  return prisma.project.delete({ where: { id } });
}

export async function count(where) {
  return prisma.project.count({ where });
}

export async function findSlug(slug, excludeId) {
  const where = excludeId ? { slug, id: { not: excludeId } } : { slug };
  return prisma.project.findFirst({ where });
}
