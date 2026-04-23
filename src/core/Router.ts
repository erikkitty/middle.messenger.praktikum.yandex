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
    window.addEventListener('popstate', () => this.handleRoute());

    document.addEventListener("click", (e) => {
      const event = e as MouseEvent;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      this.navigate(url.pathname + url.search);
    });
  }

  public addRoute(path: string, handler: RouteHandler, requiresAuth: boolean = false): void {
    this.routes.push({ path, handler, requiresAuth });
  }

  public setAuthRoutes(routes: string[]): void {
    this.authRoutes = routes;
  }

  public navigate(path: string): void {
    window.history.pushState(null, "", path);
    this.handleRoute();
  }

  public replace(path: string): void {
    window.history.replaceState(null, "", path);
    this.handleRoute();
  }

  private handleRoute(): void {
    const path = window.location.pathname || "/";

    let route = this.routes.find(r => r.path === path);

    if (!route) {
      const wildcardRoute = this.routes.find(r => r.path === '*');
      if (wildcardRoute) {
        route = wildcardRoute;
      }
    }

    if (!route) {
      route = this.routes.find(r => {
        if (r.path === '*' || r.path === path) return false;
        const regex = new RegExp(`^${r.path.replace(/:\w+/g, '\\w+')}$`);
        return regex.test(path);
      });
    }

    if (route) {
      if (route.requiresAuth && !isAuthenticated()) {
        this.replace('/');
        return;
      }

      if (this.authRoutes.includes(path) && isAuthenticated()) {
        this.replace('/messenger');
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
    if (window.location.hash.startsWith("#/")) {
      const legacy = window.location.hash.slice(1);
      window.history.replaceState(null, "", legacy);
    }
    this.handleRoute();
  }
}

export const router = new Router();
