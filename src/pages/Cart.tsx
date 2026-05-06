import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } =
    useCart();
  const { t, lang } = useLanguage();

  // Flat shipping rate: 5,000 IQD
  const subtotalIqd = subtotal;
  const shippingIqd = 5000;
  const totalIqd = subtotalIqd + shippingIqd;
  const currency = lang === "ar" ? "د.ع" : "IQD";

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-black">
          {t("cart.empty")}
        </h1>
        <p className="mt-3 text-aurax-500 max-w-md mx-auto">
          {t("cart.emptyDesc")}
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          {t("common.shopNow")}
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">
            {t("cart.title")}
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-sm font-bold text-red-500 hover:underline inline-flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {t("cart.clear")}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id + (item.size ?? "")}
              className="card p-4 flex gap-4 items-center"
            >
              <Link
                to={`/product/${item.product.id}`}
                className="h-24 w-24 rounded-xl overflow-hidden bg-aurax-100 dark:bg-aurax-800 flex-shrink-0"
              >
                <img
                  src={item.product.image}
                  alt={lang === "ar" ? item.product.name : item.product.nameEn}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-bold hover:text-aurax-500 line-clamp-1 text-sm md:text-base"
                  >
                    {lang === "ar" ? item.product.name : item.product.nameEn}
                  </Link>
                  <div className="font-extrabold text-sm whitespace-nowrap shrink-0">
                    {formatIqd(item.product.price, lang)}
                  </div>
                </div>
                {item.size && (
                  <div className="text-xs text-aurax-500">
                    {t("cart.size")}: {item.size}
                  </div>
                )}
                <div className="mt-auto pt-2 inline-flex items-center rounded-lg border border-aurax-200 dark:border-aurax-700 w-fit">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="h-8 w-8 grid place-items-center hover:bg-aurax-100 dark:hover:bg-aurax-800"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      const maxStock = item.product.stock ? Math.min(10, item.product.stock) : 10;
                      if (item.quantity < maxStock) {
                        updateQuantity(item.product.id, item.quantity + 1);
                      }
                    }}
                    disabled={item.product.stock && item.quantity >= Math.min(10, item.product.stock)}
                    className="h-8 w-8 grid place-items-center hover:bg-aurax-100 dark:hover:bg-aurax-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                aria-label={t("cart.clear")}
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-28">
          <h3 className="text-xl font-extrabold">{t("cart.summary")}</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-aurax-500">{t("cart.subtotal")}</span>
              <span className="font-bold whitespace-nowrap" dir="ltr">
                {subtotalIqd.toLocaleString("en-US")} {currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-aurax-500">{t("cart.shipping")}</span>
              <span className="font-bold whitespace-nowrap" dir="ltr">
                {`${shippingIqd.toLocaleString("en-US")} ${currency}`}
              </span>
            </div>
            <div className="border-t border-aurax-200 dark:border-aurax-700 pt-3 flex justify-between text-base">
              <span className="font-bold">{t("cart.total")}</span>
              <span
                className="font-black text-lg silver-text whitespace-nowrap"
                dir="ltr"
              >
                {totalIqd.toLocaleString("en-US")} {currency}
              </span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary w-full mt-6 text-center">
            {t("cart.checkout")}
          </Link>
          <Link
            to="/shop"
            className="block text-center mt-3 text-sm font-bold text-aurax-500 hover:text-aurax-900 dark:hover:text-white"
          >
            {t("common.continueShopping")}
          </Link>
        </aside>
      </div>
    </main>
  );
}
