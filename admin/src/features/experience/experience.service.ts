import api from "@/lib/api";
import { EXPERIENCE } from "@/constants/endpoints";
import type {
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
  ExperienceQueryParams,
} from "@/types/experience";

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

type ExperienceSingleResponse = SingleResponse<{ experience: Experience }>;

export async function getExperiences(params: ExperienceQueryParams) {
  const { data } = await api.get<PaginatedResponse<Experience>>(EXPERIENCE, { params });
  return { experiences: data.data, pagination: data.pagination };
}

export async function getExperience(id: string) {
  const { data } = await api.get<ExperienceSingleResponse>(`${EXPERIENCE}/${id}`);
  return data.data.experience;
}

export async function createExperience(input: CreateExperienceInput) {
  const { data } = await api.post<ExperienceSingleResponse>(EXPERIENCE, input);
  return data.data.experience;
}

export async function updateExperience(id: string, input: UpdateExperienceInput) {
  const { data } = await api.put<ExperienceSingleResponse>(`${EXPERIENCE}/${id}`, input);
  return data.data.experience;
}

export async function deleteExperience(id: string) {
  await api.delete(`${EXPERIENCE}/${id}`);
}
