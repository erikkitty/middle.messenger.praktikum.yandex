import type { ILoginRequest, IUser } from "../types/domains";
import { signIn, signOut, getUser } from "../api/auth.api";
import { ApiError } from "../utils/http";

const LS_USER_KEY = "app.user";

function saveUser(user: IUser): void {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

function removeUser(): void {
  localStorage.removeItem(LS_USER_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(LS_USER_KEY) !== null;
}

export class AuthModel {
  public async login(data: ILoginRequest): Promise<IUser> {
    try {
      const response = await signIn(data);
      saveUser(response.user);
      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 400) {
          throw new Error('Неверный логин или пароль');
        }
        if (error.data && typeof error.data === 'object' && 'reason' in error.data) {
          throw new Error((error.data as { reason: string }).reason);
        }
      }
      throw new Error('Ошибка входа в систему');
    }
  }

  public async logout(): Promise<void> {
    try {
      await signOut();
    } finally {
      removeUser();
    }
  }

  public async getCurrentUser(): Promise<IUser | null> {
    try {
      const user = await getUser();
      saveUser(user);
      return user;
    } catch {
      const stored = localStorage.getItem(LS_USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as IUser;
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}

export const authModel = new AuthModel();

