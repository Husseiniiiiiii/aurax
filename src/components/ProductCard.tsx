import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";
import type { TranslationKey } from "../i18n/translations";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  new: "bg-white/90 text-aurax-900",
  hot: "bg-red-500/90 text-white",
  sale: "bg-aurax-900/90 text-aurax-50",
  limited: "bg-amber-400/90 text-aurax-900",
};

const BADGE_LABEL_KEY: Record<NonNullable<Product["badge"]>, TranslationKey> = {
  new: "badge.new",
  hot: "badge.hot",
  sale: "badge.sale",
  limited: "badge.limited",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  const displayName = lang === "ar" ? product.name : product.nameEn;

  return (
    <article className="group">
      {/* ─── Square image ─── */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden rounded-xl bg-aurax-100 dark:bg-aurax-800/60"
      >
        <img
          src={product.image}
          alt={displayName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* badge */}
        {product.badge && (
          <span
            className={`absolute top-2 ${
              lang === "ar" ? "right-2" : "left-2"
            } px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide backdrop-blur-sm ${
              BADGE_STYLES[product.badge]
            }`}
          >
            {t(BADGE_LABEL_KEY[product.badge])}
          </span>
        )}

        {/* out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-aurax-900/40 backdrop-blur-sm">
            <span className="px-3 py-1.5 rounded bg-white text-aurax-900 text-xs font-extrabold">
              {t("common.outOfStock")}
            </span>
          </div>
        )}

        </Link>

      {/* ─── Info below image ─── */}
      <div className="mt-2.5 px-0.5">
        <Link to={`/product/${product.id}`}>
          <p className="text-sm font-bold leading-snug line-clamp-1 hover:opacity-60 transition-opacity">
            {displayName}
          </p>
        </Link>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p
            className="text-base font-extrabold text-aurax-900 dark:text-white"
            dir="ltr"
          >
            {formatIqd(product.price, lang)}
          </p>
          {product.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              aria-label={t("common.addToCart")}
              className="h-9 w-9 grid place-items-center rounded-lg border border-aurax-300 dark:border-aurax-600 text-aurax-700 dark:text-aurax-200 hover:bg-aurax-100 dark:hover:bg-aurax-800 hover:border-aurax-500 transition"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
