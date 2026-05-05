import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";

export default function Wishlist() {
  const { items, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { lang } = useLanguage();

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-aurax-300 dark:text-aurax-700 mb-4" />
        <h1 className="text-3xl md:text-4xl font-black">
          {lang === "ar" ? "المفضلة فارغة" : "Wishlist is empty"}
        </h1>
        <p className="mt-3 text-aurax-500 max-w-md mx-auto">
          {lang === "ar"
            ? "لم تضف أي منتجات للمفضلة بعد. تصفّح المتجر وأضف ما يعجبك!"
            : "You haven't added any products to your wishlist yet."}
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          {lang === "ar" ? "تصفّح المتجر" : "Browse shop"}
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">
            {lang === "ar" ? "المفضلة" : "Wishlist"}
          </h1>
          <p className="mt-1 text-aurax-500 text-sm">
            {items.length} {lang === "ar" ? "منتج" : "items"}
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-sm font-bold text-red-500 hover:underline inline-flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {lang === "ar" ? "مسح الكل" : "Clear all"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10">
        {items.map((product) => {
          const name = lang === "ar" ? product.name : product.nameEn;
          return (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-aurax-100 dark:bg-aurax-800">
                  <img
                    src={product.image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-aurax-900 text-white text-[10px] font-extrabold uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-sm line-clamp-1">{name}</div>
                  <div className="font-extrabold text-base silver-text mt-0.5" dir="ltr">
                    {formatIqd(product.price, lang)}
                  </div>
                </div>
              </Link>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-aurax-200 dark:border-aurax-700 hover:border-aurax-500 transition"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {lang === "ar" ? "أضف للسلة" : "Add to cart"}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
