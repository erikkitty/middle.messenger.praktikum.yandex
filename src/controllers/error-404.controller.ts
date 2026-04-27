import { Error404 } from "../pages/error-404/error-404";
import { isAuthenticated } from "../models/auth.model";
import { router } from "../core/Router";

export class Error404Controller {
  private view: Error404 | null = null;

  private ensureView(): Error404 {
    if (!this.view) {
      this.view = new Error404({
        onBack: () => this.handleBack(),
      });
    }
    return this.view;
  }

  private handleBack(): void {
    router.navigate(isAuthenticated() ? "/messenger" : "/");
  }

  public getView(): Error404 {
    return this.ensureView();
  }
}

export const error404Controller = new Error404Controller();
