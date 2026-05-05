import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { api, API_ENABLED, type ApiCategory } from "../lib/api";
import { useEffect, useState } from "react";

export default function Shop() {
  const [params] = useSearchParams();
  const categorySlug = params.get("category");
  const { t } = useLanguage();
  const { products: allProducts, loading } = useProducts();

  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    if (!API_ENABLED) return;
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (categorySlug) {
      list = list.filter((p) => p.category === categorySlug);
    }
    return list;
  }, [allProducts, categorySlug]);

  const headerTitle = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name || t("shop.allProducts")
    : t("shop.allProducts");

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        {loading ? (
          <>
            <div className="h-8 w-48 mx-auto rounded-lg bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
            <div className="h-4 w-24 mx-auto mt-3 rounded-full bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-black">{headerTitle}</h1>
            <p className="mt-2 text-aurax-500">
              {filtered.length} {t("common.product")}
            </p>
          </>
        )}
      </div>

      {loading ? (
        /* ——— Product grid shimmer ——— */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] rounded-2xl bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
              <div className="h-3.5 w-3/4 rounded bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
              <div className="h-3 w-1/3 rounded bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-xl font-extrabold">{t("shop.noResults")}</h3>
          <p className="mt-2 text-aurax-500">{t("shop.noResultsDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
