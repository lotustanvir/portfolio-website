import prisma from "../config/database.js";

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.message.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function findById(id) {
  return prisma.message.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.message.create({ data });
}

export async function update(id, data) {
  return prisma.message.update({ where: { id }, data });
}

export async function deleteMessage(id) {
  return prisma.message.delete({ where: { id } });
}

export async function count(where) {
  return prisma.message.count({ where });
}

export async function findAllForExport({ where, orderBy }) {
  return prisma.message.findMany({
    where,
    orderBy,
  });
}
