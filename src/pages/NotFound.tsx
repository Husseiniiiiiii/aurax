import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="container mx-auto px-4 py-24 text-center">
      <div className="text-[8rem] md:text-[12rem] font-black silver-text leading-none">
        404
      </div>
      <h1 className="text-3xl md:text-4xl font-black mt-2">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 text-aurax-500 max-w-md mx-auto">
        {t("notFound.desc")}
      </p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        <Home className="h-4 w-4" />
        {t("common.backHome")}
      </Link>
    </main>
  );
}
