import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer className="mt-24 border-t border-aurax-200/70 dark:border-aurax-800 bg-aurax-50 dark:bg-aurax-900">
      <div className="container mx-auto px-4 py-14">
        {/* Credits — stacked, neatly */}
        <div
          className="text-center text-xs md:text-sm text-aurax-500 space-y-3"
          dir="ltr"
        >
          <p className="text-2xl font-normal tracking-[0.12em] brand-shine leading-none mb-6">
            AURAX
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <Link to="/track" className="font-bold text-aurax-900 dark:text-white hover:text-aurax-600 dark:hover:text-aurax-300 transition">
              {lang === "ar" ? "تتبع طلبي" : "Track Order"}
            </Link>
          </div>
          <p className="font-bold">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="font-extrabold text-aurax-700 dark:text-aurax-200">
            {t("footer.developedBy")}
          </p>
        </div>
      </div>
    </footer>
  );
}
