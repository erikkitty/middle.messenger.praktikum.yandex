import type {
  IChangePasswordRequest,
  IUpdateProfileRequest,
  IUser,
} from "../types/domains";
import { updateProfile as updateProfileApi, changePassword as changePasswordApi, uploadAvatar } from "../api/user.api";
import { authModel } from "./auth.model";

const LS_USER_KEY = "app.user";

function writeUser(user: IUser): void {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

export class SettingsModel {
  public async getUser(): Promise<IUser> {
    const user = await authModel.getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }
    return user;
  }

  public async updateProfile(data: IUpdateProfileRequest): Promise<IUser> {
    const user = await updateProfileApi(data);
    writeUser(user);
    return user;
  }

  public async changePassword(data: IChangePasswordRequest): Promise<void> {
    await changePasswordApi(data);
  }

  public async uploadAvatar(file: File): Promise<IUser> {
    const user = await uploadAvatar(file);
    writeUser(user);
    return user;
  }
}

export const settingsModel = new SettingsModel();

