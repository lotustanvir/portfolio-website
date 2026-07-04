import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Message Test Admin",
  email: "message-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testMessage = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Collaboration Inquiry",
  message: "Hello, I would like to discuss a potential collaboration opportunity for a web development project.",
};

const testMessage2 = {
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Job Opportunity",
  message: "We are looking for a senior developer to join our team. Please let us know if you are interested.",
};

let accessToken = "";
let messageId = "";
let message2Id = "";

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
  await prisma.message.deleteMany({
    where: {
      email: { in: [testMessage.email, testMessage2.email] },
    },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Contact Module — Public Submission", () => {
  it("should reject message with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ name: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...testMessage, email: "not-an-email" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject short message", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...testMessage, message: "Hi" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should submit a contact message successfully", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send(testMessage)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.name).toBe(testMessage.name);
    expect(res.body.data.message.email).toBe(testMessage.email);
    expect(res.body.data.message.subject).toBe(testMessage.subject);
    expect(res.body.data.message.isRead).toBe(false);
    expect(res.body.data.message.isArchived).toBe(false);
    expect(res.body.data.message.isReplied).toBe(false);

    messageId = res.body.data.message.id;
  });

  it("should submit a second contact message", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send(testMessage2)
      .expect(201);

    expect(res.body.success).toBe(true);
    message2Id = res.body.data.message.id;
  });
});

describe("Contact Module — Admin List & Read", () => {
  it("should reject listing without auth", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should list all messages with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.pagination).toBeDefined();
  });

  it("should filter by isRead", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages?isRead=false")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.every((m) => m.isRead === false)).toBe(true);
  });

  it("should get message by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/messages/${messageId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.id).toBe(messageId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe("Contact Module — Mark Read", () => {
  it("should mark message as read", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/messages/${messageId}/read`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isRead: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.isRead).toBe(true);
  });

  it("should mark message as unread", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/messages/${messageId}/read`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isRead: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.isRead).toBe(false);
  });
});

describe("Contact Module — Archive", () => {
  it("should archive a message", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/messages/${messageId}/archive`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isArchived: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.isArchived).toBe(true);
  });

  it("should filter archived messages", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages?isArchived=true")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.every((m) => m.isArchived === true)).toBe(true);
  });

  it("should unarchive a message", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/messages/${messageId}/archive`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isArchived: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.isArchived).toBe(false);
  });
});

describe("Contact Module — Reply", () => {
  it("should reply to a message", async () => {
    const res = await request(app)
      .post(`/api/v1/admin/messages/${messageId}/reply`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ replyMessage: "Thank you for reaching out. I will get back to you soon." })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.isReplied).toBe(true);
    expect(res.body.data.message.repliedBy).toBe(testAdmin.name);
    expect(res.body.data.message.replyMessage).toBeTruthy();
  });

  it("should filter replied messages", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages?isReplied=true")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.every((m) => m.isReplied === true)).toBe(true);
  });

  it("should reject reply with no message", async () => {
    const res = await request(app)
      .post(`/api/v1/admin/messages/${messageId}/reply`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Contact Module — Statistics", () => {
  it("should return message stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThanOrEqual(2);
    expect(res.body.data.stats.unread).toBeGreaterThanOrEqual(0);
    expect(res.body.data.stats.read).toBeGreaterThanOrEqual(0);
    expect(res.body.data.stats.archived).toBeGreaterThanOrEqual(0);
    expect(res.body.data.stats.replied).toBeGreaterThanOrEqual(1);
    expect(res.body.data.stats.unreplied).toBeGreaterThanOrEqual(0);
  });
});

describe("Contact Module — CSV Export", () => {
  it("should reject export without auth", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages/export")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should export messages as CSV", async () => {
    const res = await request(app)
      .get("/api/v1/admin/messages/export")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.headers["content-type"]).toMatch(/text\/csv/);
    expect(res.headers["content-disposition"]).toContain("messages-export.csv");
    expect(res.text).toContain("ID,Name,Email,Subject,Message");
    expect(res.text).toContain(testMessage.name);
    expect(res.text).toContain(testMessage2.email);
  });
});

describe("Contact Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Message Editor",
        email: "message-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "message-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "message-editor@tanvirul.dev" } });
  });

  it("should reject EDITOR from deleting messages", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/messages/${messageId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should allow ADMIN to delete messages", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/messages/${messageId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should return 404 for deleted message", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/messages/${messageId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});
