export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE" | "FREELANCE";

export interface ExperienceTechnology {
  id: string;
  technologyId: string;
  technology: {
    id: string;
    name: string;
    category: string;
    icon: string | null;
  };
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
  isVisible: boolean;
  technologies: ExperienceTechnology[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceInput {
  company: string;
  position: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities?: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  technologyIds?: string[];
}

export interface UpdateExperienceInput extends Partial<CreateExperienceInput> {}

export interface ExperienceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  employmentType?: EmploymentType;
  isCurrent?: string;
}
