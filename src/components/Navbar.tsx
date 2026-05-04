import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Globe,
  Heart,
  Languages,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const { t, lang, toggleLang } = useLanguage();
  const location = useLocation();

  const NAV_LINKS = [
    { to: "/", label: t("nav.home") },
    { to: "/shop", label: t("nav.shop") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/about", label: t("nav.about") },
  ];

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        dir="ltr"
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-aurax-900/70 border-b border-aurax-200/60 dark:border-aurax-800/60"
      >
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center gap-3 md:gap-4 relative">
            {/* LEFT: قائمة + السلة */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label={t("nav.menu")}
                className="lg:hidden h-10 w-10 shrink-0 grid place-items-center rounded-xl border border-aurax-200 dark:border-aurax-700 bg-white/70 dark:bg-aurax-800/60 hover:bg-aurax-100 dark:hover:bg-aurax-700 transition"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link
                to="/cart"
                aria-label={t("nav.cart")}
                className="relative h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-aurax-900 dark:bg-white text-aurax-50 dark:text-aurax-900 hover:opacity-90 transition shadow-soft"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 grid place-items-center rounded-full bg-aurax-100 text-aurax-900 text-[10px] font-extrabold ring-2 ring-white dark:ring-aurax-900">
                    {totalItems}
                  </span>
                )}
              </Link>
              {/* اسم المتجر — جنب السلة على الكمبيوتر */}
              <div className="hidden lg:block ms-2">
                <Logo />
              </div>
            </div>

            {/* CENTER: اسم المتجر — للهاتف فقط (متمركز) */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 z-10">
              <Logo />
            </div>

            <nav
              className="hidden lg:flex flex-1 items-center justify-center gap-1 min-w-0"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-aurax-900 dark:text-white bg-aurax-100 dark:bg-aurax-800"
                        : "text-aurax-600 dark:text-aurax-300 hover:text-aurax-900 dark:hover:text-white hover:bg-aurax-100/60 dark:hover:bg-aurax-800/60"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: بحث + مفضلة + لغة (شاشات كبيرة) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ms-auto">
              <Link
                to="/search"
                aria-label={t("nav.search")}
                className="h-10 w-10 grid place-items-center rounded-xl border-2 border-aurax-400/70 dark:border-aurax-500/60 bg-gradient-to-br from-white to-aurax-100/80 dark:from-aurax-800 dark:to-aurax-900 shadow-sm hover:border-aurax-500 dark:hover:border-aurax-400 hover:shadow-md transition"
              >
                <Search className="h-5 w-5 text-aurax-700 dark:text-aurax-200" />
              </Link>

              <Link
                to="/wishlist"
                aria-label={t("nav.wishlist")}
                className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-aurax-200 dark:border-aurax-700 bg-white/70 dark:bg-aurax-800/60 hover:bg-aurax-100 dark:hover:bg-aurax-700 transition"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={toggleLang}
                aria-label={t("common.language")}
                title={lang === "ar" ? "English" : "العربية"}
                className="hidden lg:grid h-10 px-3 place-items-center rounded-xl border border-aurax-200 dark:border-aurax-700 bg-white/70 dark:bg-aurax-800/60 hover:bg-aurax-100 dark:hover:bg-aurax-700 transition text-xs font-extrabold tracking-widest"
              >
                {lang === "ar" ? "EN" : "ع"}
              </button>
            </div>
          </div>

        </div>
      </header>

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navLinks={NAV_LINKS}
      />
    </>
  );
}

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: { to: string; label: string }[];
}

function SideDrawer({ open, onClose, navLinks }: SideDrawerProps) {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`fixed top-0 left-0 z-50 h-full w-full lg:hidden bg-aurax-900 shadow-2xl transition-opacity duration-200 ease-out flex flex-col ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-aurax-200 dark:border-aurax-800">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 grid place-items-center rounded-xl hover:bg-aurax-100 dark:hover:bg-aurax-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "text-aurax-900 dark:text-white"
                      : "text-aurax-500 dark:text-aurax-400"
                  }`
                }
              >
                <span>{link.label}</span>
                <ChevronRight
                  className={`h-4 w-4 opacity-60 ${
                    lang === "ar" ? "rotate-180" : ""
                  }`}
                />
              </NavLink>
            ))}
          </div>

          <div className="my-6 border-t border-aurax-200 dark:border-aurax-800" />

          <div className="space-y-1">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-aurax-700 dark:text-aurax-200 hover:bg-aurax-100 dark:hover:bg-aurax-800 transition lg:hidden"
            >
              <Heart className="h-4 w-4" />
              {t("nav.wishlist")}
            </Link>
            <Link
              to="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-aurax-700 dark:text-aurax-200 hover:bg-aurax-100 dark:hover:bg-aurax-800 transition"
            >
              <User className="h-4 w-4" />
              {t("nav.account")}
            </Link>
          </div>

          <div className="my-6 border-t border-aurax-200 dark:border-aurax-800" />

          {/* لغة: للهاتف هنا بالكامل */}
          <div className="space-y-1">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-aurax-700 dark:text-aurax-200 hover:bg-aurax-100 dark:hover:bg-aurax-800 transition"
              >
                <span className="inline-flex items-center gap-3">
                  <Languages className="h-4 w-4" />
                  {t("common.language")}
                </span>
                <span className="inline-flex items-center gap-2 text-xs">
                  <Globe className="h-3.5 w-3.5 opacity-60" />
                  <span className="font-extrabold tracking-widest">
                    {lang === "ar" ? "العربية" : "English"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
