// ============================================================
// ALEXION OS — Auth & User Types
// ============================================================

export interface AlexionUser {
  id: string;
  username: string;
  displayName: string;
  alexionEmail: string; // username@alexion.com
  country: string;
  avatarUrl: string | null;
  storageUsed: number;
  storageLimit: number;
  status: "active" | "suspended" | "deleted";
  theme: "dark" | "light";
  wallpaper: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterFormValues {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  country: string;
  avatar?: FileList;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface AuthState {
  user: AlexionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
