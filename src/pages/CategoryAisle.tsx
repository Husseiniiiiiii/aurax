import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getCategoriesForAisle,
  isGenderAisleParam,
} from "../data/products";
import { useLanguage } from "../context/LanguageContext";

export default function CategoryAisle() {
  const { aisle } = useParams();
  const { t, lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  if (!isGenderAisleParam(aisle)) {
    return <Navigate to="/categories" replace />;
  }

  const list = getCategoriesForAisle(aisle);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-bold text-aurax-600 dark:text-aurax-300 hover:text-aurax-900 dark:hover:text-white"
        >
          <Arrow className="h-4 w-4" />
          {t("categories.backToHub")}
        </Link>
        <div className="mt-6 text-center md:text-start">
          <div className="text-xs font-bold tracking-widest text-aurax-500 uppercase">
            {t("categories.eyebrow")}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black silver-text">
            {aisle === "women"
              ? t("categories.sectionWomen")
              : t("categories.sectionMen")}
          </h1>
          <p className="mt-2 text-aurax-500 max-w-2xl mx-auto md:mx-0">
            {t("categories.aislePickCategory")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {list.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="card group relative overflow-hidden aspect-square hover:-translate-y-1 hover:shadow-glow"
          >
            <img
              src={cat.image}
              alt={t(cat.nameKey)}
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-aurax-900 via-aurax-900/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-6 text-white">
              <div className="text-[10px] sm:text-xs font-bold tracking-widest text-aurax-300 uppercase">
                {cat.nameEn}
              </div>
              <div className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-extrabold">{t(cat.nameKey)}</div>
              <div className="mt-1.5 sm:mt-2 md:mt-3 flex items-center justify-between">
                <span className="text-xs text-aurax-300">
                  {cat.count} {t("common.product")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                  {t("categories.shop")}
                  <Arrow className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
