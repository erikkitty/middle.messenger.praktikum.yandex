import { HttpClient } from './http';

interface MockXHR extends Partial<XMLHttpRequest> {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  ontimeout: (() => void) | null;
  status: number;
  responseText: string;
  withCredentials: boolean;
  timeout: number;
}

function createMockXHR(): MockXHR {
  return {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    onload: null,
    onerror: null,
    ontimeout: null,
    status: 200,
    responseText: '',
    withCredentials: false,
    timeout: 0,
  };
}

describe('HttpClient', () => {
  let client: HttpClient;
  let mockXHR: MockXHR;
  let OriginalXHR: typeof XMLHttpRequest;

  beforeEach(() => {
    OriginalXHR = global.XMLHttpRequest;
    mockXHR = createMockXHR();
    
    const MockXHRConstructor = jest.fn().mockImplementation(() => mockXHR);
    global.XMLHttpRequest = MockXHRConstructor as unknown as typeof XMLHttpRequest;
    
    client = new HttpClient();
  });

  afterEach(() => {
    global.XMLHttpRequest = OriginalXHR;
    jest.restoreAllMocks();
  });

  describe('Конструктор', () => {
    it('должен делать запрос на правильный URL', () => {
      const defaultClient = new HttpClient();
      defaultClient.get('/test');
      expect(mockXHR.open).toHaveBeenCalledWith(
        'GET',
        'https://ya-praktikum.tech/test'
      );
    });

    it('должен принимать кастомный endpoint', () => {
      const customClient = new HttpClient('https://example.com/api/');
      customClient.get('/users');
      expect(mockXHR.open).toHaveBeenCalledWith(
        'GET',
        'https://example.com/users'
      );
    });

    it('должен устанавливать withCredentials', () => {
      client.get('/test');
      expect(mockXHR.withCredentials).toBe(true);
    });
  });

  describe('HTTP методы', () => {
    it('GET должен делать запрос', async () => {
      mockXHR.responseText = JSON.stringify({ message: 'ok' });
      mockXHR.status = 200;

      const promise = client.get<Record<string, string>>('/users');
      mockXHR.onload?.();
      const result = await promise;
      
      expect(mockXHR.open).toHaveBeenCalledWith(
        'GET', 
        'https://ya-praktikum.tech/users'
      );
      expect(result).toEqual({ message: 'ok' });
    });

    it('POST должен отправлять JSON', async () => {
      const payload = { login: 'test' };
      mockXHR.responseText = JSON.stringify({ id: 123 });
      mockXHR.status = 200;

      const promise = client.post('/auth/signin', payload);
      mockXHR.onload?.();
      await promise;

      expect(mockXHR.open).toHaveBeenCalledWith(
        'POST', 
        'https://ya-praktikum.tech/auth/signin'
      );
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith(
        'Content-Type', 
        'application/json'
      );
      expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify(payload));
    });

    it('должен выбрасывать ошибку 404', async () => {
      mockXHR.responseText = JSON.stringify({ reason: 'Not found' });
      mockXHR.status = 404;

      const promise = client.get('/missing');
      mockXHR.onload?.();

      await expect(promise).rejects.toHaveProperty('status', 404);
    });
  });
});
