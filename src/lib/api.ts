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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_ENABLED) throw new Error("API not configured");
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
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
  listCategories: () => request<ApiCategory[]>("/api/categories"),
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
