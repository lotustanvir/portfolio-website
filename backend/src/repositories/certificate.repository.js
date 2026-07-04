import prisma from "../config/database.js";

const certificateIncludes = {
  skills: {
    include: {
      technology: true,
    },
  },
};

export async function findAll({ where, orderBy, skip, take }) {
  return prisma.certificate.findMany({
    where,
    orderBy,
    skip,
    take,
    include: certificateIncludes,
  });
}

export async function findById(id) {
  return prisma.certificate.findUnique({
    where: { id },
    include: certificateIncludes,
  });
}

export async function create(data) {
  return prisma.certificate.create({
    data,
    include: certificateIncludes,
  });
}

export async function update(id, data) {
  return prisma.certificate.update({
    where: { id },
    data,
    include: certificateIncludes,
  });
}

export async function deleteCertificate(id) {
  return prisma.certificate.delete({ where: { id } });
}

export async function count(where) {
  return prisma.certificate.count({ where });
}

export async function findMaxDisplayOrder() {
  const max = await prisma.certificate.aggregate({
    _max: { displayOrder: true },
  });
  return max._max.displayOrder ?? 0;
}

export async function updateManyOrders(entries) {
  const updates = entries.map(({ id, displayOrder }) =>
    prisma.certificate.update({
      where: { id },
      data: { displayOrder },
    })
  );
  return prisma.$transaction(updates);
}

export async function findDistinctIssuers() {
  const result = await prisma.certificate.findMany({
    select: { issuer: true },
    distinct: ["issuer"],
    orderBy: { issuer: "asc" },
  });
  return result.map((r) => r.issuer);
}
