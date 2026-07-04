import prisma from "../config/database.js";

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.resume.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function findById(id) {
  return prisma.resume.findUnique({ where: { id } });
}

export async function findActive() {
  return prisma.resume.findFirst({ where: { isActive: true } });
}

export async function create(data) {
  return prisma.resume.create({ data });
}

export async function update(id, data) {
  return prisma.resume.update({ where: { id }, data });
}

export async function deleteResume(id) {
  return prisma.resume.delete({ where: { id } });
}

export async function count(where) {
  return prisma.resume.count({ where });
}

export async function deactivateAll() {
  return prisma.resume.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });
}

export async function incrementDownloadCount(id) {
  return prisma.resume.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  });
}

export async function getTotalDownloads() {
  const result = await prisma.resume.aggregate({
    _sum: { downloadCount: true },
  });
  return result._sum.downloadCount ?? 0;
}
