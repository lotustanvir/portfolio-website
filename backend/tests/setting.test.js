import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Settings Test Admin",
  email: "settings-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const updatedSettings = {
  siteTitle: "Tanvirul Islam",
  siteDescription: "Full Stack Developer Portfolio",
  seoTitle: "Tanvirul Islam — Portfolio",
  seoDescription: "Full Stack Developer specializing in React, Node.js, and PostgreSQL",
  heroTitle: "Hi, I'm Tanvirul",
  heroSubtitle: "Full Stack Developer",
  email: "tanvirul@example.com",
  phone: "+8801234567890",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/tanvirul",
  linkedin: "https://linkedin.com/in/tanvirul",
  facebook: "https://facebook.com/tanvirul",
  instagram: "https://instagram.com/tanvirul",
  themeColor: "#6366f1",
};

let accessToken = "";

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
  await prisma.websiteSetting.deleteMany({});
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Settings Module — Public Endpoint", () => {
  it("should return default empty settings when none exist", async () => {
    const res = await request(app)
      .get("/api/v1/settings")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.settings).toBeDefined();
  });

  it("should return settings after they are updated", async () => {
    await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSettings);

    const res = await request(app)
      .get("/api/v1/settings")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.settings.siteTitle).toBe(updatedSettings.siteTitle);
    expect(res.body.data.settings.heroTitle).toBe(updatedSettings.heroTitle);
    expect(res.body.data.settings.email).toBe(updatedSettings.email);
    expect(res.body.data.settings.github).toBe(updatedSettings.github);
    expect(res.body.data.settings.linkedin).toBe(updatedSettings.linkedin);
  });
});

describe("Settings Module — Admin Read", () => {
  it("should reject without auth", async () => {
    const res = await request(app)
      .get("/api/v1/admin/settings")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should get full settings", async () => {
    const res = await request(app)
      .get("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.settings.siteTitle).toBe(updatedSettings.siteTitle);
    expect(res.body.data.settings.heroTitle).toBe(updatedSettings.heroTitle);
    expect(res.body.data.settings.email).toBe(updatedSettings.email);
    expect(res.body.data.settings.github).toBe(updatedSettings.github);
  });
});

describe("Settings Module — Admin Update", () => {
  it("should reject update without auth", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .send(updatedSettings)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid email", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: "not-an-email" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid theme color", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ themeColor: "invalid" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid URLs", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ github: "not-a-url" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should partially update settings", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ siteTitle: "Updated Title", themeColor: "#ff5733" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.settings.siteTitle).toBe("Updated Title");
    expect(res.body.data.settings.themeColor).toBe("#ff5733");
    expect(res.body.data.settings.heroTitle).toBe(updatedSettings.heroTitle);
  });

  it("should cache bust and return new values publicly", async () => {
    const res = await request(app)
      .get("/api/v1/settings")
      .expect(200);

    expect(res.body.data.settings.siteTitle).toBe("Updated Title");
  });

  it("should accept minimal update", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ about: "I am a passionate developer with expertise in full stack development." })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.settings.about).toContain("passionate developer");
  });
});

describe("Settings Module — Authorization", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Settings Editor",
        email: "settings-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "settings-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "settings-editor@tanvirul.dev" } });
  });

  it("should allow EDITOR to read settings", async () => {
    const res = await request(app)
      .get("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reject EDITOR from updating settings", async () => {
    const res = await request(app)
      .put("/api/v1/admin/settings")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({ siteTitle: "Hack Attempt" })
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
