import prisma from "../config/database.js";

export async function getDashboard() {
  const [
    projectCount,
    skillCount,
    experienceCount,
    educationCount,
    certificateCount,
    unreadMessages,
    totalDownloads,
    latestProjects,
    latestMessages,
    latestCertificates,
    projectStats,
    skillStats,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.certificate.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.resume.aggregate({ _sum: { downloadCount: true } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        featured: true,
        createdAt: true,
      },
    }),
    prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
    }),
    prisma.certificate.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        issuer: true,
        issueDate: true,
        isVisible: true,
        createdAt: true,
      },
    }),
    prisma.project.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.skill.groupBy({
      by: ["category"],
      _count: { id: true },
      _avg: { percentage: true },
    }),
  ]);

  const categoryCounts = {};
  for (const row of skillStats) {
    categoryCounts[row.category] = {
      count: row._count.id,
      averagePercentage: Math.round((row._avg.percentage || 0) * 100) / 100,
    };
  }

  return {
    totals: {
      projects: projectCount,
      skills: skillCount,
      experience: experienceCount,
      education: educationCount,
      certificates: certificateCount,
      unreadMessages,
      resumeDownloads: totalDownloads._sum.downloadCount ?? 0,
    },
    latestProjects,
    latestMessages,
    latestCertificates,
    projectStatistics: {
      total: projectCount,
      byStatus: projectStats.reduce((acc, row) => {
        acc[row.status.toLowerCase()] = row._count.id;
        return acc;
      }, {}),
    },
    skillStatistics: {
      total: skillCount,
      categories: categoryCounts,
    },
  };
}
