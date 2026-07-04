import api from "@/lib/api";
import { EDUCATION } from "@/constants/endpoints";
import type { Education, CreateEducationInput, UpdateEducationInput, EducationQueryParams } from "@/types/education";

interface P<T> { success: boolean; data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }; timestamp: string }
interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type ER = S<{ education: Education }>;

export async function getEducations(params: EducationQueryParams) {
  const { data } = await api.get<P<Education>>(EDUCATION, { params });
  return { educations: data.data, pagination: data.pagination };
}

export async function createEducation(input: CreateEducationInput) {
  const { data } = await api.post<ER>(EDUCATION, input);
  return data.data.education;
}

export async function updateEducation(id: string, input: UpdateEducationInput) {
  const { data } = await api.put<ER>(`${EDUCATION}/${id}`, input);
  return data.data.education;
}

export async function deleteEducation(id: string) {
  await api.delete(`${EDUCATION}/${id}`);
}
