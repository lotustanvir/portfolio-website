export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string | null;
  cgpa: string | null;
  startYear: number;
  endYear: number | null;
  isCurrent: boolean;
  description: string | null;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationInput {
  institution: string;
  degree: string;
  department?: string;
  cgpa?: string;
  startYear: number;
  endYear?: number;
  isCurrent?: boolean;
  description?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateEducationInput extends Partial<CreateEducationInput> {}

export interface EducationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  institution?: string;
  degree?: string;
}
