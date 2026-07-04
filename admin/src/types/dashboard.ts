export interface DashboardTotals {
  projects: number;
  skills: number;
  experience: number;
  education: number;
  certificates: number;
  unreadMessages: number;
  resumeDownloads: number;
}

export interface LatestProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  createdAt: string;
}

export interface LatestMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export interface LatestCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  isVisible: boolean;
  createdAt: string;
}

export interface ProjectStatistics {
  total: number;
  byStatus: Record<string, number>;
}

export interface SkillCategoryStats {
  count: number;
  averagePercentage: number;
}

export interface SkillStatistics {
  total: number;
  categories: Record<string, SkillCategoryStats>;
}

export interface DashboardData {
  totals: DashboardTotals;
  latestProjects: LatestProject[];
  latestMessages: LatestMessage[];
  latestCertificates: LatestCertificate[];
  projectStatistics: ProjectStatistics;
  skillStatistics: SkillStatistics;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  timestamp: string;
}
