import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Skill Test Admin",
  email: "skill-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testSkill = {
  name: "My Test Skill",
  category: "Frontend",
  percentage: 90,
};

const updatedSkill = {
  name: "Updated Test Skill",
  category: "Backend",
  percentage: 75,
  color: "#339933",
};

let accessToken = "";
let skillId = "";
let skillSlug = "";

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
  await prisma.skill.deleteMany({
    where: {
      name: { in: [testSkill.name, updatedSkill.name, "Reorder Skill A", "Reorder Skill B"] },
    },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Skill Module — Public Endpoints", () => {
  it("should list visible skills with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/skills")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("should return 404 for non-existent slug", async () => {
    const res = await request(app)
      .get("/api/v1/skills/non-existent-skill")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should list categories", async () => {
    const res = await request(app)
      .get("/api/v1/skills/categories")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.categories)).toBe(true);
  });

  it("should filter skills by category", async () => {
    const res = await request(app)
      .get("/api/v1/skills?category=Frontend")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.every((s) => s.category === "Frontend")).toBe(true);
  });
});

describe("Skill Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .send(testSkill)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new skill with auto-generated slug and display order", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testSkill)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.name).toBe(testSkill.name);
    expect(res.body.data.skill.slug).toBe("my-test-skill");
    expect(res.body.data.skill.category).toBe(testSkill.category);
    expect(res.body.data.skill.percentage).toBe(testSkill.percentage);
    expect(res.body.data.skill.isVisible).toBe(true);
    expect(res.body.data.skill.displayOrder).toBeGreaterThan(0);

    skillId = res.body.data.skill.id;
    skillSlug = res.body.data.skill.slug;
  });

  it("should reject duplicate name", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testSkill)
      .expect(409);

    expect(res.body.success).toBe(false);
  });
});

describe("Skill Module — Admin Read", () => {
  it("should get skill by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/skills/${skillId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.id).toBe(skillId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/skills/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return skill via public slug endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/skills/${skillSlug}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.slug).toBe(skillSlug);
  });
});

describe("Skill Module — Admin Update", () => {
  it("should update the skill", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/skills/${skillId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSkill)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.name).toBe(updatedSkill.name);
    expect(res.body.data.skill.category).toBe(updatedSkill.category);
    expect(res.body.data.skill.percentage).toBe(updatedSkill.percentage);
    expect(res.body.data.skill.color).toBe(updatedSkill.color);
  });

  it("should auto-generate new slug when name changes", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/skills/${skillId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.skill.slug).toBe("updated-test-skill");
  });
});

describe("Skill Module — Visibility Toggle", () => {
  it("should hide skill from public", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/skills/${skillId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.isVisible).toBe(false);
  });

  it("should return 404 when hidden skill accessed via public slug", async () => {
    const res = await request(app)
      .get("/api/v1/skills/updated-test-skill")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should show skill again", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/skills/${skillId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.skill.isVisible).toBe(true);
  });
});

describe("Skill Module — Reorder", () => {
  let skillAId, skillBId;

  beforeAll(async () => {
    const a = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Reorder Skill A", category: "Testing", percentage: 50 });

    const b = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Reorder Skill B", category: "Testing", percentage: 60 });

    skillAId = a.body.data.skill.id;
    skillBId = b.body.data.skill.id;
  });

  it("should reorder skills", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/skills/reorder")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        orders: [
          { id: skillAId, displayOrder: 100 },
          { id: skillBId, displayOrder: 200 },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reflect new order", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/skills/${skillAId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.skill.displayOrder).toBe(100);
  });

  it("should reject reorder with non-existent skill", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/skills/reorder")
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

describe("Skill Module — Statistics", () => {
  it("should return skill stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/skills/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThan(0);
    expect(res.body.data.stats.visible).toBeGreaterThan(0);
    expect(res.body.data.stats.averagePercentage).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.stats.categories)).toBe(true);
    expect(Array.isArray(res.body.data.stats.topSkills)).toBe(true);
  });
});

describe("Skill Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Skill Editor",
        email: "skill-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "skill-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "skill-editor@tanvirul.dev" } });
  });

  it("should reject ADMIN from deleting skills (only SUPER_ADMIN)", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/skills/${skillId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting skills", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/skills/${skillId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from creating skills", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({ name: "Editor Skill", category: "Testing", percentage: 50 })
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
