export interface UserDetails {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  password: string;
  isEmailVerified: boolean;
}
export interface UserDataPayload {
  email: string;
  name: string;
  userId: number;
}

export interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface Category {
  id: string;
  name: string;
}
