export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Design",
];

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Programming",
  "Cloud",
  "DevOps",
  "AI",
  "Machine Learning",
  "Data Analytics",
  "Business Analysis",
  "UI/UX",
  "Testing",
  "Tools",
  "Soft Skills",
  "Languages",
  "Other",
];

export const SOCIAL_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "Facebook",
  "Instagram",
  "Twitter",
  "YouTube",
  "Dribbble",
  "Behance",
  "Portfolio",
  "Email",
];

export const BLOG_CATEGORIES = [
  "Technology",
  "Career",
  "Tutorial",
  "Project",
  "Life",
];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const ORDER_DIRECTIONS = ["asc", "desc"];

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  EDITOR: 2,
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "projects:read", "projects:write", "projects:delete",
    "skills:read", "skills:write", "skills:delete",
    "experience:read", "experience:write", "experience:delete",
    "education:read", "education:write", "education:delete",
    "certificates:read", "certificates:write", "certificates:delete",
    "messages:read", "messages:write",
    "testimonials:read", "testimonials:write", "testimonials:delete",
    "blog:read", "blog:write", "blog:delete",
    "resume:read", "resume:write", "resume:delete",
    "social:read", "social:write", "social:delete",
    "settings:read", "settings:write",
    "subscribers:read",
    "visitors:read",
  ],
  EDITOR: [
    "blog:read", "blog:write",
    "projects:read",
    "skills:read",
  ],
};
