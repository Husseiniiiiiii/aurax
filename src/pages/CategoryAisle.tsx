import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api, API_ENABLED, type ApiCategory } from "../lib/api";

export default function CategoryAisle() {
  const { aisle } = useParams();
  const { lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_ENABLED) {
      setLoading(false);
      return;
    }
    api
      .listCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (aisle !== "women" && aisle !== "men") {
    return <Navigate to="/" replace />;
  }

  // Show sub-categories that belong to this gender section
  // gender = "men-sub" → appears in men's section
  // gender = "women-sub" → appears in women's section
  // gender = "both-sub" → appears in both sections
  const subTag = `${aisle}-sub`; // e.g. "men-sub" or "women-sub"
  const list = categories.filter(
    (c) => c.gender === subTag || c.gender === "both-sub"
  );

  // Find the parent section category for title/image
  const parentSection = categories.find((c) => c.gender === aisle);
  const title = parentSection
    ? lang === "ar"
      ? parentSection.name
      : parentSection.nameEn
    : aisle === "women"
    ? lang === "ar"
      ? "قسم نسائي"
      : "Women's section"
    : lang === "ar"
    ? "قسم رجالي"
    : "Men's section";

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-aurax-600 dark:text-aurax-300 hover:text-aurax-900 dark:hover:text-white transition"
        >
          <Arrow className="h-4 w-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Link>
        <div className="mt-6 text-center md:text-start">
          <h1 className="text-3xl md:text-4xl font-black silver-text">
            {title}
          </h1>
          <p className="mt-2 text-aurax-500 max-w-2xl mx-auto md:mx-0">
            {lang === "ar"
              ? "اختر إحدى الفئات أدناه."
              : "Pick a category below."}
          </p>
        </div>
      </div>

      {loading ? (
        /* Skeleton grid */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer"
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 text-aurax-500">
          <p className="text-lg font-bold">
            {lang === "ar"
              ? "لا توجد فئات في هذا القسم بعد."
              : "No categories in this section yet."}
          </p>
          <p className="mt-2 text-sm">
            {lang === "ar"
              ? "يمكن للمشرف إضافة فئات فرعية من لوحة التحكم."
              : "The admin can add sub-categories from the dashboard."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {list.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="card group relative overflow-hidden aspect-square hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={lang === "ar" ? cat.name : cat.nameEn}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-aurax-800 flex items-center justify-center">
                  <span className="text-4xl opacity-30">
                    {aisle === "women" ? "👗" : "👔"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-aurax-900 via-aurax-900/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-6 text-white">
                <div className="text-[10px] sm:text-xs font-bold tracking-widest text-aurax-300 uppercase">
                  {cat.nameEn}
                </div>
                <div className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-extrabold">
                  {lang === "ar" ? cat.name : cat.nameEn}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
