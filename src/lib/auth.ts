import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function setAuthToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: 'strict' });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
}

export function setAuthUser(user: User) {
  Cookies.set(USER_KEY, JSON.stringify(user), { secure: true, sameSite: 'strict' });
}

export function getAuthUser(): User | null {
  const userStr = Cookies.get(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role === 'SUPER_ADMIN';
}