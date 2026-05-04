import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";

export default function ProductMini({ product }: { product: Product }) {
  const { lang } = useLanguage();
  const displayName = lang === "ar" ? product.name : product.nameEn;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block focus:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-aurax-100 dark:bg-aurax-800 ring-1 ring-aurax-200/60 dark:ring-aurax-700/50 metal-shine shadow-soft group-hover:shadow-glow group-hover:ring-aurax-400 dark:group-hover:ring-aurax-500 transition-all duration-500">
        <img
          src={product.image}
          alt={displayName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <h3 className="mt-2 text-sm font-bold line-clamp-1 text-aurax-900 dark:text-aurax-100 group-hover:text-aurax-500 transition">
        {displayName}
      </h3>
      <div
        className="mt-0.5 text-sm font-extrabold silver-text whitespace-nowrap"
        dir="ltr"
      >
        {formatIqd(product.price, lang)}
      </div>
    </Link>
  );
}
