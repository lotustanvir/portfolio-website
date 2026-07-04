import prisma from "../config/database.js";

const singletonId = "00000000-0000-0000-0000-000000000001";

export async function get() {
  let settings = await prisma.websiteSetting.findFirst();
  if (!settings) {
    settings = await prisma.websiteSetting.create({
      data: { id: singletonId },
    });
  }
  return settings;
}

export async function update(data) {
  let settings = await prisma.websiteSetting.findFirst();
  if (!settings) {
    settings = await prisma.websiteSetting.create({
      data: { id: singletonId, ...data },
    });
    return settings;
  }
  return prisma.websiteSetting.update({
    where: { id: settings.id },
    data,
  });
}
