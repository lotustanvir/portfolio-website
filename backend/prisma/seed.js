// ─────────────────────────────────────────────────
// Seed Script — Portfolio Backend v2
// ─────────────────────────────────────────────────
// Run: npx prisma db seed
//
// Idempotent — safe to run multiple times.
// Upserts by unique keys where possible.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────
// Helper: slugify
// ─────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────────────────────────────
// Technology Seed Data
// ─────────────────────────────────────────────────

const technologyData = [
  { name: "HTML", category: "Frontend", icon: null, color: "#E34F26" },
  { name: "CSS", category: "Frontend", icon: null, color: "#1572B6" },
  { name: "JavaScript", category: "Frontend", icon: null, color: "#F7DF1E" },
  { name: "React", category: "Frontend", icon: null, color: "#61DAFB" },
  { name: "Node.js", category: "Backend", icon: null, color: "#339933" },
  { name: "Express.js", category: "Backend", icon: null, color: "#000000" },
  { name: "PostgreSQL", category: "Database", icon: null, color: "#4169E1" },
  { name: "Prisma", category: "Database", icon: null, color: "#2D3748" },
  { name: "SQL", category: "Database", icon: null, color: "#4479A1" },
  { name: "Python", category: "Programming", icon: null, color: "#3776AB" },
  { name: "Firebase", category: "Backend", icon: null, color: "#FFCA28" },
  { name: "Supabase", category: "Backend", icon: null, color: "#3ECF8E" },
  { name: "Power BI", category: "Tools", icon: null, color: "#F2C811" },
  { name: "Business Analysis", category: "Domain", icon: null, color: "#6C5CE7" },
  { name: "Data Analytics", category: "Tools", icon: null, color: "#00CEC9" },
  { name: "Software Testing", category: "Tools", icon: null, color: "#E17055" },
  { name: "Quality Assurance", category: "Tools", icon: null, color: "#00B894" },
  { name: "Leadership", category: "Domain", icon: null, color: "#FD79A8" },
  { name: "Event Management", category: "Domain", icon: null, color: "#A29BFE" },
  { name: "Communication", category: "Domain", icon: null, color: "#55EFC4" },
].map((t) => ({ ...t, slug: slugify(t.name) }));

// ─────────────────────────────────────────────────
// Seed Data — Existing Tables
// ─────────────────────────────────────────────────

const projects = [
  {
    title: "Amar Food",
    slug: "amar-food",
    category: "Web Development",
    description:
      "A full-featured restaurant discovery and food ordering platform that connects users with local restaurants. Features include real-time menu browsing, cart management, order tracking, and a responsive design system.",
    image: "/images/projects/amar-food.png",
    liveDemo: "https://amar-food-website.vercel.app/",
    github: "https://github.com/tanvirul/amar-food",
    featured: true,
    status: "PUBLISHED",
    techNames: ["React", "Firebase", "Node.js", "Express.js", "PostgreSQL"],
  },
  {
    title: "Department of Genetic Engineering & Biotechnology",
    slug: "dept-of-geb",
    category: "Web Development",
    description:
      "An institutional website designed for the Department of Genetic Engineering & Biotechnology. Built with modern web technologies to showcase faculty, research, publications, and departmental activities.",
    image: "/images/projects/dept-geb.png",
    liveDemo: "https://dept-of-geb.vercel.app/",
    github: "https://github.com/tanvirul/dept-geb",
    featured: true,
    status: "PUBLISHED",
    techNames: ["React", "Node.js", "Express.js", "PostgreSQL"],
  },
];

const skills = [
  { name: "HTML", category: "Frontend", percentage: 95, icon: null, color: "#E34F26", displayOrder: 1, isVisible: true },
  { name: "CSS", category: "Frontend", percentage: 90, icon: null, color: "#1572B6", displayOrder: 2, isVisible: true },
  { name: "JavaScript", category: "Frontend", percentage: 90, icon: null, color: "#F7DF1E", displayOrder: 3, isVisible: true },
  { name: "React", category: "Frontend", percentage: 85, icon: null, color: "#61DAFB", displayOrder: 4, isVisible: true },
  { name: "Node.js", category: "Backend", percentage: 80, icon: null, color: "#339933", displayOrder: 5, isVisible: true },
  { name: "Express.js", category: "Backend", percentage: 80, icon: null, color: "#000000", displayOrder: 6, isVisible: true },
  { name: "PostgreSQL", category: "Database", percentage: 75, icon: null, color: "#4169E1", displayOrder: 7, isVisible: true },
  { name: "Prisma", category: "Database", percentage: 75, icon: null, color: "#2D3748", displayOrder: 8, isVisible: true },
  { name: "SQL", category: "Database", percentage: 80, icon: null, color: "#4479A1", displayOrder: 9, isVisible: true },
  { name: "Python", category: "Programming", percentage: 70, icon: null, color: "#3776AB", displayOrder: 10, isVisible: true },
  { name: "Firebase", category: "Backend", percentage: 75, icon: null, color: "#FFCA28", displayOrder: 11, isVisible: true },
  { name: "Supabase", category: "Backend", percentage: 70, icon: null, color: "#3ECF8E", displayOrder: 12, isVisible: true },
  { name: "Power BI", category: "Tools", percentage: 70, icon: null, color: "#F2C811", displayOrder: 13, isVisible: true },
  { name: "Business Analysis", category: "Business Analysis", percentage: 75, icon: null, color: "#6C5CE7", displayOrder: 14, isVisible: true },
].map((s) => ({ ...s, slug: slugify(s.name) }));

const experiences = [
  {
    company: "Skill Jobs",
    position: "Software Engineer (React)",
    employmentType: "INTERNSHIP",
    description:
      "Worked on developing and maintaining React-based web applications. Collaborated with the team to implement UI components and optimize application performance.",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-30"),
    isCurrent: false,
    location: "Dhaka, Bangladesh",
    techNames: ["React", "JavaScript", "CSS", "Node.js"],
  },
  {
    company: "Amar Securities Limited",
    position: "Management Trainee",
    employmentType: "INTERNSHIP",
    description:
      "Assisted in financial analysis, market research, and portfolio management. Gained hands-on experience in capital market operations and business analysis.",
    startDate: new Date("2023-07-01"),
    endDate: new Date("2023-12-31"),
    isCurrent: false,
    location: "Dhaka, Bangladesh",
    techNames: ["Business Analysis", "Data Analytics", "Power BI"],
  },
  {
    company: "SQAT Club",
    position: "Executive Member",
    employmentType: "PART_TIME",
    description:
      "Active member of the Software Quality Assurance and Testing Club. Participated in testing workshops, quality assurance initiatives, and software improvement projects.",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2024-01-01"),
    isCurrent: false,
    location: "Dhaka, Bangladesh",
    techNames: ["Software Testing", "Quality Assurance"],
  },
  {
    company: "DIU Students Association of Barishal",
    position: "General Secretary",
    employmentType: "PART_TIME",
    description:
      "Led student activities and coordinated events for the Barishal regional student association at Daffodil International University. Managed communications and organizational planning.",
    startDate: new Date("2023-01-01"),
    endDate: null,
    isCurrent: true,
    location: "Dhaka, Bangladesh",
    techNames: ["Leadership", "Event Management", "Communication"],
  },
];

const education = [
  {
    degree: "B.Sc. in Software Engineering",
    institution: "Daffodil International University",
     cgpa: "3.95",
    startYear: 2024,
    endYear: 2028,
    description:
      "Pursuing a Bachelor's degree in Software Engineering with a focus on full-stack development, data analytics, and software architecture.",
  },
];

const certificates = [
  {
    title: "Complete Web Development Bootcamp",
    issuer: "Udemy",
    issueDate: new Date("2023-06-15"),
    credentialLink: "https://udemy.com/certificate/example",
    image: null,
  },
  {
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    issueDate: new Date("2023-03-20"),
    credentialLink: "https://freecodecamp.org/certification/example",
    image: null,
  },
];

const testimonials = [
  {
    name: "John Doe",
    designation: "Project Manager",
    company: "Skill Jobs",
    image: null,
    review:
      "Tanvirul is a dedicated and skilled developer. His work on React-based projects was exceptional, and he consistently delivered high-quality results.",
    rating: 5,
  },
];

// ─────────────────────────────────────────────────
// Seed Data — New Tables
// ─────────────────────────────────────────────────

const blogs = [
  {
    title: "Building Scalable Web Applications with React and Node.js",
    slug: "building-scalable-web-apps-react-nodejs",
    excerpt:
      "A deep dive into architecture patterns for building production-ready applications using the MERN stack.",
    content:
      "When building modern web applications, choosing the right architecture is crucial for long-term maintainability and scalability. In this post, we explore best practices for structuring React frontends with Node.js backends, including folder organization, state management strategies, API design patterns, and deployment considerations.",
    thumbnail: "/images/blog/scalable-web-apps.png",
    category: "Technology",
    tags: ["React", "Node.js", "Architecture", "Best Practices"],
    isPublished: true,
    publishedAt: new Date("2024-06-15"),
    readingTime: 8,
  },
  {
    title: "My Journey from Business Analysis to Software Engineering",
    slug: "journey-business-analysis-to-software-engineering",
    excerpt:
      "How my background in business analysis shaped my approach to building software that solves real problems.",
    content:
      "Transitioning from business analysis to software engineering gave me a unique perspective on development. Understanding business requirements deeply allows me to build software that not only works but delivers real value. In this article, I share key lessons learned along the way and how both disciplines complement each other.",
    thumbnail: "/images/blog/career-journey.png",
    category: "Career",
    tags: ["Career", "Business Analysis", "Software Engineering"],
    isPublished: true,
    publishedAt: new Date("2024-04-10"),
    readingTime: 6,
  },
];

const subscribers = [
  {
    email: "visitor@example.com",
    isSubscribed: true,
    verificationToken: null,
    verifiedAt: new Date("2024-01-15"),
  },
];

const resumes = [
  {
    title: "Tanvirul Islam — Software Engineering Resume",
    fileUrl: "/resumes/tanvirul-islam-resume-v1.pdf",
    version: "1.0.0",
    isActive: true,
    downloadCount: 42,
    uploadedAt: new Date("2024-06-01"),
  },
  {
    title: "Tanvirul Islam — Software Engineering Resume (Legacy)",
    fileUrl: "/resumes/tanvirul-islam-resume-v0.pdf",
    version: "0.9.0",
    isActive: false,
    downloadCount: 15,
    uploadedAt: new Date("2024-01-01"),
  },
];

const socialLinks = [
  { platform: "GitHub", url: "https://github.com/tanvirul", icon: "github", displayOrder: 1, isVisible: true },
  { platform: "LinkedIn", url: "https://linkedin.com/in/tanvirul", icon: "linkedin", displayOrder: 2, isVisible: true },
  { platform: "Facebook", url: "https://facebook.com/tanvirul", icon: "facebook", displayOrder: 3, isVisible: true },
  { platform: "Instagram", url: "https://instagram.com/tanvirul", icon: "instagram", displayOrder: 4, isVisible: true },
  { platform: "Portfolio", url: "https://tanvirul.vercel.app", icon: "globe", displayOrder: 5, isVisible: true },
  { platform: "Email", url: "mailto:tanvirul242-35-056@diu.edu.bd", icon: "mail", displayOrder: 6, isVisible: true },
];

const websiteSetting = {
  siteTitle: "Tanvirul Islam — Portfolio",
  siteDescription:
    "Full Stack Developer & Business Analyst. I build modern web applications and data-driven solutions.",
  heroTitle: "Hi, I'm Tanvirul Islam",
  heroSubtitle:
    "Full Stack Developer | Business Analyst | Problem Solver",
  heroImage: "/images/hero-bg.jpg",
  email: "tanvirul242-35-056@diu.edu.bd",
  phone: "+8801330699619",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/tanvirul",
  linkedin: "https://linkedin.com/in/tanvirul",
  facebook: "https://facebook.com/tanvirul",
  instagram: "https://instagram.com/tanvirul",
  resumeUrl: "/resumes/tanvirul-islam-resume-v1.pdf",
  themeColor: "#0f172a",
  logo: "/images/logo.png",
  favicon: "/images/favicon.ico",
};

// ─────────────────────────────────────────────────
// Seed Runner
// ─────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // ── Admin ──────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@12345!", 12);
  await prisma.admin.upsert({
    where: { email: "admin@tanvirul.dev" },
    update: {},
    create: {
      name: "Tanvirul Islam",
      email: "admin@tanvirul.dev",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("  ✓ 1 admin (admin@tanvirul.dev / Admin@12345!)");

  // ── Technologies ──────────────────────────────
  const techMap = new Map();
  for (const tech of technologyData) {
    const record = await prisma.technology.upsert({
      where: { name: tech.name },
      update: tech,
      create: tech,
    });
    techMap.set(record.name, record.id);
  }
  console.log(`  ✓ ${technologyData.length} technologies`);

  // ── Projects + Project Technologies ───────────
  for (const project of projects) {
    const { techNames, ...projectData } = project;
    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: projectData,
      create: projectData,
    });
    // Link technologies
    await prisma.projectTechnology.deleteMany({ where: { projectId: record.id } });
    for (const name of techNames) {
      const techId = techMap.get(name);
      if (techId) {
        await prisma.projectTechnology.create({
          data: { projectId: record.id, technologyId: techId },
        });
      }
    }
  }
  console.log(`  ✓ ${projects.length} projects with normalized technologies`);

  // ── Skills ────────────────────────────────────
  await prisma.skill.deleteMany();
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`  ✓ ${skills.length} skills`);

  // ── Experiences + Experience Technologies ─────
  await prisma.experience.deleteMany();
  for (const exp of experiences) {
    const { techNames, ...expData } = exp;
    const record = await prisma.experience.create({ data: expData });
    for (const name of techNames) {
      const techId = techMap.get(name);
      if (techId) {
        await prisma.experienceTechnology.create({
          data: { experienceId: record.id, technologyId: techId },
        });
      }
    }
  }
  console.log(`  ✓ ${experiences.length} experiences with normalized technologies`);

  // ── Education ─────────────────────────────────
  await prisma.education.deleteMany();
  for (const edu of education) {
    await prisma.education.create({ data: edu });
  }
  console.log(`  ✓ ${education.length} education records`);

  // ── Certificates ──────────────────────────────
  await prisma.certificate.deleteMany();
  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log(`  ✓ ${certificates.length} certificates`);

  // ── Testimonials ──────────────────────────────
  await prisma.testimonial.deleteMany();
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`  ✓ ${testimonials.length} testimonials`);

  // ── Blogs ─────────────────────────────────────
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log(`  ✓ ${blogs.length} blog posts`);

  // ── Subscribers ───────────────────────────────
  for (const sub of subscribers) {
    await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: sub,
      create: sub,
    });
  }
  console.log(`  ✓ ${subscribers.length} subscribers`);

  // ── Resumes ───────────────────────────────────
  // Ensure only one active resume
  await prisma.resume.deleteMany();
  for (const resume of resumes) {
    await prisma.resume.create({ data: resume });
  }
  console.log(`  ✓ ${resumes.length} resumes`);

  // ── Social Links ──────────────────────────────
  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { platform: link.platform },
      update: link,
      create: link,
    });
  }
  console.log(`  ✓ ${socialLinks.length} social links`);

  // ── Website Settings (single row) ─────────────
  const existingSettings = await prisma.websiteSetting.findFirst();
  if (existingSettings) {
    await prisma.websiteSetting.update({
      where: { id: existingSettings.id },
      data: websiteSetting,
    });
  } else {
    await prisma.websiteSetting.create({ data: websiteSetting });
  }
  console.log("  ✓ 1 website settings");

  console.log("\n✔ Database seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
