import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CategoriesHub from "./pages/CategoriesHub";
import CategoryAisle from "./pages/CategoryAisle";
import About from "./pages/About";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.14] saturate-[0.92] dark:opacity-[0.17] dark:saturate-100"
        style={{ backgroundImage: "url(/sa.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/84 to-aurax-50/94 dark:from-aurax-900/91 dark:via-aurax-900/86 dark:to-aurax-900/93" />
      <div className="absolute inset-0 bg-aurax-900/[0.02] dark:bg-black/25" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative isolate min-h-screen flex flex-col bg-aurax-50 dark:bg-aurax-900 text-aurax-900 dark:text-aurax-100">
      <AppBackdrop />
      <ScrollToTop />
      <Navbar />
      <div className="relative z-0 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<CategoriesHub />} />
          <Route path="/categories/:aisle" element={<CategoryAisle />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
