import prisma from "../config/database.js";
import logger from "../config/logger.js";
import { slugify, uniqueSlug } from "../utils/slug.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError } from "../errors/index.js";
import * as projectRepository from "../repositories/project.repository.js";

export async function getAll(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, status, featured, category, technologyIds } = query;

  const where = {};

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  if (status) {
    where.status = status;
  }

  if (featured !== undefined) {
    where.featured = featured === "true";
  }

  if (category) {
    where.category = category;
  }

  if (technologyIds) {
    const ids = Array.isArray(technologyIds)
      ? technologyIds
      : technologyIds.split(",").map((id) => id.trim());
    where.technologies = {
      some: {
        technologyId: { in: ids },
      },
    };
  }

  const orderBy = getSortParams(query, ["createdAt", "updatedAt", "title"]);
  const [projects, total] = await Promise.all([
    projectRepository.findAll({ where, orderBy, skip, take: limit }),
    projectRepository.count(where),
  ]);

  return {
    data: projects,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getBySlug(slug) {
  const project = await projectRepository.findBySlug(slug);
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
}

export async function getById(id) {
  const project = await projectRepository.findById(id);
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
}

export async function create(data) {
  let slug = slugify(data.title);

  const existing = await projectRepository.findSlug(slug);
  if (existing) {
    slug = uniqueSlug(slug);
  }

  const { technologyIds, ...projectData } = data;

  const createData = {
    ...projectData,
    slug,
  };

  if (technologyIds && technologyIds.length > 0) {
    createData.technologies = {
      create: technologyIds.map((id) => ({
        technology: { connect: { id } },
      })),
    };
  }

  const project = await projectRepository.create(createData);

  logger.info({ projectId: project.id, title: project.title }, "Project created");

  return project;
}

export async function update(id, data) {
  const existing = await projectRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Project not found");
  }

  const { technologyIds, ...projectData } = data;

  if (projectData.title && projectData.title !== existing.title) {
    let slug = slugify(projectData.title);
    const slugExists = await projectRepository.findSlug(slug, id);
    if (slugExists) {
      slug = uniqueSlug(slug);
    }
    projectData.slug = slug;
  }

  if (technologyIds !== undefined) {
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

    if (technologyIds.length > 0) {
      await prisma.projectTechnology.createMany({
        data: technologyIds.map((technologyId) => ({
          projectId: id,
          technologyId,
        })),
      });
    }
  }

  const project = await projectRepository.update(id, projectData);

  logger.info({ projectId: id }, "Project updated");

  return project;
}

export async function deleteProject(id) {
  const existing = await projectRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Project not found");
  }

  await projectRepository.deleteProject(id);

  logger.info({ projectId: id, title: existing.title }, "Project deleted");
}

export async function getStats() {
  const [total, published, draft, archived, featuredCount] = await Promise.all([
    projectRepository.count({}),
    projectRepository.count({ status: "PUBLISHED" }),
    projectRepository.count({ status: "DRAFT" }),
    projectRepository.count({ status: "ARCHIVED" }),
    projectRepository.count({ featured: true }),
  ]);

  return { total, published, draft, archived, featured: featuredCount };
}
