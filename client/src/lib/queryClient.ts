import { QueryClient, QueryFunction } from "@tanstack/react-query";

function toRootPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j?.message || j?.error || msg;
    } catch {
      try { msg = await res.text(); } catch {}
    }
    throw new Error(`${res.status}: ${msg || "Request failed"}`);
  }
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: unknown
) {
  const res = await fetch(toRootPath(url), {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // keep
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const path = toRootPath((queryKey as (string | number)[]).join("/"));
    const res = await fetch(path, { credentials: "include" });

    if (on401 === "returnNull" && res.status === 401) return null as T;
    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: { retry: false },
  },
});
