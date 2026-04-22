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
      const user = await signIn(data);
      saveUser(user);
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        const reason =
          error.data && typeof error.data === "object" && "reason" in error.data
            ? String((error.data as { reason: string }).reason)
            : "";

        if (error.status === 400 && reason === "User already in system") {
          const currentUser = await this.getCurrentUser();
          if (currentUser) {
            return currentUser;
          }
          throw new Error("Пользователь уже авторизован", { cause: error });
        }

        if (error.status === 401) {
          throw new Error('Неверный логин или пароль', { cause: error });
        }
        if (reason) {
          throw new Error(reason, { cause: error });
        }
      }
      throw new Error('Ошибка входа в систему', { cause: error });
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

