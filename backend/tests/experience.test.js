import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Experience Test Admin",
  email: "experience-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testExperience = {
  company: "Test Corp",
  position: "Software Engineer",
  employmentType: "FULL_TIME",
  description: "This is a test experience description that meets minimum length.",
  location: "Remote",
  startDate: "2023-01-01T00:00:00.000Z",
  isCurrent: true,
};

const updatedExperience = {
  company: "Updated Corp",
  position: "Senior Engineer",
  employmentType: "CONTRACT",
  description: "This is an updated experience description for testing purposes.",
  location: "New York, USA",
  startDate: "2022-06-01T00:00:00.000Z",
  endDate: "2023-12-31T00:00:00.000Z",
  isCurrent: false,
};

let accessToken = "";
let experienceId = "";

beforeAll(async () => {
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });

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
  await prisma.experienceTechnology.deleteMany({
    where: { experience: { company: { in: [testExperience.company, updatedExperience.company, "Reorder Exp A", "Reorder Exp B"] } } },
  });
  await prisma.experience.deleteMany({
    where: { company: { in: [testExperience.company, updatedExperience.company, "Reorder Exp A", "Reorder Exp B"] } },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Experience Module — Public Endpoints", () => {
  it("should list visible experiences with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/experience")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/experience/00000000-0000-0000-0000-000000000000")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should filter by isCurrent", async () => {
    const res = await request(app)
      .get("/api/v1/experience?isCurrent=true")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.every((e) => e.isCurrent === true)).toBe(true);
  });
});

describe("Experience Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/experience")
      .send(testExperience)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/experience")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ company: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new experience with auto-generated display order", async () => {
    const res = await request(app)
      .post("/api/v1/admin/experience")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testExperience)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.company).toBe(testExperience.company);
    expect(res.body.data.experience.position).toBe(testExperience.position);
    expect(res.body.data.experience.employmentType).toBe(testExperience.employmentType);
    expect(res.body.data.experience.isCurrent).toBe(true);
    expect(res.body.data.experience.isVisible).toBe(true);
    expect(res.body.data.experience.displayOrder).toBeGreaterThanOrEqual(0);

    experienceId = res.body.data.experience.id;
  });
});

describe("Experience Module — Admin Read", () => {
  it("should get experience by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/experience/${experienceId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.id).toBe(experienceId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/experience/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return experience via public ID endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/experience/${experienceId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.id).toBe(experienceId);
  });
});

describe("Experience Module — Admin Update", () => {
  it("should update the experience", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/experience/${experienceId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedExperience)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.company).toBe(updatedExperience.company);
    expect(res.body.data.experience.position).toBe(updatedExperience.position);
    expect(res.body.data.experience.isCurrent).toBe(false);
    expect(res.body.data.experience.endDate).toBeTruthy();
  });

  it("should reflect updates in public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/experience/${experienceId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.company).toBe(updatedExperience.company);
  });
});

describe("Experience Module — Visibility Toggle", () => {
  it("should hide experience from public", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/experience/${experienceId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.isVisible).toBe(false);
  });

  it("should return 404 when hidden experience accessed via public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/experience/${experienceId}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should show experience again", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/experience/${experienceId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.experience.isVisible).toBe(true);
  });
});

describe("Experience Module — Reorder", () => {
  let expAId, expBId;

  beforeAll(async () => {
    const a = await request(app)
      .post("/api/v1/admin/experience")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        company: "Reorder Exp A",
        position: "Dev",
        employmentType: "FULL_TIME",
        description: "Reorder experience A description text for testing.",
        location: "Remote",
        startDate: "2022-01-01T00:00:00.000Z",
      });

    const b = await request(app)
      .post("/api/v1/admin/experience")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        company: "Reorder Exp B",
        position: "Senior Dev",
        employmentType: "FULL_TIME",
        description: "Reorder experience B description text for testing.",
        location: "Remote",
        startDate: "2023-01-01T00:00:00.000Z",
      });

    expAId = a.body.data.experience.id;
    expBId = b.body.data.experience.id;
  });

  it("should reorder experiences", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/experience/reorder")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        orders: [
          { id: expAId, displayOrder: 100 },
          { id: expBId, displayOrder: 200 },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reflect new order", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/experience/${expAId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.experience.displayOrder).toBe(100);
  });

  it("should reject reorder with non-existent experience", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/experience/reorder")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        orders: [
          { id: "00000000-0000-0000-0000-000000000000", displayOrder: 1 },
        ],
      })
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe("Experience Module — Statistics", () => {
  it("should return experience stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/experience/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThan(0);
    expect(res.body.data.stats.visible).toBeGreaterThan(0);
    expect(res.body.data.stats.currentJobs).toBeGreaterThanOrEqual(0);
    expect(res.body.data.stats.companies).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.stats.companyList)).toBe(true);
  });
});

describe("Experience Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Experience Editor",
        email: "experience-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "experience-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "experience-editor@tanvirul.dev" } });
  });

  it("should reject ADMIN from deleting experiences (only SUPER_ADMIN)", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/experience/${experienceId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting experiences", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/experience/${experienceId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from creating experiences", async () => {
    const res = await request(app)
      .post("/api/v1/admin/experience")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({
        company: "Editor Exp",
        position: "Tester",
        employmentType: "FULL_TIME",
        description: "Editor should not be able to create this.",
        location: "Remote",
        startDate: "2023-01-01T00:00:00.000Z",
      })
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
