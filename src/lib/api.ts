// Thin fetch wrapper for the ASP.NET Core API. The session lives in an HttpOnly SameSite=Strict cookie,
// so no token is ever stored in JavaScript. The custom header is the API's CSRF defence for mutations.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface Options {
  method?: string;
  json?: unknown;
  form?: FormData;
}

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { 'X-Requested-With': 'NetrokonaWeb' };
  let body: BodyInit | undefined;
  if (opts.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.json);
  } else if (opts.form) {
    body = opts.form; // browser sets the multipart boundary
  }
  let res: Response;
  try {
    res = await fetch(BASE + path, { method: opts.method ?? (body ? 'POST' : 'GET'), headers, body, credentials: 'include' });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again later.');
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON error page */ }
  if (!res.ok) {
    const d = (data ?? {}) as { message?: string; errors?: Record<string, string[]> };
    const fallback = res.status === 429 ? 'Too many requests. Please wait a moment.' : `Request failed (${res.status}).`;
    throw new ApiError(res.status, d.message ?? fallback, d.errors);
  }
  return data as T;
}

export const mediaUrl = (path: string) => BASE + path;

export const firstError = (e: unknown): string => {
  if (e instanceof ApiError) {
    const first = e.errors ? Object.values(e.errors)[0]?.[0] : undefined;
    return first ? `${e.message} ${first}` : e.message;
  }
  return 'Something went wrong.';
};
