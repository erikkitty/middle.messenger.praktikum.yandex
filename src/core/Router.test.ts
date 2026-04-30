import { Router } from './Router';
import * as authModel from '../models/auth.model';

jest.mock('../models/auth.model', () => ({
  isAuthenticated: jest.fn(),
}));

const mockedIsAuthenticated = authModel.isAuthenticated as jest.MockedFunction<typeof authModel.isAuthenticated>;

describe('Router', () => {
  let router: Router;
  let appElement: HTMLElement;
  let mockHandler: jest.Mock;

  beforeEach(() => {

    document.body.innerHTML = '<div id="app"></div>';
    appElement = document.getElementById('app')!;

    router = new Router();
    router.clearRoutes();
    router.setAuthRoutes(['/', '/sign-up']);

    mockHandler = jest.fn();

    mockedIsAuthenticated.mockReturnValue(false);

    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен менять URL и вызывать обработчик при navigate', () => {
    router.addRoute('/messenger', mockHandler);
    router.navigate('/messenger');

    expect(window.location.pathname).toBe('/messenger');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('должен очищать #app перед рендером новой страницы', () => {
    appElement.textContent = 'старый контент';
    router.addRoute('/test', mockHandler);
    router.navigate('/test');

    expect(appElement.textContent).toBe('');
  });

  it('должен перенаправлять неавторизованного на / при requiresAuth', () => {
    mockedIsAuthenticated.mockReturnValue(false);
    router.addRoute('/settings', mockHandler, true);
    router.navigate('/settings');

    expect(mockHandler).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });

  it('должен пускать авторизованного на защищённый маршрут', () => {
    mockedIsAuthenticated.mockReturnValue(true);
    router.addRoute('/settings', mockHandler, true);
    router.navigate('/settings');

    expect(mockHandler).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/settings');
  });

  it('должен перенаправлять авторизованного с / на /messenger', () => {
    mockedIsAuthenticated.mockReturnValue(true);
    router.addRoute('/', mockHandler);
    router.navigate('/');

    expect(mockHandler).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/messenger');
  });

  it('должен обрабатывать wildcard (*) маршрут', () => {
    router.addRoute('*', mockHandler);
    router.navigate('/unknown-page');

    expect(mockHandler).toHaveBeenCalled();
  });

  it('должен убирать legacy hash при start()', () => {
    window.history.replaceState(null, '', '/#/old-hash');
    router.start();
    expect(window.location.pathname).toBe('/old-hash');
  });
});
