export interface Resume {
  id: string;
  title: string;
  version: string;
  fileUrl: string;
  isActive: boolean;
  downloadCount: number;
  uploadedAt: string;
  updatedAt: string;
}

export interface CreateResumeInput {
  title: string;
  version: string;
  fileUrl: string;
  isActive?: boolean;
}

export interface UpdateResumeInput extends Partial<CreateResumeInput> {}

export interface ResumeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
