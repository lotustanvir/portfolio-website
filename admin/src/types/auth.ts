export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "EDITOR";
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    admin: Admin;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    errors?: Record<string, string[]>;
  };
  timestamp: string;
}
