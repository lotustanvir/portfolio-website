import api from "@/lib/api";
import { AUTH } from "@/constants/endpoints";
import type { LoginInput, RegisterInput, Admin, AuthResponse } from "@/types/auth";

export async function login(input: LoginInput): Promise<Admin> {
  const { data } = await api.post<AuthResponse>(AUTH.LOGIN, input);
  return data.data.admin;
}

export async function register(input: RegisterInput): Promise<Admin> {
  const { data } = await api.post<AuthResponse>(AUTH.REGISTER, input);
  return data.data.admin;
}

export async function logout(): Promise<void> {
  await api.post(AUTH.LOGOUT);
}

export async function logoutAllDevices(): Promise<void> {
  await api.post(AUTH.LOGOUT_ALL);
}

export async function refreshTokens(): Promise<void> {
  await api.post(AUTH.REFRESH);
}

export async function getMe(): Promise<Admin | null> {
  try {
    const { data } = await api.get<AuthResponse>(AUTH.ME);
    return data.data.admin;
  } catch {
    return null;
  }
}
