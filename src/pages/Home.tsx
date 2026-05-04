import { categories } from "../data/products";
import GenderCircleLink from "../components/GenderCircleLink";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t, lang } = useLanguage();
  const women = categories.find((c) => c.id === "women")!;
  const men = categories.find((c) => c.id === "men")!;

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

      <section className="container mx-auto px-4 mt-32 md:mt-40">
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
    </main>
  );
}
