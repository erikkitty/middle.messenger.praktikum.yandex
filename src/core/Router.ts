type RouteHandler = () => void;

interface IRoute {
  path: string;
  handler: RouteHandler;
}

export class Router {
  private routes: IRoute[] = [];

  constructor() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  public addRoute(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler });
  }

  public navigate(path: string): void {
    window.location.hash = path;
  }

  private handleRoute(): void {
    const hash = window.location.hash.slice(1) || '/';

    let route = this.routes.find(r => r.path === hash);

    if (!route) {
      const wildcardRoute = this.routes.find(r => r.path === '*');
      if (wildcardRoute) {
        route = wildcardRoute;
      }
    }

    if (!route) {
      route = this.routes.find(r => {
        if (r.path === '*' || r.path === hash) return false;
        const regex = new RegExp(`^${r.path.replace(/:\w+/g, '\\w+')}$`);
        return regex.test(hash);
      });
    }

    if (route) {
      this.clearApp();
      route.handler();
    }
  }

  private clearApp(): void {
    const app = document.getElementById('app');
    if (app) {
      app.textContent = '';
    }
  }

  public start(): void {
    this.handleRoute();
  }
}

export const router = new Router();
