import { useEffect, useState } from "react";
import { api, API_ENABLED, type ApiProduct } from "../lib/api";
import {
  products as staticProducts,
  type Product,
  type CategoryId,
} from "../data/products";

// Map API product to the frontend Product shape (fills missing fields with defaults).
function mapApiProduct(p: ApiProduct): Product {
  const allowedCats: CategoryId[] = [
    "men",
    "women",
    "shoes",
    "accessories",
    "watches",
    "bags",
  ];
  const slug = p.category?.slug as CategoryId | undefined;
  const category: CategoryId =
    slug && allowedCats.includes(slug) ? slug : "accessories";

  return {
    id: p.slug || p.id,
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
  };
}

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: "api" | "static";
}

export function useProducts(): UseProductsState {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: API_ENABLED,
    error: null,
    source: "static",
  });

  useEffect(() => {
    if (!API_ENABLED) {
      setState({
        products: staticProducts,
        loading: false,
        error: null,
        source: "static",
      });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    api
      .listProducts()
      .then((items) => {
        if (cancelled) return;
        const mapped = items.map(mapApiProduct);
        // Fallback to static if API returns empty
        if (mapped.length === 0) {
          setState({
            products: staticProducts,
            loading: false,
            error: null,
            source: "static",
          });
        } else {
          setState({
            products: mapped,
            loading: false,
            error: null,
            source: "api",
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        // On API error, fallback to static data so site stays usable.
        console.error("API error, using static data:", err);
        setState({
          products: staticProducts,
          loading: false,
          error: String(err.message || err),
          source: "static",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
