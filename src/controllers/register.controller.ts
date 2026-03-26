import { registerModel } from "../models/register.model";
import { RegisterForm } from "../pages/register-form/register-form";
import type { IRegisterRequest } from "../types/domains";

export class RegisterController {
  private view: RegisterForm | null = null;

  private ensureView(): RegisterForm {
    if (!this.view) {
      this.view = new RegisterForm({
        onSubmit: (data) => this.handleRegister(data),
        onLogin: () => {
          window.location.hash = "/";
        },
      });
    }
    return this.view;
  }

  private async handleRegister(data: IRegisterRequest): Promise<void> {
    try {
      await registerModel.register(data);
      window.location.hash = "/chat";
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Заполните поле",
      });
    }
  }

  public getView(): RegisterForm {
    this.view = null;
    return this.ensureView();
  }
}

export const registerController = new RegisterController();

