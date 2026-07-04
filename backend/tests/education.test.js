import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Education Test Admin",
  email: "education-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testEducation = {
  institution: "Test University",
  degree: "Bachelor of Science",
  department: "Computer Science",
  cgpa: "3.80/4.00",
  startYear: 2020,
  endYear: 2024,
  isCurrent: false,
  description: "Completed bachelor degree in computer science.",
};

const updatedEducation = {
  institution: "Updated University",
  degree: "Master of Science",
  department: "Software Engineering",
  cgpa: "3.95/4.00",
  startYear: 2024,
  isCurrent: true,
  description: "Pursuing master degree in software engineering.",
};

let accessToken = "";
let educationId = "";

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
  await prisma.education.deleteMany({
    where: {
      institution: {
        in: [
          testEducation.institution,
          updatedEducation.institution,
          "Reorder Edu A",
          "Reorder Edu B",
        ],
      },
    },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Education Module — Public Endpoints", () => {
  it("should list visible education records with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/education")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/education/00000000-0000-0000-0000-000000000000")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should filter by institution", async () => {
    const res = await request(app)
      .get("/api/v1/education?institution=Test")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("Education Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/education")
      .send(testEducation)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/education")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ institution: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new education record with auto-generated display order", async () => {
    const res = await request(app)
      .post("/api/v1/admin/education")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testEducation)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.institution).toBe(testEducation.institution);
    expect(res.body.data.education.degree).toBe(testEducation.degree);
    expect(res.body.data.education.department).toBe(testEducation.department);
    expect(res.body.data.education.cgpa).toBe(testEducation.cgpa);
    expect(res.body.data.education.startYear).toBe(testEducation.startYear);
    expect(res.body.data.education.endYear).toBe(testEducation.endYear);
    expect(res.body.data.education.isCurrent).toBe(false);
    expect(res.body.data.education.isVisible).toBe(true);
    expect(res.body.data.education.displayOrder).toBeGreaterThanOrEqual(0);

    educationId = res.body.data.education.id;
  });
});

describe("Education Module — Admin Read", () => {
  it("should get education record by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/education/${educationId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.id).toBe(educationId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/education/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return education record via public ID endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/education/${educationId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.id).toBe(educationId);
  });
});

describe("Education Module — Admin Update", () => {
  it("should update the education record", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/education/${educationId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedEducation)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.institution).toBe(updatedEducation.institution);
    expect(res.body.data.education.degree).toBe(updatedEducation.degree);
    expect(res.body.data.education.isCurrent).toBe(true);
    expect(res.body.data.education.endYear).toBeNull();
  });

  it("should reflect updates in public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/education/${educationId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.institution).toBe(updatedEducation.institution);
  });
});

describe("Education Module — Visibility Toggle", () => {
  it("should hide education record from public", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/education/${educationId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.isVisible).toBe(false);
  });

  it("should return 404 when hidden education record accessed via public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/education/${educationId}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should show education record again", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/education/${educationId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.education.isVisible).toBe(true);
  });
});

describe("Education Module — Reorder", () => {
  let eduAId, eduBId;

  beforeAll(async () => {
    const a = await request(app)
      .post("/api/v1/admin/education")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        institution: "Reorder Edu A",
        degree: "Bachelor",
        startYear: 2020,
        description: "Reorder education A.",
      });

    const b = await request(app)
      .post("/api/v1/admin/education")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        institution: "Reorder Edu B",
        degree: "Master",
        startYear: 2024,
        description: "Reorder education B.",
      });

    eduAId = a.body.data.education.id;
    eduBId = b.body.data.education.id;
  });

  it("should reorder education records", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/education/reorder")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        orders: [
          { id: eduAId, displayOrder: 100 },
          { id: eduBId, displayOrder: 200 },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reflect new order", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/education/${eduAId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.education.displayOrder).toBe(100);
  });

  it("should reject reorder with non-existent education record", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/education/reorder")
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

describe("Education Module — Statistics", () => {
  it("should return education stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/education/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThan(0);
    expect(res.body.data.stats.visible).toBeGreaterThan(0);
    expect(res.body.data.stats.institutions).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.stats.institutionList)).toBe(true);
    expect(res.body.data.stats.degrees).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.stats.degreeList)).toBe(true);
  });
});

describe("Education Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Education Editor",
        email: "education-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "education-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "education-editor@tanvirul.dev" } });
  });

  it("should reject ADMIN from deleting education records (only SUPER_ADMIN)", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/education/${educationId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting education records", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/education/${educationId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from creating education records", async () => {
    const res = await request(app)
      .post("/api/v1/admin/education")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({
        institution: "Editor Edu",
        degree: "Tester",
        startYear: 2023,
        description: "Editor should not be able to create this.",
      })
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
