export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProjectTechnology {
  id: string;
  technologyId: string;
  technology: {
    id: string;
    name: string;
    category: string;
    icon: string | null;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  liveDemo: string | null;
  github: string | null;
  featured: boolean;
  status: ProjectStatus;
  technologies: ProjectTechnology[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: string;
  image?: string;
  liveDemo?: string;
  github?: string;
  featured?: boolean;
  status?: ProjectStatus;
  technologyIds?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  sort?: "createdAt" | "updatedAt" | "title";
  order?: "asc" | "desc";
  search?: string;
  status?: ProjectStatus;
  featured?: string;
  category?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type ProjectSingleResponse = SingleResponse<{ project: Project }>;
