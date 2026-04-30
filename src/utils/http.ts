type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Primitive = string | number | boolean;
type QueryParams = Record<string, Primitive>;
type RequestData = unknown;
type RequestPath = string;
export const API_BASE_URL = "https://ya-praktikum.tech/api/v2/";
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/v2\/$/, "/ws/");

interface IRequestOptions {
  method?: HttpMethod;
  data?: RequestData;
  headers?: Record<string, string>;
  queryParams?: QueryParams;
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

  constructor(endpoint: string = "", timeout: number = 10000) {
    const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, "");
    const endpointPath = normalizedEndpoint ? `${normalizedEndpoint}/` : "";
    this.baseUrl = new URL(endpointPath, API_BASE_URL).toString();
    this.timeout = timeout;
  }

  public get<T>(path: RequestPath, queryParams?: QueryParams): Promise<T> {
    return this.request<T>({ method: 'GET', path, queryParams });
  }

  public post<T>(path: RequestPath, data?: RequestData): Promise<T> {
    return this.request<T>({ method: 'POST', path, data });
  }

  public put<T>(path: RequestPath, data?: RequestData): Promise<T> {
    return this.request<T>({ method: 'PUT', path, data });
  }

  public delete<T>(path: RequestPath, data?: RequestData): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, data });
  }

  private buildUrl(path: RequestPath, queryParams?: QueryParams): string {
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
      xhr.withCredentials = true;

      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

      const sendJsonBody =
        !isFormData &&
        (method === 'POST' ||
          method === 'PUT' ||
          (method === 'DELETE' && data !== undefined && data !== null));

      if (sendJsonBody) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      xhr.setRequestHeader('Accept', 'application/json');

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        const status = xhr.status;

        if (status >= 200 && status < 300) {
          try {
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            resolve(responseData as T);
          } catch {
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

      if (method === 'GET') {
        xhr.send();
      } else if (method === 'DELETE' && (data === undefined || data === null)) {
        xhr.send();
      } else if (data === undefined || data === null) {
        xhr.send();
      } else if (isFormData) {
        xhr.send(data);
      } else {
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        xhr.send(body);
      }
    });
  }
}

