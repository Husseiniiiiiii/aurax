import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { api, API_ENABLED, type ApiCategory } from "../lib/api";

export default function CategoriesHub() {
  const { lang } = useLanguage();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(API_ENABLED);

  useEffect(() => {
    if (!API_ENABLED) return;
    api
      .listCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Main sections (shown as big circles linking to their aisle)
  const homeSections = categories.filter(
    (c) => c.gender === "men" || c.gender === "women"
  );

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black silver-text">
          {lang === "ar" ? "الفئات" : "Categories"}
        </h1>
        <p className="mt-3 text-aurax-500 max-w-2xl mx-auto">
          {lang === "ar"
            ? "اختر القسم الرجالي أو النسائي لتصفّح الفئات."
            : "Choose men's or women's to browse categories."}
        </p>
      </div>

      {loading ? (
        /* ——— Shimmer skeleton ——— */
        <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-20 mt-8">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 w-full max-w-[220px] sm:max-w-[260px]"
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer ring-[3px] ring-aurax-300/40 dark:ring-aurax-700/40 ring-offset-4 ring-offset-aurax-50 dark:ring-offset-aurax-900" />
              <div className="h-5 w-24 sm:w-28 rounded-full bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
            </div>
          ))}
        </div>
      ) : homeSections.length > 0 ? (
        <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-20 mt-8">
          {homeSections.map((section) => (
            <Link
              key={section.id}
              to={`/categories/${section.gender}`}
              className="group flex flex-col items-center gap-4 w-full max-w-[220px] sm:max-w-[260px]"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden ring-[3px] ring-aurax-300/80 dark:ring-aurax-600/70 shadow-glow ring-offset-4 ring-offset-aurax-50 dark:ring-offset-aurax-900 transition-all duration-500 group-hover:ring-aurax-500 dark:group-hover:ring-aurax-400 group-hover:scale-[1.03]">
                {section.image ? (
                  <img
                    src={section.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-aurax-800 flex items-center justify-center">
                    <span className="text-5xl opacity-30">
                      {section.gender === "women" ? "👗" : "👔"}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-aurax-900/70 via-transparent to-transparent" />
              </div>
              <span className="text-center font-extrabold tracking-wide text-base sm:text-lg">
                {lang === "ar" ? section.name : section.nameEn}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-aurax-500">
          <p className="text-lg font-bold">
            {lang === "ar"
              ? "لا توجد أقسام بعد."
              : "No sections yet."}
          </p>
        </div>
      )}
    </main>
  );
}
