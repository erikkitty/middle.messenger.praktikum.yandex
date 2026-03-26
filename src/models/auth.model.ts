import type { ILoginRequest, IUser } from "../types/domains";
import { mockUser } from "../pages/settings-page/mock-user";

const LS_USER_KEY = "app.user";
const LS_PASSWORD_KEY = "app.password";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUser(): IUser | null {
  const raw = localStorage.getItem(LS_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IUser;
  } catch {
    return null;
  }
}

export class AuthModel {
  public async login(data: ILoginRequest): Promise<IUser> {
    await delay(200);
    const user = readUser();
    const password = localStorage.getItem(LS_PASSWORD_KEY) ?? "";

    if (!user && data.login === mockUser.login && data.password === "12345678A") {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LS_PASSWORD_KEY, "12345678A");
      return mockUser;
    }

    if (!user) throw new Error("Такого пользователя не существует");
    if (user.login !== data.login || password !== data.password) {
      throw new Error("Такого пользователя не существует");
    }

    return user;
  }
}

export const authModel = new AuthModel();

