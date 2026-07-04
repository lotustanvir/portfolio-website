import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

const testAdmin = {
  name: "Certificate Test Admin",
  email: "certificate-admin@tanvirul.dev",
  password: "TestPass123!@",
};

const testCertificate = {
  title: "AWS Solutions Architect",
  issuer: "Amazon Web Services",
  description: "Cloud architecture certification.",
  issueDate: "2024-06-15T00:00:00.000Z",
  credentialLink: "https://credentials.aws.com/verify",
  image: "/uploads/certificates/test-image.jpg",
};

const updatedCertificate = {
  title: "Google Cloud Professional",
  issuer: "Google Cloud",
  description: "Cloud engineering certification.",
  issueDate: "2025-01-10T00:00:00.000Z",
  expiryDate: "2028-01-10T00:00:00.000Z",
  pdfUrl: "/uploads/certificates/test-cert.pdf",
};

let accessToken = "";
let certificateId = "";

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
  await prisma.certificateTechnology.deleteMany({
    where: { certificate: { title: { in: [testCertificate.title, updatedCertificate.title, "Reorder Cert A", "Reorder Cert B"] } } },
  });
  await prisma.certificate.deleteMany({
    where: { title: { in: [testCertificate.title, updatedCertificate.title, "Reorder Cert A", "Reorder Cert B"] } },
  });
  await prisma.admin.deleteMany({ where: { email: testAdmin.email } });
});

describe("Certificate Module — Public Endpoints", () => {
  it("should list visible certificates with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/certificates")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/certificates/00000000-0000-0000-0000-000000000000")
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should filter by issuer", async () => {
    const res = await request(app)
      .get("/api/v1/certificates?issuer=Amazon")
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

describe("Certificate Module — Admin Create", () => {
  it("should reject create without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates")
      .send(testCertificate)
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject create with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Incomplete" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should create a new certificate with auto-generated display order", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testCertificate)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.title).toBe(testCertificate.title);
    expect(res.body.data.certificate.issuer).toBe(testCertificate.issuer);
    expect(res.body.data.certificate.credentialLink).toBe(testCertificate.credentialLink);
    expect(res.body.data.certificate.image).toBe(testCertificate.image);
    expect(res.body.data.certificate.isVisible).toBe(true);
    expect(res.body.data.certificate.displayOrder).toBeGreaterThanOrEqual(0);

    certificateId = res.body.data.certificate.id;
  });
});

describe("Certificate Module — Admin Read", () => {
  it("should get certificate by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/certificates/${certificateId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.id).toBe(certificateId);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/api/v1/admin/certificates/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should return certificate via public ID endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/certificates/${certificateId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.id).toBe(certificateId);
  });
});

describe("Certificate Module — Admin Update", () => {
  it("should update the certificate", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/certificates/${certificateId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedCertificate)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.title).toBe(updatedCertificate.title);
    expect(res.body.data.certificate.issuer).toBe(updatedCertificate.issuer);
    expect(res.body.data.certificate.pdfUrl).toBe(updatedCertificate.pdfUrl);
    expect(res.body.data.certificate.expiryDate).toBeTruthy();
  });

  it("should reflect updates in public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/certificates/${certificateId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.title).toBe(updatedCertificate.title);
  });
});

describe("Certificate Module — Visibility Toggle", () => {
  it("should hide certificate from public", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/certificates/${certificateId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: false })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.isVisible).toBe(false);
  });

  it("should return 404 when hidden certificate accessed via public endpoint", async () => {
    const res = await request(app)
      .get(`/api/v1/certificates/${certificateId}`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it("should show certificate again", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/certificates/${certificateId}/visibility`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isVisible: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.isVisible).toBe(true);
  });
});

describe("Certificate Module — Reorder", () => {
  let certAId, certBId;

  beforeAll(async () => {
    const a = await request(app)
      .post("/api/v1/admin/certificates")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Reorder Cert A",
        issuer: "Issuer A",
        issueDate: "2024-01-01T00:00:00.000Z",
      });

    const b = await request(app)
      .post("/api/v1/admin/certificates")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Reorder Cert B",
        issuer: "Issuer B",
        issueDate: "2024-06-01T00:00:00.000Z",
      });

    certAId = a.body.data.certificate.id;
    certBId = b.body.data.certificate.id;
  });

  it("should reorder certificates", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/certificates/reorder")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        orders: [
          { id: certAId, displayOrder: 100 },
          { id: certBId, displayOrder: 200 },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should reflect new order", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/certificates/${certAId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.certificate.displayOrder).toBe(100);
  });

  it("should reject reorder with non-existent certificate", async () => {
    const res = await request(app)
      .patch("/api/v1/admin/certificates/reorder")
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

describe("Certificate Module — Statistics", () => {
  it("should return certificate stats", async () => {
    const res = await request(app)
      .get("/api/v1/admin/certificates/stats")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.total).toBeGreaterThan(0);
    expect(res.body.data.stats.visible).toBeGreaterThan(0);
    expect(res.body.data.stats.issuers).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.stats.issuerList)).toBe(true);
  });
});

describe("Certificate Module — File Upload", () => {
  it("should reject image upload without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/image")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject pdf upload without auth", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/pdf")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("should upload an image file", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/image")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("image", Buffer.from("fake-image-content"), "test.png")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\/certificates\//);
    expect(res.body.data.filename).toBeTruthy();
  });

  it("should upload a PDF file", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/pdf")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("pdf", Buffer.from("%PDF-fake-content"), "test.pdf")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\/certificates\//);
    expect(res.body.data.filename).toBeTruthy();
  });

  it("should reject non-image file for image upload", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/image")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("image", Buffer.from("not-an-image"), "test.txt")
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("should reject non-PDF file for pdf upload", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates/upload/pdf")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("pdf", Buffer.from("not-a-pdf"), "test.txt")
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("Certificate Module — Admin Delete", () => {
  let editorToken = "";

  beforeAll(async () => {
    const editorRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Certificate Editor",
        email: "certificate-editor@tanvirul.dev",
        password: "EditorPass123!@",
        role: "EDITOR",
      });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "certificate-editor@tanvirul.dev", password: "EditorPass123!@" });

    const cookies = loginRes.headers["set-cookie"];
    const rawCookie = cookies.find((c) => c.startsWith("accessToken="));
    editorToken = rawCookie.split(";")[0].replace("accessToken=", "");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { email: "certificate-editor@tanvirul.dev" } });
  });

  it("should reject ADMIN from deleting certificates (only SUPER_ADMIN)", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/certificates/${certificateId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from deleting certificates", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/certificates/${certificateId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
  });

  it("should reject EDITOR from creating certificates", async () => {
    const res = await request(app)
      .post("/api/v1/admin/certificates")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({
        title: "Editor Cert",
        issuer: "Editor Issuer",
        issueDate: "2024-01-01T00:00:00.000Z",
      })
      .expect(403);

    expect(res.body.success).toBe(false);
  });
});
