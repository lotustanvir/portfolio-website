import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Test Admin",
  email: "test-auth@tanvirul.dev",
  password: "TestPass123!@",
};

let accessToken = "";

beforeAll(async () => {
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
  await prisma.admin.deleteMany({ where: { email: "editor@tanvirul.dev" } });
  await prisma.admin.deleteMany({ where: { email: "weak@tanvirul.dev" } });
});

afterAll(async () => {
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
  await prisma.admin.deleteMany({ where: { email: "editor@tanvirul.dev" } });
  await prisma.admin.deleteMany({ where: { email: "weak@tanvirul.dev" } });
});

describe("Auth Module — Registration", () => {
  it("should register a new admin", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(testAdmin)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.admin.email).toBe(testAdmin.email);
  });

  it("should reject duplicate email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(testAdmin)
      .expect(409);

    expect(res.body.success).toBe(false);
  });

  it("should reject weak password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Weak", email: "weak@tanvirul.dev", password: "short" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Auth Module — Login", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email, password: testAdmin.password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.admin.email).toBe(testAdmin.email);
  });

  it("should reject invalid password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email, password: "WrongPass123!@" })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nonexistent@tanvirul.dev", password: "TestPass123!@" })
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});

describe("Auth Module — Authenticated Endpoints", () => {
  it("should return current admin with Bearer token", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email, password: testAdmin.password })
      .expect(200);

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    accessToken = rawCookie.split(";")[0].replace("accessToken=", "");

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.admin.email).toBe(testAdmin.email);
  });

  it("should reject without token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should verify valid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/verify")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.valid).toBe(true);
  });

  it("should reject with invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalidtoken")
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});

describe("Auth Module — Validation", () => {
  it("should reject login with missing password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject register with missing name", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@test.com", password: "ValidPass123!@" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Auth Module — Authorization Roles", () => {
  it("should register a default ADMIN role", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Editor User",
        email: "editor@tanvirul.dev",
        password: "EditorPass123!@",
      })
      .expect(201);

    expect(res.body.data.admin.role).toBe("ADMIN");
  });
});
