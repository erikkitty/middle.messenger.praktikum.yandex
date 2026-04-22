import { isAuthenticated } from '../models/auth.model';

type RouteHandler = () => void;

interface IRoute {
  path: string;
  handler: RouteHandler;
  requiresAuth?: boolean;
}

export class Router {
  private routes: IRoute[] = [];
  private authRoutes: string[] = ['/', '/sign-up'];

  constructor() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  public addRoute(path: string, handler: RouteHandler, requiresAuth: boolean = false): void {
    this.routes.push({ path, handler, requiresAuth });
  }

  public setAuthRoutes(routes: string[]): void {
    this.authRoutes = routes;
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
      if (route.requiresAuth && !isAuthenticated()) {
        window.location.hash = '/';
        return;
      }

      if (this.authRoutes.includes(hash) && isAuthenticated()) {
        window.location.hash = '/messenger';
        return;
      }

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
