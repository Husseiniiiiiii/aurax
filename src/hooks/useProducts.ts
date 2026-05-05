import { useEffect, useState } from "react";
import { api, API_ENABLED, type ApiProduct } from "../lib/api";
import type { Product, CategoryId } from "../data/products";

// Map API product to the frontend Product shape (fills missing fields with defaults).
function mapApiProduct(p: ApiProduct): Product {
  // Use the actual category slug from the API — no hardcoded allowlist.
  const category: CategoryId = (p.category?.slug as CategoryId) || "uncategorized";

  return {
    id: p.slug || p.id,
    apiId: p.id,
    name: p.name,
    nameEn: p.nameEn,
    category,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    rating: 4.5,
    reviews: 0,
    image: p.image,
    images: p.images ?? [],
    description: p.description ?? "",
    badge: (p.badge as Product["badge"]) ?? undefined,
    colors: p.colors,
    sizes: p.sizes,
    inStock: p.inStock,
    featured: p.featured,
    stock: p.stock ?? undefined,
  };
}

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: "api" | "empty";
}

export function useProducts(): UseProductsState {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: API_ENABLED,
    error: null,
    source: "empty",
  });

  useEffect(() => {
    if (!API_ENABLED) {
      setState({ products: [], loading: false, error: null, source: "empty" });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    api
      .listProducts()
      .then((items) => {
        if (cancelled) return;
        setState({
          products: items.map(mapApiProduct),
          loading: false,
          error: null,
          source: "api",
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("API error loading products:", err);
        setState({
          products: [],
          loading: false,
          error: String(err.message || err),
          source: "empty",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
