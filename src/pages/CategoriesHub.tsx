import GenderCircleLink from "../components/GenderCircleLink";
import { useLanguage } from "../context/LanguageContext";
import { categories } from "../data/products";

export default function CategoriesHub() {
  const { t, lang } = useLanguage();
  const women = categories.find((c) => c.id === "women")!;
  const men = categories.find((c) => c.id === "men")!;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="text-xs font-bold tracking-widest text-aurax-500 uppercase">
          {t("categories.eyebrow")}
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-black silver-text">
          {t("categories.title")}
        </h1>
        <p className="mt-3 text-aurax-500 max-w-2xl mx-auto">
          {t("categories.desc")}
        </p>
      </div>

      <div
        className={`flex flex-row flex-nowrap items-center justify-center gap-10 sm:gap-12 md:gap-20 max-w-3xl mx-auto w-full ${
          lang === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <GenderCircleLink
          to="/categories/women"
          image={women.image}
          label={t("categories.sectionWomen")}
          ariaLabel={t("categories.sectionWomen")}
          size="hub"
        />
        <GenderCircleLink
          to="/categories/men"
          image={men.image}
          label={t("categories.sectionMen")}
          ariaLabel={t("categories.sectionMen")}
          size="hub"
        />
      </div>
    </main>
  );
}
