import api from "@/lib/api";
import { SKILLS } from "@/constants/endpoints";
import type {
  Skill,
  CreateSkillInput,
  UpdateSkillInput,
  SkillQueryParams,
} from "@/types/skill";

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
  timestamp: string;
}

interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

type SkillSingleResponse = SingleResponse<{ skill: Skill }>;

export async function getSkills(params: SkillQueryParams) {
  const { data } = await api.get<PaginatedResponse<Skill>>(SKILLS, { params });
  return { skills: data.data, pagination: data.pagination };
}

export async function getSkill(id: string) {
  const { data } = await api.get<SkillSingleResponse>(`${SKILLS}/${id}`);
  return data.data.skill;
}

export async function createSkill(input: CreateSkillInput) {
  const { data } = await api.post<SkillSingleResponse>(SKILLS, input);
  return data.data.skill;
}

export async function updateSkill(id: string, input: UpdateSkillInput) {
  const { data } = await api.put<SkillSingleResponse>(`${SKILLS}/${id}`, input);
  return data.data.skill;
}

export async function deleteSkill(id: string) {
  await api.delete(`${SKILLS}/${id}`);
}
