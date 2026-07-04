export const sampleProject = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Test Project",
  slug: "test-project",
  category: "Web Development",
  description: "A test project for development",
  image: null,
  liveDemo: null,
  github: null,
  featured: false,
  status: "PUBLISHED",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const sampleSkill = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "JavaScript",
  category: "Frontend",
  percentage: 90,
  icon: null,
  displayOrder: 1,
};

export const sampleExperience = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  company: "Test Corp",
  position: "Developer",
  employmentType: "FULL_TIME",
  description: "A test experience",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  isCurrent: false,
  location: "Remote",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const paginatedResult = (items, total, page, limit) => ({
  data: items,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  },
});
