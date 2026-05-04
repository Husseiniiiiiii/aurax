import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, type CategoryId } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { formatIqdNumber } from "../utils/currency";
import { useProducts } from "../hooks/useProducts";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get("category") as CategoryId | null;
  const queryParam = params.get("q") || "";
  const saleParam = params.get("sale") === "true";
  const { t, lang } = useLanguage();

  const [sort, setSort] = useState<SortKey>("featured");
  const { products: allProducts, loading } = useProducts();
  // Upper bound of the price slider = highest product price (min 1,000,000 IQD)
  const priceCeiling = useMemo(() => {
    const max = allProducts.reduce((m, p) => Math.max(m, p.price), 0);
    return Math.max(1_000_000, Math.ceil(max / 50_000) * 50_000);
  }, [allProducts]);
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [showFilters, setShowFilters] = useState(false);

  // Keep the slider in sync when products load and ceiling changes.
  // If the user hasn't moved it below, snap to the new ceiling.
  useEffect(() => {
    setMaxPrice((prev) => (prev < priceCeiling ? prev : priceCeiling));
  }, [priceCeiling]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (categoryParam) list = list.filter((p) => p.category === categoryParam);
    if (saleParam) list = list.filter((p) => p.oldPrice);
    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [allProducts, categoryParam, saleParam, queryParam, sort, maxPrice]);

  const setCategory = (cat: CategoryId | null) => {
    const next = new URLSearchParams(params);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setParams(next);
  };

  const clearAll = () => {
    setParams(new URLSearchParams());
    setMaxPrice(priceCeiling);
    setSort("featured");
  };

  const headerTitle = categoryParam
    ? t(categories.find((c) => c.id === categoryParam)!.nameKey)
    : queryParam
    ? `${t("shop.searchResults")}: "${queryParam}"`
    : saleParam
    ? t("shop.sale")
    : t("shop.allProducts");

  const currencyLabel = lang === "ar" ? "د.ع" : "IQD";

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-xs font-bold tracking-widest text-aurax-500 uppercase">
          {t("shop.eyebrow")}
        </div>
        <h1 className="mt-1 text-3xl md:text-4xl font-black">{headerTitle}</h1>
        <p className="mt-2 text-aurax-500">
          {filtered.length} {t("common.product")}
        </p>
      </div>

      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem(
              "search"
            ) as HTMLInputElement;
            if (input.value.trim()) {
              setParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("q", input.value.trim());
                return next;
              });
            }
          }}
          className="card border-2 border-aurax-300 dark:border-aurax-700 bg-white/50 dark:bg-aurax-800/50 p-3 flex items-center gap-3"
        >
          <Search className="h-5 w-5 text-aurax-500 shrink-0" />
          <input
            name="search"
            type="text"
            defaultValue={queryParam}
            placeholder={t("nav.searchPlaceholder")}
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-aurax-400"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
        </form>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside
          className={`${
            showFilters ? "block" : "hidden lg:block"
          } lg:sticky lg:top-28 self-start`}
        >
          <div className="card p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t("shop.filters")}
              </h3>
              <button
                onClick={clearAll}
                className="text-xs font-bold text-aurax-500 hover:text-aurax-900 dark:hover:text-white"
              >
                {t("shop.clearAll")}
              </button>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">{t("shop.category")}</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setCategory(null)}
                  className={`w-full ${
                    lang === "ar" ? "text-right" : "text-left"
                  } px-3 py-2 rounded-lg text-sm transition ${
                    !categoryParam
                      ? "bg-aurax-900 text-aurax-50 dark:bg-white dark:text-aurax-900 font-bold"
                      : "hover:bg-aurax-100 dark:hover:bg-aurax-800"
                  }`}
                >
                  {t("shop.all")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`w-full ${
                      lang === "ar" ? "text-right" : "text-left"
                    } px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                      categoryParam === cat.id
                        ? "bg-aurax-900 text-aurax-50 dark:bg-white dark:text-aurax-900 font-bold"
                        : "hover:bg-aurax-100 dark:hover:bg-aurax-800"
                    }`}
                  >
                    <span>{t(cat.nameKey)}</span>
                    <span className="text-xs opacity-60">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">{t("shop.maxPrice")}</h4>
              <input
                type="range"
                min={0}
                max={priceCeiling}
                step={Math.max(1000, Math.round(priceCeiling / 100))}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-aurax-700"
              />
              <div className="flex justify-between text-xs text-aurax-500 mt-1">
                <span>0 {currencyLabel}</span>
                <span className="font-extrabold text-aurax-900 dark:text-white">
                  {formatIqdNumber(maxPrice, lang)} {currencyLabel}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="lg:hidden btn-outline"
            >
              {showFilters ? (
                <X className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              {showFilters ? t("shop.hideFilters") : t("shop.showFilters")}
            </button>
            <div className="flex items-center gap-2 ms-auto">
              <span className="text-sm text-aurax-500">{t("shop.sort")}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input py-2 max-w-xs"
              >
                <option value="featured">{t("shop.sortFeatured")}</option>
                <option value="price-asc">{t("shop.sortPriceAsc")}</option>
                <option value="price-desc">{t("shop.sortPriceDesc")}</option>
                <option value="rating">{t("shop.sortRating")}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center text-aurax-500">...</div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <h3 className="text-xl font-extrabold">{t("shop.noResults")}</h3>
              <p className="mt-2 text-aurax-500">{t("shop.noResultsDesc")}</p>
              <button onClick={clearAll} className="btn-primary mt-5">
                {t("shop.clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
