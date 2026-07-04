export interface CertificateSkill {
  id: string;
  technologyId: string;
  technology: {
    id: string;
    name: string;
    category: string;
    icon: string | null;
  };
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  issueDate: string;
  expiryDate: string | null;
  credentialLink: string | null;
  image: string | null;
  pdfUrl: string | null;
  displayOrder: number;
  isVisible: boolean;
  skills: CertificateSkill[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateInput {
  title: string;
  issuer: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  credentialLink?: string;
  image?: string;
  pdfUrl?: string;
  displayOrder?: number;
  isVisible?: boolean;
  skillIds?: string[];
}

export interface UpdateCertificateInput extends Partial<CreateCertificateInput> {}

export interface CertificateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  issuer?: string;
}
