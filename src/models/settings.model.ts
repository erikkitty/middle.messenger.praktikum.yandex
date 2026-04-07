import type {
  IChangePasswordRequest,
  IUpdateProfileRequest,
  IUser,
} from "../types/domains";
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

function writeUser(user: IUser): void {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

export class SettingsModel {
  public async getUser(): Promise<IUser> {
    await delay(150);
    const existing = readUser();
    if (existing) return existing;
    const seeded: IUser = {
      id: mockUser.id,
      first_name: mockUser.first_name,
      second_name: mockUser.second_name,
      display_name: mockUser.display_name,
      login: mockUser.login,
      email: mockUser.email,
      phone: mockUser.phone,
      avatar: mockUser.avatar,
    };
    writeUser(seeded);
    return seeded;
  }

  public async updateProfile(data: IUpdateProfileRequest): Promise<IUser> {
    await delay(200);
    const user = readUser();
    if (!user) throw new Error("Пользователь не найден");

    const next: IUser = {
      ...user,
      ...data,
      display_name:
        data.display_name ?? `${data.first_name} ${data.second_name}`,
    };
    writeUser(next);
    Object.assign(mockUser, next);
    return next;
  }

  public async changePassword(data: IChangePasswordRequest): Promise<void> {
    await delay(200);
    const current = localStorage.getItem(LS_PASSWORD_KEY) ?? "";
    if (current && current !== data.oldPassword) {
      throw new Error("Старый пароль неверный");
    }
    localStorage.setItem(LS_PASSWORD_KEY, data.newPassword);
  }
}

export const settingsModel = new SettingsModel();

