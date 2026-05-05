import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Search, Loader2, Package, CheckCircle, Truck, PackageCheck, AlertCircle, ShoppingBag } from "lucide-react";
import { api, API_ENABLED } from "../lib/api";

export default function TrackOrder() {
  const { lang } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl min-h-[70vh] flex flex-col justify-start">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <ShoppingBag className="h-8 w-8 text-aurax-900 dark:text-white" />
          {lang === "ar" ? "طلباتي" : "My Orders"}
        </h1>
        <p className="text-aurax-500 max-w-md mx-auto">
          {lang === "ar" 
            ? "تابع حالة طلباتك ومسار الشحنات الخاصة بك."
            : "Track the status of your orders and shipments."}
        </p>
      </div>

      {/* Show search form always, but maybe visually secondary if orders exist */}
      <form onSubmit={handleSearch} className={`relative max-w-xl mx-auto w-full transition-all ${orders.length > 0 ? "mb-12 opacity-80 hover:opacity-100" : "mb-12"}`}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder={lang === "ar" ? "أدخل رقم طلب آخر لتتبعه (مثال: cm0d...)" : "Enter another order ID to track (e.g. cm0d...)"}
          className="w-full h-14 pl-14 pr-4 rounded-2xl bg-white dark:bg-aurax-800/50 border-2 border-aurax-200 dark:border-aurax-700 outline-none focus:border-aurax-900 dark:focus:border-aurax-400 transition text-sm sm:text-base"
          dir="ltr"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-aurax-400" />
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 rounded-xl bg-aurax-900 dark:bg-white text-white dark:text-aurax-900 font-bold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading && orderId ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (lang === "ar" ? "تتبع" : "Track")}
        </button>
      </form>

      {error && (
        <div className="max-w-xl mx-auto w-full mb-8 bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="font-bold text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-aurax-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-bold">{lang === "ar" ? "جاري جلب الطلبات..." : "Fetching orders..."}</p>
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-16 text-aurax-400 border-2 border-dashed border-aurax-200 dark:border-aurax-800 rounded-3xl max-w-xl mx-auto w-full">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-lg">{lang === "ar" ? "لا توجد طلبات سابقة محفوظة في جهازك." : "No previous orders saved on your device."}</p>
          <p className="text-sm mt-2">{lang === "ar" ? "إذا قمت بطلب مسبقاً، أدخل رقمه أعلاه للبحث عنه." : "If you ordered previously, enter its ID above to search."}</p>
        </div>
      )}

      <div className="space-y-8">
        {orders.map((order, orderIndex) => (
          <div key={order.id} className="w-full bg-white dark:bg-aurax-800/40 border border-aurax-200 dark:border-aurax-700 rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${orderIndex * 100}ms` }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-aurax-200 dark:border-aurax-700/50 pb-6 mb-8">
              <div>
                <div className="text-sm text-aurax-500 font-bold mb-1">
                  {lang === "ar" ? "رقم الطلب" : "Order ID"}
                </div>
                <div className="text-xl font-black silver-text uppercase tracking-wider bg-aurax-50 dark:bg-aurax-900/50 px-3 py-1 rounded-lg inline-block border border-aurax-100 dark:border-aurax-700/50" dir="ltr">
                  #{String(order.id).slice(-6)}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-sm text-aurax-500 font-bold mb-1">
                  {lang === "ar" ? "تاريخ الطلب" : "Order Date"}
                </div>
                <div className="text-base font-bold text-aurax-900 dark:text-white flex items-center gap-2">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric", month: "short", day: "2-digit"
                  })}
                  <span className="text-xs text-aurax-400 bg-aurax-50 dark:bg-aurax-900/50 px-2 py-0.5 rounded border border-aurax-100 dark:border-aurax-700/50">
                    {new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {order.status === "cancelled" ? (
              <div className="text-center py-6 bg-red-500/5 rounded-2xl border border-red-500/10 mb-8">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-red-500 mb-1">
                  {lang === "ar" ? "تم إلغاء هذا الطلب" : "This order has been cancelled"}
                </h3>
              </div>
            ) : (
              <div className="relative pt-4 pb-12 md:px-4">
                {/* Connecting line */}
                <div className="absolute top-[34px] left-[10%] right-[10%] h-1 bg-aurax-200 dark:bg-aurax-700 rounded-full hidden md:block" />
                
                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                  {steps.map((step, index) => {
                    const currentIndex = getStepIndex(order.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 relative">
                        {/* Mobile line connection */}
                        {index !== steps.length - 1 && (
                          <div className="absolute top-[40px] left-[19px] bottom-[-40px] w-0.5 bg-aurax-200 dark:bg-aurax-700 md:hidden" />
                        )}
                        {index !== steps.length - 1 && isCompleted && index < currentIndex && (
                          <div className="absolute top-[40px] left-[19px] bottom-[-40px] w-0.5 bg-aurax-900 dark:bg-white md:hidden z-10" />
                        )}
                        
                        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 relative z-20 ${
                          isCompleted 
                            ? "bg-aurax-900 dark:bg-white text-white dark:text-aurax-900 shadow-lg shadow-aurax-900/20 dark:shadow-white/20" 
                            : "bg-aurax-100 dark:bg-aurax-800 text-aurax-400 dark:text-aurax-500"
                        } ${isCurrent ? "scale-110 ring-4 ring-aurax-900/10 dark:ring-white/10" : ""}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="md:text-center">
                          <div className={`font-bold text-sm ${isCompleted ? "text-aurax-900 dark:text-white" : "text-aurax-400 dark:text-aurax-500"}`}>
                            {lang === "ar" ? step.labelAr : step.labelEn}
                          </div>
                          {isCurrent && (
                            <div className="text-[11px] font-bold text-aurax-500 mt-1">
                              {lang === "ar" ? "الحالة الحالية" : "Current Status"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Desktop progressive line */}
                <div 
                  className="absolute top-[34px] left-[10%] h-1 bg-aurax-900 dark:bg-white rounded-full hidden md:block transition-all duration-700 ease-out" 
                  style={{ width: `${(getStepIndex(order.status) / (steps.length - 1)) * 80}%` }}
                />
              </div>
            )}

            {/* Products List & Total */}
            <div className="mt-2 bg-aurax-50 dark:bg-aurax-900/30 rounded-2xl border border-aurax-200 dark:border-aurax-700/50 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-aurax-200 dark:border-aurax-700/50 font-black text-sm text-aurax-900 dark:text-white flex items-center gap-2">
                <Package className="h-4 w-4" />
                {lang === "ar" ? "المنتجات المطلوبة" : "Ordered Items"}
              </div>
              <div className="divide-y divide-aurax-200 dark:divide-aurax-700/50">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 sm:p-5 hover:bg-white dark:hover:bg-aurax-800/20 transition-colors">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt=""
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 border border-aurax-200 dark:border-aurax-700/50 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-aurax-100 dark:bg-aurax-800 flex items-center justify-center shrink-0 border border-aurax-200 dark:border-aurax-700/50">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-aurax-400 dark:text-aurax-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-aurax-900 dark:text-white truncate mb-1.5">{item.product?.name || (lang === "ar" ? "منتج محذوف" : "Deleted Product")}</div>
                      <div className="flex flex-wrap items-center gap-2">
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
                    <div className="text-left sm:text-right">
                      <div className="font-black text-sm sm:text-base silver-text whitespace-nowrap" dir="ltr">
                        {(item.price * item.quantity).toLocaleString()} د.ع
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-aurax-800/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-aurax-200 dark:border-aurax-700/50">
                <div className="text-sm font-bold text-aurax-500">
                  {lang === "ar" ? "المبلغ الإجمالي (مع التوصيل)" : "Total Amount (incl. shipping)"}
                </div>
                <div className="text-xl sm:text-2xl font-black text-aurax-900 dark:text-white" dir="ltr">
                  {(order.total || 0).toLocaleString()} د.ع
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-sm text-aurax-500">
            {lang === "ar" 
              ? "لأي استفسار يرجى التواصل معنا عبر الواتساب وتزويدنا برقم الطلب المعني." 
              : "For any inquiries, please contact us via WhatsApp with your relevant order ID."}
          </p>
        </div>
      )}
    </main>
  );
}
