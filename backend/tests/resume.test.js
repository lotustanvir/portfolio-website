import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Resume Test Admin",
  email: "resume-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testResume = {
  title: "Software Engineer Resume",
  version: "v1.0",
  fileUrl: "/uploads/resumes/test-resume.pdf",
  isActive: true,
};

const testResumeV2 = {
  title: "Senior Software Engineer Resume",
  version: "v2.0",
  fileUrl: "/uploads/resumes/test-resume-v2.pdf",
};

let accessToken = "";
let resumeId = "";
let resumeV2Id = "";

beforeAll(async () => {
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
  await prisma.resume.deleteMany({});

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
  await prisma.resume.deleteMany({
    where: { title: { in: [testResume.title, testResumeV2.title, "Updated Resume Title"] } },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Resume Module — Public Endpoints", () => {
  it("should return 404 when no active resume exists", async () => {
    const res = await request(app)
      .get("/api/v1/resume")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return 404 on download when no active resume exists", async () => {
    const res = await request(app)
      .get("/api/v1/resume/download")
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe("Resume Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume")
      .send(testResume)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new resume version", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testResume)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe(testResume.title);
    expect(res.body.data.resume.version).toBe(testResume.version);
    expect(res.body.data.resume.fileUrl).toBe(testResume.fileUrl);
    expect(res.body.data.resume.isActive).toBe(true);
    expect(res.body.data.resume.downloadCount).toBe(0);

    resumeId = res.body.data.resume.id;
  });

  it("should create second resume version (not active)", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testResumeV2)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe(testResumeV2.title);
    expect(res.body.data.resume.isActive).toBe(false);

    resumeV2Id = res.body.data.resume.id;
  });
});

describe("Resume Module — Admin Read", () => {
  it("should list all resume versions", async () => {
    const res = await request(app)
      .get("/api/v1/admin/resume")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("should get resume by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/resume/${resumeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.id).toBe(resumeId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/resume/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should get active resume via admin endpoint", async () => {
    const res = await request(app)
      .get("/api/v1/admin/resume/active")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.id).toBe(resumeId);
    expect(res.body.data.resume.isActive).toBe(true);
  });

  it("should show active resume via public endpoint", async () => {
    const res = await request(app)
      .get("/api/v1/resume")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe(testResume.title);
    expect(res.body.data.resume.version).toBe(testResume.version);
    expect(res.body.data.resume.downloadCount).toBeDefined();
    expect(res.body.data.resume.fileUrl).toBeUndefined();
  });
});

describe("Resume Module — Admin Update", () => {
  it("should update the resume metadata", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/resume/${resumeV2Id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Updated Resume Title" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe("Updated Resume Title");
  });
});

describe("Resume Module — Activate", () => {
  it("should activate second version", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/resume/${resumeV2Id}/activate`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.isActive).toBe(true);
  });

  it("should deactivate the previously active version", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/resume/${resumeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.resume.isActive).toBe(false);
  });

  it("should reflect active change in public endpoint", async () => {
    const res = await request(app)
      .get("/api/v1/resume")
      .expect(200);

    expect(res.body.data.resume.title).toBe("Updated Resume Title");
  });
});

describe("Resume Module — Download", () => {
  it("should redirect and increment download count", async () => {
    const before = await request(app)
      .get(`/api/v1/admin/resume/${resumeV2Id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const countBefore = before.body.data.resume.downloadCount;

    const res = await request(app)
      .get("/api/v1/resume/download")
      .expect(302);

    expect(res.headers.location).toMatch(/^\/uploads\/resumes\//);

    const after = await request(app)
      .get(`/api/v1/admin/resume/${resumeV2Id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(after.body.data.resume.downloadCount).toBe(countBefore + 1);
  });
});

describe("Resume Module — File Upload", () => {
  it("should reject upload without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume/upload")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should upload a resume PDF", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("resume", Buffer.from("%PDF-resume-content"), "my-resume.pdf")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\/resumes\//);
    expect(res.body.data.originalname).toBe("my-resume.pdf");
  });

  it("should reject non-PDF file for resume upload", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("resume", Buffer.from("not-a-pdf"), "resume.txt")
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Resume Module — Statistics", () => {
  it("should return resume stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/resume/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThanOrEqual(2);
    expect(res.body.data.stats.active).toBeTruthy();
    expect(res.body.data.stats.active.id).toBe(resumeV2Id);
    expect(res.body.data.stats.totalDownloads).toBeGreaterThanOrEqual(0);
  });
});

describe("Resume Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Resume Editor",
        email: "resume-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "resume-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "resume-editor@tanvirul.dev" } });
  });

  it("should reject ADMIN from deleting resumes (only SUPER_ADMIN)", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/resume/${resumeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting resumes", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/resume/${resumeId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from creating resumes", async () => {
    const res = await request(app)
      .post("/api/v1/admin/resume")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({
        title: "Editor Resume",
        version: "v1",
        fileUrl: "/uploads/resumes/editor.pdf",
      })
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from activating resumes", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/resume/${resumeId}/activate`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
