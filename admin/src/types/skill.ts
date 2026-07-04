export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  percentage: number;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  percentage: number;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateSkillInput extends Partial<CreateSkillInput> {}

export interface SkillQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
