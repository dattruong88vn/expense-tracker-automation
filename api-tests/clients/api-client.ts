import type { APIRequestContext, APIResponse } from '@playwright/test';

type Body = Record<string, unknown>;

/** Path prefix of the versioned API; operational endpoints such as /health are unprefixed. */
export const API_PREFIX = '/api/v1';

/**
 * Thin wrapper over Playwright's `request` fixture. Every HTTP call of the API
 * suite goes through this class. The bearer token is held privately and is
 * never exposed in logs, error messages or reports.
 */
export class ApiClient {
  readonly #request: APIRequestContext;
  #token: string | undefined;

  constructor(request: APIRequestContext, token?: string) {
    this.#request = request;
    this.#token = token;
  }

  /** Returns a client bound to the same request context with the given token. */
  withToken(token: string): ApiClient {
    return new ApiClient(this.#request, token);
  }

  health(): Promise<APIResponse> {
    return this.#request.get('/health');
  }

  get(path: string, params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.#request.get(this.#url(path), { headers: this.#headers(), params });
  }

  post(path: string, data?: Body): Promise<APIResponse> {
    return this.#request.post(this.#url(path), { headers: this.#headers(), data });
  }

  patch(path: string, data?: Body): Promise<APIResponse> {
    return this.#request.patch(this.#url(path), { headers: this.#headers(), data });
  }

  put(path: string, data?: Body): Promise<APIResponse> {
    return this.#request.put(this.#url(path), { headers: this.#headers(), data });
  }

  delete(path: string): Promise<APIResponse> {
    return this.#request.delete(this.#url(path), { headers: this.#headers() });
  }

  #url(path: string): string {
    return `${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
  }

  #headers(): Record<string, string> {
    return this.#token ? { Authorization: `Bearer ${this.#token}` } : {};
  }
}
