import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Project Test Admin",
  email: "project-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testProject = {
  title: "My Test Project",
  category: "Web Development",
  description: "This is a test project description that meets minimum length requirements",
};

const updatedProject = {
  title: "Updated Test Project",
  category: "Mobile App",
  description: "This is an updated test project description for testing purposes",
  featured: true,
  status: "PUBLISHED",
};

let accessToken = "";
let projectId = "";

beforeAll(async () => {
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
  await prisma.projectTechnology.deleteMany({
    where: { project: { title: { in: [testProject.title, updatedProject.title] } } },
  });
  await prisma.project.deleteMany({
    where: { title: { in: [testProject.title, updatedProject.title] } },
  });

  await request(app)
    .post("/api/v1/auth/register")
    .send(testAdmin);

  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: testAdmin.email, password: testAdmin.password });

  const cookies = loginRes.headers["set-cookie"];
  const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
  accessToken = rawCookie.split(";")[0].replace("accessToken=", "");
});

afterAll(async () => {
  await prisma.projectTechnology.deleteMany({
    where: { project: { title: { in: [testProject.title, updatedProject.title] } } },
  });
  await prisma.project.deleteMany({
    where: { title: { in: [testProject.title, updatedProject.title] } },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Project Module — Public Endpoints", () => {
  it("should list projects with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/projects")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
  });

  it("should return empty list when filter matches nothing", async () => {
    const res = await request(app)
      .get("/api/v1/projects?category=Design")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("should return 404 for non-existent slug", async () => {
    const res = await request(app)
      .get("/api/v1/projects/non-existent-project")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid pagination params", async () => {
    const res = await request(app)
      .get("/api/v1/projects?page=-1")
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Project Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .send(testProject)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testProject)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.title).toBe(testProject.title);
    expect(res.body.data.project.slug).toBe("my-test-project");
    expect(res.body.data.project.category).toBe(testProject.category);
    expect(res.body.data.project.status).toBe("PUBLISHED");

    projectId = res.body.data.project.id;
  });

  it("should auto-generate unique slug on duplicate title", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testProject)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.slug).not.toBe("my-test-project");
    expect(res.body.data.project.slug).toContain("my-test-project");
  });
});

describe("Project Module — Admin Read", () => {
  it("should get project by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/projects/${projectId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.id).toBe(projectId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/projects/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return project via public slug endpoint after creation", async () => {
    const res = await request(app)
      .get("/api/v1/projects/my-test-project")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.slug).toBe("my-test-project");
  });
});

describe("Project Module — Admin Update", () => {
  it("should reject update without auth", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/projects/${projectId}`)
      .send(updatedProject)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should update the project", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/projects/${projectId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedProject)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.title).toBe(updatedProject.title);
    expect(res.body.data.project.featured).toBe(true);
    expect(res.body.data.project.status).toBe("PUBLISHED");
  });

  it("should reflect updates in public endpoint", async () => {
    const res = await request(app)
      .get("/api/v1/projects/updated-test-project")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.project.title).toBe(updatedProject.title);
  });
});

describe("Project Module — Admin Delete", () => {
  it("should reject delete without auth", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/projects/${projectId}`)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should delete the project", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/projects/${projectId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should return 404 for deleted project", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/projects/${projectId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe("Project Module — Authorization", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Editor User",
        email: "project-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "project-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "project-editor@tanvirul.dev" } });
  });

  it("should allow EDITOR to read projects", async () => {
    const res = await request(app)
      .get("/api/v1/admin/projects")
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reject EDITOR from creating projects", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .set("Authorization", `Bearer ${editorToken}`)
      .send(testProject)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting projects", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/projects/${projectId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
