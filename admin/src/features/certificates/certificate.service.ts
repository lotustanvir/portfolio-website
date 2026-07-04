import api from "@/lib/api";
import { CERTIFICATES } from "@/constants/endpoints";
import type { Certificate, CreateCertificateInput, UpdateCertificateInput, CertificateQueryParams } from "@/types/certificate";

interface P<T> { success: boolean; data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }; timestamp: string }
interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type CR = S<{ certificate: Certificate }>;

export async function getCertificates(params: CertificateQueryParams) {
  const { data } = await api.get<P<Certificate>>(CERTIFICATES, { params });
  return { certificates: data.data, pagination: data.pagination };
}

export async function createCertificate(input: CreateCertificateInput) {
  const { data } = await api.post<CR>(CERTIFICATES, input);
  return data.data.certificate;
}

export async function updateCertificate(id: string, input: UpdateCertificateInput) {
  const { data } = await api.put<CR>(`${CERTIFICATES}/${id}`, input);
  return data.data.certificate;
}

export async function deleteCertificate(id: string) {
  await api.delete(`${CERTIFICATES}/${id}`);
}
