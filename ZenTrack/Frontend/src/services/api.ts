async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Error ${res.status}`);
  }

  // 204 No Content (DELETE) no tiene body
  if (res.status === 204) return undefined as T;
  return res.json();
}

const DEFAULT_OPTIONS: RequestInit = {
  credentials: "include",
};

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { ...DEFAULT_OPTIONS }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...DEFAULT_OPTIONS,
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...DEFAULT_OPTIONS,
    }),
  delete: <T>(path: string) =>
    request<T>(path, { 
      method: "DELETE",
      ...DEFAULT_OPTIONS
    }),
};