import api from "@/lib/api";
import { PROJECTS } from "@/constants/endpoints";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryParams,
  PaginatedResponse,
  ProjectSingleResponse,
} from "@/types/project";

export async function getProjects(params: ProjectQueryParams) {
  const { data } = await api.get<PaginatedResponse<Project>>(PROJECTS, { params });
  return { projects: data.data, pagination: data.pagination };
}

export async function getProject(id: string) {
  const { data } = await api.get<ProjectSingleResponse>(`${PROJECTS}/${id}`);
  return data.data.project;
}

export async function createProject(input: CreateProjectInput) {
  const { data } = await api.post<ProjectSingleResponse>(PROJECTS, input);
  return data.data.project;
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const { data } = await api.put<ProjectSingleResponse>(`${PROJECTS}/${id}`, input);
  return data.data.project;
}

export async function deleteProject(id: string) {
  await api.delete(`${PROJECTS}/${id}`);
}
