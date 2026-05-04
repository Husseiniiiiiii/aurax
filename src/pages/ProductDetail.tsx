import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { getProductById, products } from "../data/products";
import ProductMini from "../components/ProductMini";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProductById(id) : undefined;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.colors?.[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.sizes?.[0] ?? null
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black">{t("product.notFound")}</h1>
        <p className="mt-2 text-aurax-500">{t("product.notFoundDesc")}</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          {t("common.backToStore")}
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize ?? undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize ?? undefined);
    navigate("/cart");
  };

  const displayName = lang === "ar" ? product.name : product.nameEn;
  const subName = lang === "ar" ? product.nameEn : product.name;

  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="text-sm text-aurax-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-aurax-900 dark:hover:text-white">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-aurax-900 dark:hover:text-white">
          {t("nav.shop")}
        </Link>
        <span>/</span>
        <span className="text-aurax-900 dark:text-white font-bold">
          {displayName}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="card overflow-hidden">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-black">
            {displayName}
          </h1>
          <p className="mt-1 text-aurax-500">{subName}</p>

          <div className="mt-5 flex items-baseline gap-3 flex-wrap">
            <span
              className="text-3xl font-black silver-text whitespace-nowrap"
              dir="ltr"
            >
              {formatIqd(product.price, lang)}
            </span>
            {product.oldPrice && (
              <>
                <span
                  className="text-lg text-aurax-400 line-through whitespace-nowrap"
                  dir="ltr"
                >
                  {formatIqd(product.oldPrice, lang)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-extrabold">
                  -
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )}
                  %
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-aurax-600 dark:text-aurax-300 leading-relaxed">
            {product.description}
          </p>

          {product.colors && (
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2">{t("product.color")}</h4>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    aria-label={`color ${c}`}
                    className={`h-9 w-9 rounded-full ring-2 transition ${
                      selectedColor === c
                        ? "ring-aurax-900 dark:ring-white scale-110"
                        : "ring-aurax-200 dark:ring-aurax-700"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2">{t("product.size")}</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[3rem] px-4 py-2 rounded-lg text-sm font-bold transition ${
                      selectedSize === s
                        ? "bg-aurax-900 text-aurax-50 dark:bg-white dark:text-aurax-900"
                        : "border border-aurax-200 dark:border-aurax-700 hover:border-aurax-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center rounded-xl border border-aurax-200 dark:border-aurax-700">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-11 grid place-items-center hover:bg-aurax-100 dark:hover:bg-aurax-800 rounded-r-xl"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-extrabold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-11 w-11 grid place-items-center hover:bg-aurax-100 dark:hover:bg-aurax-800 rounded-l-xl"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-aurax-500">
              {t("product.quantity")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-outline flex-1"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("common.addToCart")}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="btn-primary flex-1"
            >
              {t("common.buyNow")}
              <Arrow className="h-4 w-4" />
            </button>
            <button aria-label={t("nav.wishlist")} className="btn-outline px-4">
              <Heart className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-aurax-200/70 dark:border-aurax-800/90">
          <h2 className="text-2xl md:text-3xl font-black mb-5 md:mb-6">
            {t("product.relatedTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {related.map((p) => (
              <ProductMini key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
