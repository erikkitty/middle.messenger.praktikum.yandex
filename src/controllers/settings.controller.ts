import { settingsModel } from "../models/settings.model";
import { SettingsPage } from "../pages/settings-page/settings-page";
import type {
  IChangePasswordRequest,
  IUpdateProfileRequest,
} from "../types/domains";

export class SettingsController {
  private view: SettingsPage | null = null;

  public async init(): Promise<void> {
    this.view = null;
    
    const user = await settingsModel.getUser();
    this.view = new SettingsPage({
      ...user,
      onBack: () => {
        window.location.hash = "/messenger";
      },
      onLogout: () => {
        window.location.hash = "/";
      },
    });
  }

  public async updateProfile(data: IUpdateProfileRequest): Promise<void> {
    const user = await settingsModel.updateProfile(data);
    this.view?.setProps({
      first_name: user.first_name,
      second_name: user.second_name,
      display_name: user.display_name,
      login: user.login,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  }

  public async changePassword(data: IChangePasswordRequest): Promise<void> {
    await settingsModel.changePassword(data);
  }

  public getView(): SettingsPage {
    if (!this.view) {
      throw new Error("SettingsController not initialized");
    }
    return this.view;
  }
}

export const settingsController = new SettingsController();

