import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { api, API_ENABLED, type ApiCategory } from "../lib/api";
import { formatIqd } from "../utils/currency";

export default function Home() {
  const { t, lang } = useLanguage();
  const { products, loading } = useProducts();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(API_ENABLED);

  useEffect(() => {
    if (!API_ENABLED) return;
    api
      .listCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCatsLoading(false));
  }, []);

  // Only show products explicitly marked as featured — never auto-fill.
  const featured = useMemo(() => {
    return products.filter((p: any) => p.featured).slice(0, 8);
  }, [products]);

  /* Find the main "homepage section" categories (gender = "men" / "women") */
  const homeSections = categories.filter(
    (c) => c.gender === "men" || c.gender === "women"
  );

  return (
    <main
      className="overflow-x-hidden pt-8 md:pt-10 pb-12 md:pb-16"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* ——— Brand name ——— */}
      <header className="container mx-auto px-4 text-center mt-8 md:mt-12">
        <h1
          className="silver-text font-normal tracking-[0.15em] leading-none brand-shine inline-block"
          style={{ fontSize: "clamp(2.75rem, 12vw, 6rem)" }}
        >
          Aura-x
        </h1>
      </header>

      {/* ——— Gender section circles (shimmer while loading) ——— */}
      {catsLoading ? (
        <section className="container mx-auto px-4 mt-12 md:mt-16">
          <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-20">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-full max-w-[200px] sm:max-w-[240px]">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer ring-[3px] ring-aurax-300/40 dark:ring-aurax-700/40 ring-offset-4 ring-offset-aurax-50 dark:ring-offset-aurax-900" />
                <div className="h-4 w-20 sm:w-24 rounded-full bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer" />
              </div>
            ))}
          </div>
        </section>
      ) : homeSections.length > 0 ? (
        <section className="container mx-auto px-4 mt-12 md:mt-16">
          <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-20">
            {homeSections.map((section) => (
              <Link
                key={section.id}
                to={`/categories/${section.gender}`}
                className="group flex flex-col items-center gap-4 w-full max-w-[200px] sm:max-w-[240px]"
              >
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-[3px] ring-aurax-300/80 dark:ring-aurax-600/70 shadow-glow ring-offset-4 ring-offset-aurax-50 dark:ring-offset-aurax-900 transition-all duration-500 group-hover:ring-aurax-500 dark:group-hover:ring-aurax-400 group-hover:scale-[1.04]">
                  {section.image ? (
                    <img
                      src={section.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-aurax-200 dark:bg-aurax-800 flex items-center justify-center">
                      <span className="text-5xl opacity-30">
                        {section.gender === "women" ? "👗" : "👔"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-aurax-900/70 via-transparent to-transparent" />
                </div>
                <span className="text-center font-extrabold tracking-wide text-sm sm:text-base md:text-lg">
                  {lang === "ar" ? section.name : section.nameEn}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ——— Featured carousel ——— */}
      <section className="container mx-auto px-4 mt-12 md:mt-16">
        {loading && featured.length === 0 ? (
          <CarouselSkeleton />
        ) : featured.length > 0 ? (
          <SwipeCarousel products={featured} />
        ) : null}
      </section>
    </main>
  );
}

function CarouselSkeleton() {
  // Mirror the real peek-carousel proportions: SLIDE_W 78% + GAP 2% → side peeks ~11%.
  return (
    <div className="max-w-2xl mx-auto select-none" dir="ltr">
      <div className="relative overflow-hidden">
        <div className="flex items-stretch">
          {/* peek-left (shrunken/dimmed like inactive slide) */}
          <div
            className="shrink-0 aspect-[16/10] scale-95 opacity-60"
            style={{ width: "11%", marginRight: "2%" }}
          >
            <div className="h-full w-full rounded-2xl bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer ring-1 ring-aurax-200/60 dark:ring-aurax-700/60" />
          </div>

          {/* active center */}
          <div
            className="shrink-0 aspect-[16/10]"
            style={{ width: "78%", marginRight: "2%" }}
          >
            <div className="relative h-full w-full rounded-2xl bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer ring-1 ring-aurax-200/60 dark:ring-aurax-700/60 shadow-soft">
              {/* fake bottom caption block */}
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 space-y-2 bg-gradient-to-t from-black/40 to-transparent">
                <div className="h-3 md:h-4 w-2/3 rounded bg-aurax-300/70 dark:bg-aurax-700/80 overflow-hidden shimmer" />
                <div className="h-2.5 md:h-3 w-1/3 rounded bg-aurax-300/60 dark:bg-aurax-700/70 overflow-hidden shimmer" />
              </div>
            </div>
          </div>

          {/* peek-right */}
          <div
            className="shrink-0 aspect-[16/10] scale-95 opacity-60"
            style={{ width: "11%" }}
          >
            <div className="h-full w-full rounded-2xl bg-aurax-200 dark:bg-aurax-800 overflow-hidden shimmer ring-1 ring-aurax-200/60 dark:ring-aurax-700/60" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        <div className="h-1.5 w-6 rounded-full bg-aurax-900 dark:bg-white overflow-hidden shimmer" />
        <div className="h-1.5 w-1.5 rounded-full bg-aurax-300 dark:bg-aurax-600" />
        <div className="h-1.5 w-1.5 rounded-full bg-aurax-300 dark:bg-aurax-600" />
        <div className="h-1.5 w-1.5 rounded-full bg-aurax-300 dark:bg-aurax-600" />
      </div>
    </div>
  );
}

function SwipeCarousel({ products }: { products: Array<any> }) {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0); // pixels currently being dragged
  const [animate, setAnimate] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startedAt = useRef(0);

  const n = products.length;
  // Auto-advance — bounce back to 0 when reaching end (no wrap-sweep)
  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      if (startX.current === null) {
        setIdx((i) => {
          const next = i + 1;
          if (next >= n) {
            // Snap back to 0 without animation
            setAnimate(false);
            requestAnimationFrame(() => setAnimate(true));
            return 0;
          }
          setAnimate(true);
          return next;
        });
      }
    }, 4000);
    return () => clearInterval(id);
  }, [n]);

  const goTo = (i: number) => {
    setAnimate(true);
    // Clamp instead of wrap so user never sees empty space.
    setIdx(Math.max(0, Math.min(n - 1, i)));
  };

  // Pointer (touch + mouse) handlers — translate the track while dragging.
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startedAt.current = Date.now();
    setAnimate(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    setDrag(dx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const width = trackRef.current?.clientWidth || 1;
    const dx = e.clientX - startX.current;
    const dt = Math.max(1, Date.now() - startedAt.current);
    const velocity = Math.abs(dx / dt); // px per ms
    const ratio = Math.abs(dx) / width;
    const passed = ratio > 0.18 || velocity > 0.5;
    startX.current = null;
    setDrag(0);
    setAnimate(true);
    if (passed) {
      // RTL feels natural when swipe-left moves to next; in LTR same.
      if (dx < 0) goTo(idx + 1);
      else goTo(idx - 1);
    }
  };

  // Peek layout: each slide takes ~78% of track width; centered with partial neighbors visible.
  const SLIDE_W = 78; // percent of viewport
  const GAP = 2; // percent
  const STEP = SLIDE_W + GAP;
  const centerOffset = (100 - SLIDE_W) / 2;
  const baseShift = centerOffset - idx * STEP;
  const dragPct = trackRef.current
    ? (drag / trackRef.current.clientWidth) * 100
    : 0;
  const totalShift = baseShift + dragPct;

  return (
    <div className="max-w-2xl mx-auto select-none" dir="ltr">
      <div
        ref={trackRef}
        className="relative overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className={`flex ${animate ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ transform: `translate3d(${totalShift}%, 0, 0)` }}
        >
          {products.map((p, i) => {
            const name = lang === "ar" ? p.name : p.nameEn;
            const isActive = i === idx;
            return (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={(e) => {
                  if (Math.abs(drag) > 6) e.preventDefault();
                  if (!isActive) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                draggable={false}
                className="relative shrink-0 block"
                style={{
                  width: `${SLIDE_W}%`,
                  marginInlineEnd: `${GAP}%`,
                }}
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-aurax-100 dark:bg-aurax-800 ring-1 ring-aurax-200/60 dark:ring-aurax-700/60 shadow-soft transition-all duration-500 ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-60"
                  }`}
                >
                  <img
                    src={p.image}
                    alt={name}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                    <div className="text-base md:text-lg font-black line-clamp-1">
                      {name}
                    </div>
                    <div
                      className="mt-0.5 text-xs md:text-sm font-extrabold silver-text inline-block"
                      dir="ltr"
                    >
                      {formatIqd(p.price, lang)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {n > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx
                  ? "w-6 bg-aurax-900 dark:bg-white"
                  : "w-1.5 bg-aurax-300 dark:bg-aurax-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
