import { Error500 } from "../pages/error-500/error-500";

export class Error500Controller {
  private view: Error500 | null = null;

  private ensureView(): Error500 {
    if (!this.view) {
      this.view = new Error500({
        onRefresh: () => this.handleRefresh(),
      });
    }
    return this.view;
  }

  private handleRefresh(): void {
    window.location.reload();
  }

  public getView(): Error500 {
    return this.ensureView();
  }
}

export const error500Controller = new Error500Controller();
