import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  User,
  FileText,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { formatIqd, toIqd } from "../utils/currency";
import { api, API_ENABLED } from "../lib/api";
import { IRAQ_PROVINCES } from "../data/provinces";

const inputCls =
  "w-full rounded-xl bg-aurax-100/60 dark:bg-aurax-800/60 border border-aurax-200 dark:border-aurax-700 px-4 py-3 text-[15px] font-medium placeholder:text-aurax-400 dark:placeholder:text-aurax-500 focus:border-aurax-900 dark:focus:border-white focus:outline-none transition";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartStale, setCartStale] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotalIqd = toIqd(subtotal);
  const shippingIqd = 5000;
  const totalIqd = subtotalIqd + shippingIqd;
  const currency = lang === "ar" ? "د.ع" : "IQD";

  // Phone validation: Iraqi number must be 11 digits starting with 07
  const isPhoneValid = /^07\d{9}$/.test(phone.replace(/[\s-]/g, ""));

  if (items.length === 0 && !success) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black">
          {lang === "ar" ? "السلة فارغة" : "Cart is empty"}
        </h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          {lang === "ar" ? "تصفّح المتجر" : "Browse shop"}
        </Link>
      </main>
    );
  }

  if (success) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl md:text-4xl font-black">
          {lang === "ar" ? "تم إرسال طلبك بنجاح! ✨" : "Order placed successfully! ✨"}
        </h1>
        <p className="mt-3 text-aurax-500 max-w-md mx-auto">
          {lang === "ar"
            ? "سيتم التواصل معك قريباً لتأكيد الطلب. شكراً لاختيارك AURAX!"
            : "We'll contact you soon to confirm your order. Thank you for choosing AURAX!"}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="btn-primary inline-flex">
            {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
          </Link>
          <Link to="/track" className="btn-outline inline-flex text-aurax-900 dark:text-white border-aurax-300 dark:border-aurax-600">
            {lang === "ar" ? "تتبع طلبك الآن" : "Track your order"}
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError(lang === "ar" ? "الرجاء إدخال الاسم" : "Name is required");
    if (!isPhoneValid)
      return setError(
        lang === "ar" ? "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 07" : "Phone must be 11 digits starting with 07"
      );
    if (!province) return setError(lang === "ar" ? "الرجاء اختيار المحافظة" : "Province is required");
    if (!address.trim()) return setError(lang === "ar" ? "الرجاء إدخال العنوان" : "Address is required");

    setSubmitting(true);
    try {
      if (API_ENABLED) {
        const order = await api.createOrder({
          customerName: name.trim(),
          phone: phone.replace(/[\s-]/g, ""),
          city: province,
          address: address.trim(),
          notes: notes.trim() || undefined,
          items: items.map((item) => ({
            productId: item.product.apiId || item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
          })),
        });
        
        // Save to localStorage for auto-tracking
        if (order && order.id) {
          try {
            const saved = JSON.parse(localStorage.getItem("aurax_orders") || "[]");
            saved.push(order.id);
            localStorage.setItem("aurax_orders", JSON.stringify(saved));
          } catch {}
        }
      }

      // Send local notification to admin (if permission granted)
      try {
        if (Notification.permission === "granted") {
          new Notification("🛒 طلب جديد — AURAX", {
            body: `${name} — ${province}\nالمجموع: ${totalIqd.toLocaleString()} ${currency}`,
            icon: "/favicon.svg",
            tag: "new-order",
          });
        }
      } catch {}

      clearCart();
      setSuccess(true);
    } catch (e: any) {
      const msg: string = e.message || "";
      // Detect stale cart (product no longer exists in DB)
      if (msg.includes("غير موجودة") || msg.includes("Invalid product") || msg.includes("Foreign key")) {
        setCartStale(true);
        setError(null);
      } else {
        setError(msg || (lang === "ar" ? "حدث خطأ" : "Something went wrong"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Back link */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-bold text-aurax-500 hover:text-aurax-900 dark:hover:text-white mb-6 transition"
      >
        <Arrow className="h-4 w-4" />
        {lang === "ar" ? "العودة للسلة" : "Back to cart"}
      </Link>

      <h1 className="text-3xl md:text-4xl font-black mb-8">
        {lang === "ar" ? "إتمام الطلب" : "Checkout"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Form fields */}
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold">
                <User className="h-4 w-4 text-aurax-500" />
                {lang === "ar" ? "الاسم الكامل" : "Full name"}
                <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "ar" ? "أحمد محمد" : "Ahmed Mohammed"}
                className={inputCls}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold">
                <Phone className="h-4 w-4 text-aurax-500" />
                {lang === "ar" ? "رقم الهاتف" : "Phone number"}
                <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))}
                placeholder="07XXXXXXXXX"
                className={`${inputCls} ${phone && !isPhoneValid ? "border-red-400 focus:border-red-400" : ""}`}
                dir="ltr"
              />
              {phone && !isPhoneValid && (
                <p className="text-[11px] text-red-400">
                  {lang === "ar" ? "يجب أن يبدأ بـ 07 ويكون 11 رقم" : "Must start with 07 and be 11 digits"}
                </p>
              )}
            </div>

            {/* Province */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-aurax-500" />
                {lang === "ar" ? "المحافظة" : "Province"}
                <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputCls}
              >
                <option value="">
                  {lang === "ar" ? "— اختر المحافظة —" : "— Select province —"}
                </option>
                {IRAQ_PROVINCES.map((p) => (
                  <option key={p.id} value={p.ar}>
                    {lang === "ar" ? p.ar : p.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-aurax-500" />
                {lang === "ar" ? "العنوان التفصيلي" : "Detailed address"}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "المنطقة، الشارع، أقرب نقطة دالة..."
                    : "Area, street, nearest landmark..."
                }
                className={`${inputCls} min-h-[80px] resize-y`}
                rows={3}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold">
                <FileText className="h-4 w-4 text-aurax-500" />
                {lang === "ar" ? "ملاحظات" : "Notes"}
                <span className="text-aurax-400 text-xs font-normal">
                  ({lang === "ar" ? "اختياري" : "optional"})
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "أي ملاحظات إضافية للتوصيل..."
                    : "Any additional delivery notes..."
                }
                className={`${inputCls} min-h-[60px] resize-y`}
                rows={2}
              />
            </div>

            {cartStale && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-orange-400">
                  ⚠️ {lang === "ar"
                    ? "بعض المنتجات في سلتك لم تعد متوفرة أو تم تحديثها."
                    : "Some products in your cart are no longer available."}
                </p>
                <p className="text-xs text-orange-300/80">
                  {lang === "ar"
                    ? "يرجى تفريغ السلة وإضافة المنتجات من جديد من المتجر."
                    : "Please clear your cart and add the products again from the shop."}
                </p>
                <button
                  type="button"
                  onClick={() => { clearCart(); navigate("/shop"); }}
                  className="text-xs font-extrabold px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition"
                >
                  🗑️ {lang === "ar" ? "تفريغ السلة والذهاب للمتجر" : "Clear cart & go to shop"}
                </button>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                {error}
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <aside className="card p-6 h-fit lg:sticky lg:top-28 space-y-4">
            <h3 className="text-xl font-extrabold">
              {lang === "ar" ? "ملخص الطلب" : "Order summary"}
            </h3>

            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id + (item.size ?? "")}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">
                      {lang === "ar" ? item.product.name : item.product.nameEn}
                    </div>
                    <div className="text-[11px] text-aurax-500">
                      x{item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold whitespace-nowrap" dir="ltr">
                    {formatIqd(item.product.price * item.quantity, lang)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-aurax-200 dark:border-aurax-700 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-aurax-500">
                  {lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
                </span>
                <span className="font-bold whitespace-nowrap" dir="ltr">
                  {subtotalIqd.toLocaleString("en-US")} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurax-500">
                  {lang === "ar" ? "التوصيل" : "Shipping"}
                </span>
                <span className="font-bold whitespace-nowrap" dir="ltr">
                  {shippingIqd.toLocaleString("en-US")} {currency}
                </span>
              </div>
              <div className="border-t border-aurax-200 dark:border-aurax-700 pt-2 flex justify-between text-base">
                <span className="font-bold">
                  {lang === "ar" ? "الإجمالي" : "Total"}
                </span>
                <span className="font-black text-lg silver-text whitespace-nowrap" dir="ltr">
                  {totalIqd.toLocaleString("en-US")} {currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {submitting
                ? lang === "ar"
                  ? "جاري الإرسال..."
                  : "Submitting..."
                : lang === "ar"
                ? "إتمام الطلب"
                : "Place order"}
            </button>
          </aside>
        </div>
      </form>
    </main>
  );
}
