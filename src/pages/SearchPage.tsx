import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import type { CategoryId } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { api, API_ENABLED, type ApiCategory } from "../lib/api";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { key: SortKey; ar: string; en: string }[] = [
  { key: "featured",   ar: "مميز",       en: "Featured"   },
  { key: "price-asc",  ar: "الأقل سعراً", en: "Low Price"  },
  { key: "price-desc", ar: "الأعلى سعراً",en: "High Price" },
  { key: "rating",     ar: "الأعلى تقييماً", en: "Top Rated" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { lang } = useLanguage();
  const isRtl = lang === "ar";

  const [input, setInput]     = useState(params.get("q") || "");
  const [query, setQuery]     = useState(params.get("q") || "");
  const [sort, setSort]       = useState<SortKey>("featured");
  const [cat, setCat]         = useState<CategoryId | null>(null);

  const { products: allProducts } = useProducts();
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!API_ENABLED) return;
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  const results = (() => {
    let list = [...allProducts];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q)
      );
    }
    if (cat) list = list.filter((p) => p.category === cat);
    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating")     list.sort((a, b) => b.rating - a.rating);
    return list;
  })();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    setQuery(q);
    q ? setParams({ q }) : setParams({});
  };

  const hasResults = query.trim().length > 0 || cat !== null;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-[80vh]">

      {/* ══ Hero: search bar ══ */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={submit} className="card border-2 border-aurax-300 dark:border-aurax-700 bg-white/50 dark:bg-aurax-800/50 p-3 flex items-center gap-3">
            <Search className="h-5 w-5 text-aurax-500 shrink-0" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRtl ? "ابحث عن منتج…" : "Search products…"}
              className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-aurax-400"
              dir={isRtl ? "rtl" : "ltr"}
            />
            <button
              type="submit"
              className="shrink-0 h-9 px-4 rounded-full border border-aurax-400 dark:border-aurax-600 text-xs font-extrabold tracking-widest text-aurax-700 dark:text-aurax-300 hover:border-aurax-900 dark:hover:border-white hover:text-aurax-900 dark:hover:text-white transition-all"
            >
              {isRtl ? "بحث" : "SEARCH"}
            </button>
          </form>
        </div>
      </section>

      {/* ══ Category filter row ══ */}
      <div className="container mx-auto px-4 pt-6">
        <select
          value={cat ?? ""}
          onChange={(e) => setCat(e.target.value as CategoryId | null)}
          className="w-full sm:w-auto h-10 px-4 pr-10 rounded-full text-xs font-extrabold tracking-wide border border-aurax-300 dark:border-aurax-700 bg-white dark:bg-aurax-900 text-aurax-900 dark:text-aurax-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aurax-500/30"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <option value="">{isRtl ? "الكل" : "All"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {isRtl ? c.name : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* ══ Controls row ══ */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 flex-wrap">

          {/* ── Sort pills ── */}
          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map((opt) => {
              const active = sort === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className={`h-9 px-4 rounded-full text-xs font-extrabold tracking-wide border transition-all ${
                    active
                      ? "brand-shine border-aurax-400/50 dark:border-aurax-600/50 bg-aurax-50 dark:bg-aurax-800/60"
                      : "border-aurax-200 dark:border-aurax-800 text-aurax-500 dark:text-aurax-500 hover:border-aurax-400 dark:hover:border-aurax-600 hover:text-aurax-900 dark:hover:text-white"
                  }`}
                >
                  {isRtl ? opt.ar : opt.en}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ Results ══ */}
      <div className="container mx-auto px-4 py-6">
        {!hasResults ? (
          /* idle state */
          <div className="py-20 text-center">
            <Search className="h-10 w-10 mx-auto mb-4 text-aurax-200 dark:text-aurax-800" />
            <p className="text-aurax-400 dark:text-aurax-600 text-sm">
              {isRtl ? "ابدأ بالكتابة للبحث" : "Start typing to search"}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl font-black text-aurax-100 dark:text-aurax-800 mb-3">0</p>
            <p className="text-sm text-aurax-400">
              {isRtl ? "لا توجد نتائج" : "No results found"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[11px] tracking-[0.25em] uppercase text-aurax-400 mb-8">
              {results.length}&thinsp;{isRtl ? "منتج" : "items"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
