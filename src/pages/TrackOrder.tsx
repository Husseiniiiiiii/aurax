import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Search, Loader2, Package, CheckCircle, Truck, PackageCheck, AlertCircle, ShoppingBag, ChevronLeft, ChevronRight, Clock, XCircle } from "lucide-react";
import { api, API_ENABLED } from "../lib/api";

export default function TrackOrder() {
  const { lang } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null;

  // Scroll to top when entering/leaving detail view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedOrderId]);

  useEffect(() => {
    if (!API_ENABLED) return;
    async function fetchSavedOrders() {
      try {
        const saved = JSON.parse(localStorage.getItem("aurax_orders") || "[]");
        if (Array.isArray(saved) && saved.length > 0) {
          setLoading(true);
          // Fetch all saved orders in parallel
          const promises = saved.map(id => api.getOrder(id).catch(() => null));
          const results = await Promise.all(promises);
          // Filter out nulls (orders that might have been deleted or invalid)
          const validOrders = results.filter(o => o !== null);
          setOrders(validOrders.reverse()); // Show newest first
        }
      } catch {}
      setLoading(false);
    }
    fetchSavedOrders();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = orderId.trim();
    if (!id) return;
    if (!API_ENABLED) {
      setError(lang === "ar" ? "خدمة التتبع غير متوفرة حالياً" : "Tracking service unavailable");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.getOrder(id);
      // Check if already in orders list
      if (!orders.find(o => o.id === data.id)) {
        setOrders([data, ...orders]);
      }
      setOrderId(""); // Clear input on success
    } catch (err: any) {
      setError(lang === "ar" ? "لم يتم العثور على طلب بهذا الرقم، يرجى التأكد من الرقم والمحاولة مجدداً." : "Order not found, please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { id: "pending", labelAr: "بانتظار التأكيد", labelEn: "Pending", icon: Package },
    { id: "confirmed", labelAr: "تم التأكيد", labelEn: "Confirmed", icon: CheckCircle },
    { id: "shipped", labelAr: "قيد التوصيل", labelEn: "Shipped", icon: Truck },
    { id: "delivered", labelAr: "تم التوصيل بنجاح", labelEn: "Delivered", icon: PackageCheck },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  // Status badge config
  const statusConfig: Record<string, { labelAr: string; labelEn: string; cls: string; icon: any }> = {
    pending:   { labelAr: "بانتظار التأكيد", labelEn: "Pending",   cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",   icon: Clock },
    confirmed: { labelAr: "تم التأكيد",       labelEn: "Confirmed", cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",       icon: CheckCircle },
    shipped:   { labelAr: "قيد التوصيل",      labelEn: "Shipped",   cls: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30", icon: Truck },
    delivered: { labelAr: "تم التوصيل",       labelEn: "Delivered", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", icon: PackageCheck },
    cancelled: { labelAr: "ملغي",             labelEn: "Cancelled", cls: "bg-red-500/10 text-red-500 border-red-500/30",                            icon: XCircle },
  };

  // ─── Detail View ───
  if (selectedOrder) {
    const order = selectedOrder;
    const BackIcon = lang === "ar" ? ChevronRight : ChevronLeft;
    return (
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-4xl min-h-[70vh]">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-aurax-600 dark:text-aurax-300 hover:text-aurax-900 dark:hover:text-white transition mb-6"
        >
          <BackIcon className="h-4 w-4" />
          {lang === "ar" ? "العودة لطلباتي" : "Back to my orders"}
        </button>

        <div className="bg-white dark:bg-aurax-800/40 border border-aurax-200 dark:border-aurax-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Compact Header */}
          <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-aurax-200 dark:border-aurax-700/50">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-aurax-500 font-bold mb-0.5">
                {lang === "ar" ? "رقم الطلب" : "Order ID"}
              </div>
              <div className="text-base sm:text-lg font-black silver-text tracking-wider" dir="ltr">
                #{String(order.id).slice(-6).toUpperCase()}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-aurax-500 font-bold mb-0.5">
                {lang === "ar" ? "التاريخ" : "Date"}
              </div>
              <div className="text-xs sm:text-sm font-bold text-aurax-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" })}
                <span className="text-aurax-400 mx-1">·</span>
                {new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Status / Timeline */}
          {order.status === "cancelled" ? (
            <div className="flex items-center gap-3 py-3 px-4 bg-red-500/5 rounded-xl border border-red-500/20 mb-5">
              <div className="h-9 w-9 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-sm font-black text-red-500">
                  {lang === "ar" ? "تم إلغاء هذا الطلب" : "Order cancelled"}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5">
              {/* Current status banner */}
              {(() => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${cfg.cls} mb-4`}>
                    <StatusIcon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider opacity-70 font-bold leading-tight">
                        {lang === "ar" ? "الحالة الحالية" : "Current status"}
                      </div>
                      <div className="text-sm font-black leading-tight">
                        {lang === "ar" ? cfg.labelAr : cfg.labelEn}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Compact horizontal stepper */}
              <div className="relative">
                {/* Background line */}
                <div className="absolute top-[14px] left-3 right-3 h-0.5 bg-aurax-200 dark:bg-aurax-700 rounded-full" />
                {/* Progress line */}
                <div
                  className="absolute top-[14px] left-3 h-0.5 bg-aurax-900 dark:bg-white rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `calc((100% - 1.5rem) * ${getStepIndex(order.status) / (steps.length - 1)})`,
                  }}
                />
                <div className="flex justify-between relative z-10">
                  {steps.map((step, index) => {
                    const currentIndex = getStepIndex(order.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? "bg-aurax-900 dark:bg-white text-white dark:text-aurax-900"
                              : "bg-aurax-100 dark:bg-aurax-800 text-aurax-400 dark:text-aurax-500 border border-aurax-200 dark:border-aurax-700"
                          } ${isCurrent ? "ring-4 ring-aurax-900/10 dark:ring-white/10 scale-110" : ""}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div
                          className={`text-[10px] sm:text-[11px] font-bold text-center leading-tight px-0.5 ${
                            isCompleted ? "text-aurax-900 dark:text-white" : "text-aurax-400 dark:text-aurax-500"
                          }`}
                        >
                          {lang === "ar" ? step.labelAr : step.labelEn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products & Total */}
          <div className="bg-aurax-50 dark:bg-aurax-900/30 rounded-2xl border border-aurax-200 dark:border-aurax-700/50 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-aurax-200 dark:border-aurax-700/50 font-black text-sm text-aurax-900 dark:text-white flex items-center gap-2">
              <Package className="h-4 w-4" />
              {lang === "ar" ? "المنتجات المطلوبة" : "Ordered Items"}
            </div>
            <div className="divide-y divide-aurax-200 dark:divide-aurax-700/50">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 hover:bg-white dark:hover:bg-aurax-800/20 transition-colors">
                  {item.product?.image ? (
                    <img src={item.product.image} alt="" className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 border border-aurax-200 dark:border-aurax-700/50 shadow-sm" />
                  ) : (
                    <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl bg-aurax-100 dark:bg-aurax-800 flex items-center justify-center shrink-0 border border-aurax-200 dark:border-aurax-700/50">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-aurax-400 dark:text-aurax-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-aurax-900 dark:text-white truncate mb-1.5">
                      {item.product?.name || (lang === "ar" ? "منتج محذوف" : "Deleted Product")}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.size && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-aurax-500 bg-aurax-100 dark:bg-aurax-800 px-2 py-0.5 rounded-md border border-aurax-200 dark:border-aurax-700">
                          {lang === "ar" ? "قياس:" : "Size:"} {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-aurax-500 bg-aurax-100 dark:bg-aurax-800 px-2 py-0.5 rounded-md border border-aurax-200 dark:border-aurax-700">
                          {lang === "ar" ? "لون:" : "Color:"} {item.color}
                        </span>
                      )}
                      <span className="text-[10px] sm:text-[11px] font-bold text-aurax-500 bg-aurax-100 dark:bg-aurax-800 px-2 py-0.5 rounded-md border border-aurax-200 dark:border-aurax-700">
                        {lang === "ar" ? "الكمية:" : "Qty:"} {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-sm sm:text-base silver-text whitespace-nowrap" dir="ltr">
                      {(item.price * item.quantity).toLocaleString()} د.ع
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-aurax-800/40 p-4 sm:p-5 flex items-center justify-between gap-4 border-t border-aurax-200 dark:border-aurax-700/50">
              <div className="text-xs sm:text-sm font-bold text-aurax-500">
                {lang === "ar" ? "المبلغ الإجمالي (مع التوصيل)" : "Total (incl. shipping)"}
              </div>
              <div className="text-lg sm:text-2xl font-black text-aurax-900 dark:text-white" dir="ltr">
                {(order.total || 0).toLocaleString()} د.ع
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-aurax-500 text-center mt-6">
            {lang === "ar"
              ? "لأي استفسار يرجى التواصل معنا عبر الواتساب وتزويدنا برقم الطلب."
              : "For any inquiries, contact us via WhatsApp with your order ID."}
          </p>
        </div>
      </main>
    );
  }

  // ─── List View ───
  const ChevronRTL = lang === "ar" ? ChevronLeft : ChevronRight;

  return (
    <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-3xl min-h-[70vh]">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
          <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-aurax-900 dark:text-white" />
          {lang === "ar" ? "طلباتي" : "My Orders"}
        </h1>
        <p className="text-aurax-500 text-sm sm:text-base max-w-md mx-auto">
          {lang === "ar"
            ? "تابع حالة طلباتك ومسار الشحنات الخاصة بك."
            : "Track the status of your orders and shipments."}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto w-full mb-8">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder={lang === "ar" ? "أدخل رقم طلب لتتبعه" : "Enter order ID to track"}
          className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-24 sm:pr-28 rounded-2xl bg-white dark:bg-aurax-800/50 border-2 border-aurax-200 dark:border-aurax-700 outline-none focus:border-aurax-900 dark:focus:border-aurax-400 transition text-sm sm:text-base"
          dir="ltr"
        />
        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-aurax-400" />
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 rounded-xl bg-aurax-900 dark:bg-white text-white dark:text-aurax-900 font-bold hover:opacity-90 transition disabled:opacity-50 text-sm"
        >
          {loading && orderId ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mx-auto" /> : (lang === "ar" ? "تتبع" : "Track")}
        </button>
      </form>

      {error && (
        <div className="max-w-xl mx-auto w-full mb-6 bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="font-bold text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-aurax-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-bold">{lang === "ar" ? "جاري جلب الطلبات..." : "Fetching orders..."}</p>
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-12 sm:py-16 text-aurax-400 border-2 border-dashed border-aurax-200 dark:border-aurax-800 rounded-3xl max-w-xl mx-auto w-full">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-base sm:text-lg px-4">
            {lang === "ar" ? "لا توجد طلبات سابقة محفوظة في جهازك." : "No previous orders saved on your device."}
          </p>
          <p className="text-xs sm:text-sm mt-2 px-4">
            {lang === "ar" ? "إذا قمت بطلب مسبقاً، أدخل رقمه أعلاه للبحث عنه." : "If you ordered previously, enter its ID above to search."}
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm font-bold text-aurax-500 px-1">
            {orders.length} {lang === "ar" ? "طلب" : orders.length === 1 ? "order" : "orders"}
          </div>
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            const itemsCount = order.items?.reduce((s: number, it: any) => s + (it.quantity || 0), 0) || 0;
            const previewImages = (order.items || []).slice(0, 3).map((it: any) => it.product?.image).filter(Boolean);
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="w-full text-start bg-white dark:bg-aurax-800/40 border border-aurax-200 dark:border-aurax-700 rounded-2xl p-4 sm:p-5 hover:border-aurax-900 dark:hover:border-white hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Thumbnails stack */}
                  <div className="relative shrink-0 h-14 w-14 sm:h-16 sm:w-16">
                    {previewImages.length > 0 ? (
                      <>
                        <img src={previewImages[0]} alt="" className="absolute inset-0 h-full w-full rounded-xl object-cover border border-aurax-200 dark:border-aurax-700/50" />
                        {previewImages.length > 1 && (
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-aurax-900 dark:bg-white text-white dark:text-aurax-900 text-[10px] sm:text-xs font-black grid place-items-center border-2 border-white dark:border-aurax-900">
                            +{itemsCount}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full w-full rounded-xl bg-aurax-100 dark:bg-aurax-800 flex items-center justify-center border border-aurax-200 dark:border-aurax-700/50">
                        <Package className="h-6 w-6 text-aurax-400" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm sm:text-base font-black text-aurax-900 dark:text-white tracking-wider" dir="ltr">
                        #{String(order.id).slice(-6).toUpperCase()}
                      </span>
                      <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                        <StatusIcon className="h-3 w-3" />
                        {lang === "ar" ? cfg.labelAr : cfg.labelEn}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-aurax-500 font-bold">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" })}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {itemsCount} {lang === "ar" ? "قطعة" : "items"}
                      </span>
                    </div>
                    {/* Mobile-only status badge */}
                    <span className={`sm:hidden mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                      <StatusIcon className="h-3 w-3" />
                      {lang === "ar" ? cfg.labelAr : cfg.labelEn}
                    </span>
                  </div>

                  {/* Total + chevron */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <div className="text-sm sm:text-base font-black silver-text whitespace-nowrap" dir="ltr">
                      {(order.total || 0).toLocaleString()} د.ع
                    </div>
                    <ChevronRTL className="h-5 w-5 text-aurax-400 group-hover:text-aurax-900 dark:group-hover:text-white group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
