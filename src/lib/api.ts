// API client for AURAX backend (Railway)
// Set VITE_API_URL in Cloudflare Pages env or .env.local for local dev.

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "";

export const API_ENABLED = Boolean(API_URL);

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string | null;
  descriptionEn: string | null;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  badge: string | null;
  sizes: string[];
  colors: string[];
  gender: string | null;
  categoryId: string;
  category?: ApiCategory;
  createdAt: string;
  updatedAt: string;
}

function getToken(): string | null {
  try {
    return localStorage.getItem("aurax_token");
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_ENABLED) throw new Error("API not configured");
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export const api = {
  listProducts: (params?: {
    category?: string;
    gender?: string;
    search?: string;
    featured?: boolean;
  }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.gender) q.set("gender", params.gender);
    if (params?.search) q.set("search", params.search);
    if (params?.featured) q.set("featured", "true");
    const qs = q.toString();
    return request<ApiProduct[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug: string) => request<ApiProduct>(`/api/products/${slug}`),
  createProduct: (body: Partial<ApiProduct>) =>
    request<ApiProduct>("/api/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProduct: (id: string, body: Partial<ApiProduct>) =>
    request<ApiProduct>(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteProduct: (id: string) =>
    request<void>(`/api/products/${id}`, { method: "DELETE" }),

  listCategories: () => request<ApiCategory[]>("/api/categories"),
  createCategory: (body: Partial<ApiCategory>) =>
    request<ApiCategory>("/api/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCategory: (id: string, body: Partial<ApiCategory>) =>
    request<ApiCategory>(`/api/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteCategory: (id: string) =>
    request<void>(`/api/categories/${id}`, { method: "DELETE" }),

  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<AuthUser>("/api/auth/me"),

  uploadImage: async (file: File): Promise<{ url: string; key: string }> => {
    if (!API_ENABLED) throw new Error("API not configured");
    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
  },

  createOrder: (body: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      size?: string;
      color?: string;
    }>;
  }) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
