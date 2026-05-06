import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight as ChevronRightIcon, X as XIcon, Share2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import ProductMini from "../components/ProductMini";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd } from "../utils/currency";
import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { products: allProducts, loading } = useProducts();
  const product = useMemo(
    () => (id ? allProducts.find((p) => p.id === id) : undefined),
    [allProducts, id]
  );
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  // Update metadata when product loads
  useEffect(() => {
    if (product) {
      const displayName = lang === "ar" ? product.name : product.nameEn;
      const priceText = formatIqd(product.price, lang);

      // Update title
      document.title = `${displayName} - AURAX`;

      // Update Open Graph meta tags
      const updateMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      const updateMetaName = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateMetaTag('og:title', displayName);
      updateMetaTag('og:description', product.description || `${displayName} - ${priceText}`);
      updateMetaTag('og:image', product.image);
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:type', 'product');
      updateMetaTag('product:price:amount', String(product.price));
      updateMetaTag('product:price:currency', 'IQD');
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', displayName);
      updateMetaName('twitter:description', product.description || `${displayName} - ${priceText}`);
      updateMetaName('twitter:image', product.image);
    }

    return () => {
      // Reset to default when leaving product page
      document.title = 'AURAX';
    };
  }, [product, lang]);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // When the product loads from the API, sync default color/size selection.
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] ?? null);
      setSelectedSize(product.sizes?.[0] ?? null);
    }
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
          <div className="space-y-4">
            <div className="h-9 w-2/3 rounded-lg bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-4 w-1/3 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
            <div className="h-10 w-1/2 rounded-lg bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-20 w-full rounded-lg bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
            <div className="h-12 w-full rounded-xl bg-aurax-300/60 dark:bg-aurax-700/70 overflow-hidden shimmer" />
          </div>
        </div>
      </main>
    );
  }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const displayName = lang === "ar" ? product.name : product.nameEn;
        await navigator.share({
          title: displayName,
          text: `${displayName} - ${formatIqd(product.price, lang)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard");
    }
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
        <ProductGallery
          cover={product.image}
          extra={product.images || []}
          alt={displayName}
        />

        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-black">
            {displayName}
          </h1>
          <p className="mt-1 text-aurax-500">{subName}</p>

          {/* Price + Stock */}
          <div className="mt-5 flex items-center gap-3 flex-wrap">
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

          {product.colors && product.colors.length > 0 && (
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

          {product.sizes && product.sizes.length > 0 && (
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
                onClick={() => setQuantity((q) => {
                  const maxStock = product.stock ? Math.min(10, product.stock) : 10;
                  return q < maxStock ? q + 1 : q;
                })}
                disabled={!!product.stock && quantity >= Math.min(10, product.stock)}
                className="h-11 w-11 grid place-items-center hover:bg-aurax-100 dark:hover:bg-aurax-800 rounded-l-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
              <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-aurax-500">
              {t("product.quantity")}
            </span>
            {product.stock != null && product.stock > 0 && (
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                • {lang === "ar" ? ` متوفر : ${product.stock} قطعة` : ` Available : ${product.stock} items`}
              </span>
            )}
          </div>

          {/* Action buttons */}
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
            <button
              onClick={handleShare}
              aria-label={lang === "ar" ? "مشاركة" : "Share"}
              className="btn-outline px-4"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={t("nav.wishlist")}
              className={`btn-outline px-4 ${isInWishlist(product.id) ? "text-red-500 border-red-500/50" : ""}`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Description — below action buttons */}
          {product.description && (
            <div className="mt-8 pt-6 border-t border-aurax-200/70 dark:border-aurax-800/90 overflow-hidden">
              <h4 className="text-sm font-bold mb-2">
                {lang === "ar" ? "الوصف" : "Description"}
              </h4>
              <p className="text-aurax-600 dark:text-aurax-300 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere max-w-full" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                {product.description}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* spacer */}
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

// ───────────── Image gallery ─────────────

function ProductGallery({
  cover,
  extra,
  alt,
}: {
  cover: string;
  extra: string[];
  alt: string;
}) {
  const all = useMemo(() => {
    const list = [cover, ...extra].filter(Boolean);
    return Array.from(new Set(list));
  }, [cover, extra]);
  const [active, setActive] = useState(0);

  // Reset when product changes
  useEffect(() => {
    setActive(0);
  }, [cover]);

  const [zoomOpen, setZoomOpen] = useState(false);

  const go = (delta: number) =>
    setActive((i) => (i + delta + all.length) % all.length);

  if (all.length === 0) {
    return (
      <div className="card overflow-hidden aspect-square bg-aurax-100 dark:bg-aurax-800" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="card overflow-hidden relative">
        <button
          type="button"
          className="aspect-square block w-full cursor-zoom-in relative group"
          onClick={() => setZoomOpen(true)}
          aria-label="تكبير الصورة"
        >
          <img
            src={all[active]}
            alt={alt}
            className="h-full w-full object-cover"
          />
        </button>
        {all.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="السابق"
              className="absolute top-1/2 -translate-y-1/2 left-3 h-10 w-10 grid place-items-center rounded-full bg-aurax-900/70 backdrop-blur text-white hover:bg-aurax-900 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="التالي"
              className="absolute top-1/2 -translate-y-1/2 right-3 h-10 w-10 grid place-items-center rounded-full bg-aurax-900/70 backdrop-blur text-white hover:bg-aurax-900 transition"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurax-900/70 backdrop-blur">
              {all.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {all.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {all.map((src, i) => (
            <button
              type="button"
              key={src + i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                i === active
                  ? "border-aurax-900 dark:border-white"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomOpen && (
        <ZoomLightbox
          src={all[active]}
          alt={alt}
          onClose={() => setZoomOpen(false)}
          onPrev={all.length > 1 ? () => go(-1) : undefined}
          onNext={all.length > 1 ? () => go(1) : undefined}
        />
      )}
    </div>
  );
}

// ───────────── Zoom Lightbox ─────────────

function ZoomLightbox({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  // Reset on image change
  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [src]);

  // Lock body scroll + esc key
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(5, s + 0.5));
      if (e.key === "-") setScale((s) => Math.max(1, s - 0.5));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const clampPos = (x: number, y: number, s: number) => {
    // Loose clamp so image stays roughly on screen
    const max = 400 * s;
    return {
      x: Math.max(-max, Math.min(max, x)),
      y: Math.max(-max, Math.min(max, y)),
    };
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((s) => Math.max(1, Math.min(5, s + delta)));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overscroll-contain"
      onWheel={onWheel}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="إغلاق"
        className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
      >
        <XIcon className="h-5 w-5" />
      </button>


      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="السابق"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="التالي"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}

      <img
        src={src}
        alt={alt}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (scale === 1) setScale(2);
          else {
            setScale(1);
            setPos({ x: 0, y: 0 });
          }
        }}
        onMouseDown={(e) => {
          if (scale <= 1) return;
          drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
        }}
        onMouseMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          const dy = e.clientY - drag.current.y;
          setPos(clampPos(drag.current.px + dx, drag.current.py + dy, scale));
        }}
        onMouseUp={() => (drag.current = null)}
        onMouseLeave={() => (drag.current = null)}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const [a, b] = [e.touches[0], e.touches[1]];
            const dist = Math.hypot(
              a.clientX - b.clientX,
              a.clientY - b.clientY
            );
            pinch.current = { dist, scale };
          } else if (e.touches.length === 1 && scale > 1) {
            const t = e.touches[0];
            drag.current = { x: t.clientX, y: t.clientY, px: pos.x, py: pos.y };
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinch.current) {
            const [a, b] = [e.touches[0], e.touches[1]];
            const dist = Math.hypot(
              a.clientX - b.clientX,
              a.clientY - b.clientY
            );
            const next = Math.max(
              1,
              Math.min(5, (pinch.current.scale * dist) / pinch.current.dist)
            );
            setScale(next);
          } else if (e.touches.length === 1 && drag.current) {
            const t = e.touches[0];
            const dx = t.clientX - drag.current.x;
            const dy = t.clientY - drag.current.y;
            setPos(clampPos(drag.current.px + dx, drag.current.py + dy, scale));
          }
        }}
        onTouchEnd={() => {
          pinch.current = null;
          drag.current = null;
        }}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: drag.current || pinch.current ? "none" : "transform .2s",
          cursor: scale > 1 ? "grab" : "zoom-in",
          maxWidth: "92vw",
          maxHeight: "92vh",
          touchAction: "none",
          userSelect: "none",
        }}
        className="select-none"
      />
    </div>
  );
}
