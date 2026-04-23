import { authModel } from '../models/auth.model';
import { AuthForm } from '../pages/auth-form/auth-form';
import { ILoginRequest } from '../types/domains';
import { router } from "../core/Router";

export class AuthController {
  private view: AuthForm | null = null;

  private ensureView(): AuthForm {
    if (!this.view) {
      this.view = new AuthForm({
        onSubmit: (data) => this.handleLogin(data),
        onRegister: () => this.handleRegister(),
      });
    }
    return this.view;
  }

  private async handleLogin(data: ILoginRequest): Promise<void> {
    try {
      await authModel.login(data);
      router.navigate('/messenger');
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка входа'
      });
    }
  }

  private handleRegister(): void {
    router.navigate('/sign-up');
  }

  public getView(): AuthForm {
    this.view = null;
    return this.ensureView();
  }
}

export const authController = new AuthController();
