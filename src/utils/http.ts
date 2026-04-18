type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface IRequestOptions {
  method?: HttpMethod;
  data?: unknown;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  timeout?: number;
}



export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  public get<T>(path: string, queryParams?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>({ method: 'GET', path, queryParams });
  }

  public post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, data });
  }

  public put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, data });
  }

  public delete<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, data });
  }

  public patch<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, data });
  }

  private buildUrl(path: string, queryParams?: Record<string, string | number | boolean>): string {
    const url = new URL(path, this.baseUrl);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private request<T>(options: IRequestOptions & { path: string }): Promise<T> {
    const { method = 'GET', path, data, headers = {}, queryParams, timeout = this.timeout } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = this.buildUrl(path, queryParams);

      xhr.open(method, url);
      xhr.timeout = timeout;

      // Устанавливаем заголовки по умолчанию
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');

      // Добавляем пользовательские заголовки
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        const status = xhr.status;

        if (status >= 200 && status < 300) {
          try {
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            resolve(responseData as T);
          } catch (e) {
            resolve(null as T);
          }
        } else {
          let errorMessage = `HTTP Error: ${status}`;
          let errorData: unknown;

          try {
            errorData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            if (errorData && typeof errorData === 'object' && 'reason' in errorData) {
              errorMessage = (errorData as { reason: string }).reason;
            }
          } catch {
            errorMessage = xhr.responseText || errorMessage;
          }

          reject(new ApiError(status, errorMessage, errorData));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError(0, 'Network error. Check your connection or CORS settings.'));
      };

      xhr.ontimeout = () => {
        reject(new ApiError(408, 'Request timeout'));
      };

      if (method === 'GET' || method === 'DELETE') {
        xhr.send();
      } else {
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        xhr.send(body);
      }
    });
  }
}

