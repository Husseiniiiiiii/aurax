import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/products";
import GenderCircleLink from "../components/GenderCircleLink";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { formatIqd } from "../utils/currency";

export default function Home() {
  const { t, lang } = useLanguage();
  const women = categories.find((c) => c.id === "women")!;
  const men = categories.find((c) => c.id === "men")!;
  const { products } = useProducts();

  return (
    <main
      className="overflow-x-hidden pt-8 md:pt-10 pb-12 md:pb-16"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <header className="container mx-auto px-4 text-center mt-8 md:mt-12">
        <h1
          className="silver-text font-normal tracking-[0.15em] leading-none brand-shine inline-block"
          style={{ fontSize: "clamp(2.75rem, 12vw, 6rem)" }}
        >
          AURAX
        </h1>
      </header>

      <section className="container mx-auto px-4 mt-16 md:mt-20">
        <div
          className={`flex flex-row flex-nowrap items-center justify-center gap-6 sm:gap-10 md:gap-16 max-w-3xl mx-auto w-full ${
            lang === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <GenderCircleLink
            to="/categories/women"
            image={women.image}
            label={t("categories.sectionWomen")}
            ariaLabel={t("categories.sectionWomen")}
          />
          <GenderCircleLink
            to="/categories/men"
            image={men.image}
            label={t("categories.sectionMen")}
            ariaLabel={t("categories.sectionMen")}
          />
        </div>
      </section>

      {products.length > 0 && (
        <section className="container mx-auto px-4 mt-16 md:mt-24">
          <FeaturedCarousel products={products.slice(0, 8)} />
        </section>
      )}
    </main>
  );
}

function FeaturedCarousel({ products }: { products: Array<any> }) {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % products.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, [products.length]);

  const p = products[idx];
  if (!p) return null;
  const name = lang === "ar" ? p.name : p.nameEn;

  return (
    <div className="max-w-md mx-auto">
      <Link
        to={`/product/${p.id}`}
        className="block relative overflow-hidden rounded-3xl aspect-[4/5] bg-aurax-100 dark:bg-aurax-800 ring-1 ring-aurax-200/60 dark:ring-aurax-700/60 shadow-soft hover:shadow-glow transition"
      >
        <img
          src={p.image}
          alt={name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-lg md:text-xl font-black line-clamp-1">
            {name}
          </div>
          <div
            className="mt-1 text-sm font-extrabold silver-text inline-block"
            dir="ltr"
          >
            {formatIqd(p.price, lang)}
          </div>
        </div>
      </Link>

      {products.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`slide ${i + 1}`}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setIdx(i);
                  setFade(true);
                }, 200);
              }}
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
