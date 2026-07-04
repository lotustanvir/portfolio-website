import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Dashboard Test Admin",
  email: "dashboard-admin@tanvirul.dev",
  password: "TestPass123!@",
};

let accessToken = "";

const dashboardSlugs = {
  projects: ["dashboard-project-1", "dashboard-project-2", "dashboard-project-3"],
  skills: ["dashboard-skill-1", "dashboard-skill-2", "dashboard-skill-3"],
};

beforeAll(async () => {
  await prisma.resume.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.admin.deleteMany({});

  await request(app)
    .post("/api/v1/auth/register")
    .send(testAdmin);

  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: testAdmin.email, password: testAdmin.password });

  const cookies = loginRes.headers["set-cookie"];
  const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
  accessToken = rawCookie.split(";")[0].replace("accessToken=", "");

  await prisma.project.createMany({
    data: [
      { title: "Dashboard Project 1", slug: dashboardSlugs.projects[0], category: "web", description: "Test project 1", status: "PUBLISHED", featured: true },
      { title: "Dashboard Project 2", slug: dashboardSlugs.projects[1], category: "mobile", description: "Test project 2", status: "DRAFT" },
      { title: "Dashboard Project 3", slug: dashboardSlugs.projects[2], category: "web", description: "Test project 3", status: "PUBLISHED" },
    ],
  });

  await prisma.skill.createMany({
    data: [
      { name: "Dashboard Skill 1", slug: dashboardSlugs.skills[0], category: "Frontend", percentage: 90 },
      { name: "Dashboard Skill 2", slug: dashboardSlugs.skills[1], category: "Backend", percentage: 80 },
      { name: "Dashboard Skill 3", slug: dashboardSlugs.skills[2], category: "Frontend", percentage: 75 },
    ],
  });

  await prisma.experience.createMany({
    data: [
      { company: "Dashboard Co", position: "Dev", description: "Test exp 1", startDate: new Date("2020-01-01"), location: "Remote" },
      { company: "Dashboard Inc", position: "Sr Dev", description: "Test exp 2", startDate: new Date("2022-01-01"), location: "Office" },
    ],
  });

  await prisma.education.createMany({
    data: [
      { institution: "Dashboard Uni", degree: "BSc", startYear: 2018, endYear: 2022 },
      { institution: "Dashboard College", degree: "HSC", startYear: 2016, endYear: 2018 },
    ],
  });

  await prisma.certificate.createMany({
    data: [
      { title: "Dashboard Cert 1", issuer: "AWS", issueDate: new Date("2023-01-01") },
      { title: "Dashboard Cert 2", issuer: "Google", issueDate: new Date("2023-06-01") },
    ],
  });

  await prisma.message.createMany({
    data: [
      { name: "Alice", email: "alice@test.com", subject: "Hello", message: "Test message 1", isRead: false },
      { name: "Bob", email: "bob@test.com", subject: "Hi", message: "Test message 2", isRead: true },
      { name: "Charlie", email: "charlie@test.com", subject: "Hey", message: "Test message 3", isRead: false },
    ],
  });

  await prisma.resume.create({
    data: { title: "Dashboard Resume", version: "v1", fileUrl: "/test.pdf", isActive: true, downloadCount: 10 },
  });
});

afterAll(async () => {
  await prisma.resume.deleteMany({});
  await prisma.project.deleteMany({ where: { slug: { in: dashboardSlugs.projects } } });
  await prisma.skill.deleteMany({ where: { slug: { in: dashboardSlugs.skills } } });
  await prisma.experience.deleteMany({ where: { company: { in: ["Dashboard Co", "Dashboard Inc"] } } });
  await prisma.education.deleteMany({ where: { institution: { in: ["Dashboard Uni", "Dashboard College"] } } });
  await prisma.certificate.deleteMany({ where: { title: { in: ["Dashboard Cert 1", "Dashboard Cert 2"] } } });
  await prisma.message.deleteMany({ where: { email: { in: ["alice@test.com", "bob@test.com", "charlie@test.com"] } } });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Dashboard Module — Authorization", () => {
  it("should reject without auth", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR role", async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Dashboard Editor",
        email: "dashboard-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "dashboard-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const editorToken = cookies.find((c) => c.startsWith("accessToken=")).split(";")[0].replace("accessToken=", "");

    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);

    await prisma.admin.deleteMany({ where: { email: "dashboard-editor@tanvirul.dev" } });
  });

  it("should accept ADMIN role", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

describe("Dashboard Module — Data", () => {
  it("should return correct totals", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);

    const { totals } = res.body.data;
    expect(totals.projects).toBe(3);
    expect(totals.skills).toBe(3);
    expect(totals.experience).toBe(2);
    expect(totals.education).toBe(2);
    expect(totals.certificates).toBe(2);
    expect(totals.unreadMessages).toBe(2);
    expect(totals.resumeDownloads).toBe(10);
  });

  it("should return latest projects sorted by createdAt desc", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const { latestProjects } = res.body.data;
    expect(latestProjects.length).toBeLessThanOrEqual(5);
    expect(latestProjects[0]).toHaveProperty("id");
    expect(latestProjects[0]).toHaveProperty("title");
    expect(latestProjects[0]).toHaveProperty("slug");
    expect(latestProjects[0]).toHaveProperty("category");
    expect(latestProjects[0]).toHaveProperty("status");
    expect(latestProjects[0]).toHaveProperty("featured");
    expect(latestProjects[0]).toHaveProperty("createdAt");
  });

  it("should return latest messages", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const { latestMessages } = res.body.data;
    expect(latestMessages.length).toBeLessThanOrEqual(5);
    expect(latestMessages[0]).toHaveProperty("name");
    expect(latestMessages[0]).toHaveProperty("email");
    expect(latestMessages[0]).toHaveProperty("subject");
    expect(latestMessages[0]).toHaveProperty("isRead");
  });

  it("should return latest certificates", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const { latestCertificates } = res.body.data;
    expect(latestCertificates.length).toBeLessThanOrEqual(5);
    expect(latestCertificates[0]).toHaveProperty("title");
    expect(latestCertificates[0]).toHaveProperty("issuer");
    expect(latestCertificates[0]).toHaveProperty("issueDate");
    expect(latestCertificates[0]).toHaveProperty("isVisible");
  });

  it("should return project statistics with byStatus", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const { projectStatistics } = res.body.data;
    expect(projectStatistics.total).toBe(3);
    expect(projectStatistics.byStatus.published).toBe(2);
    expect(projectStatistics.byStatus.draft).toBe(1);
  });

  it("should return skill statistics by category", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const { skillStatistics } = res.body.data;
    expect(skillStatistics.total).toBe(3);

    const categories = skillStatistics.categories;
    expect(categories.Frontend).toBeDefined();
    expect(categories.Frontend.count).toBe(2);
    expect(typeof categories.Frontend.averagePercentage).toBe("number");

    expect(categories.Backend).toBeDefined();
    expect(categories.Backend.count).toBe(1);
  });
});
