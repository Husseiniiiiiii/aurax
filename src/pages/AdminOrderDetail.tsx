import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Calendar, User, Phone, MapPin, Package, CheckCircle, Truck, PackageCheck, XCircle } from "lucide-react";
import { api } from "../lib/api";

const statusConfig: Record<string, any> = {
  pending: { color: "bg-aurax-500/20 text-aurax-400 border-aurax-500/30", label: "بانتظار التأكيد", icon: <Package className="w-3 h-3" /> },
  confirmed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "مؤكد", icon: <CheckCircle className="w-3 h-3" /> },
  shipped: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "تم الشحن", icon: <Truck className="w-3 h-3" /> },
  delivered: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "تم التوصيل", icon: <PackageCheck className="w-3 h-3" /> },
  cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "ملغي", icon: <XCircle className="w-3 h-3" /> },
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err: any) {
        setError("لم يتم العثور على الطلب أو حدث خطأ أثناء التحميل.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  async function updateStatus(newStatus: string) {
    if (!order) return;
    try {
      await api.updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("حدث خطأ أثناء تحديث حالة الطلب");
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-10 pb-24 max-w-4xl" dir="rtl">
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="h-4 w-32 rounded-md bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />

          {/* Header skeleton */}
          <div className="rounded-xl border border-aurax-700 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aurax-700/50 pb-4">
              <div className="space-y-2">
                <div className="h-5 w-44 rounded-md bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
                <div className="h-3 w-56 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
              </div>
              <div className="h-7 w-28 rounded-full bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-lg border border-aurax-700/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-aurax-700/50">
                    <div className="h-3 w-32 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
                    <div className="h-4 w-2/3 rounded-md bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
                    <div className="h-3 w-20 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
                    <div className="h-4 w-1/2 rounded-md bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items skeleton */}
          <div className="rounded-xl border border-aurax-700 p-5 space-y-4">
            <div className="h-3 w-40 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer pb-3 border-b border-aurax-700/50" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-aurax-700/50 p-3">
                  <div className="h-12 w-12 rounded bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 rounded bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
                    <div className="h-3 w-1/3 rounded bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
                  </div>
                  <div className="h-4 w-20 rounded bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-aurax-700/50 p-4 space-y-2">
              <div className="h-3 w-full rounded bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
              <div className="h-3 w-full rounded bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
              <div className="h-5 w-2/3 rounded bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer mt-2" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="rounded-xl border border-aurax-700 p-5 flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 rounded-lg bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-4xl flex flex-col items-center justify-center gap-4" dir="rtl">
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="font-bold">{error || "الطلب غير موجود"}</p>
        <button onClick={() => navigate("/admin")} className="btn-outline">
          العودة للوحة التحكم
        </button>
      </main>
    );
  }

  const status = order.status || "pending";
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 pb-24 max-w-4xl" dir="rtl">
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 text-sm font-bold text-aurax-400 hover:text-white transition"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للطلبات
        </button>

        {/* Header Outline */}
        <div className="rounded-xl border border-aurax-700 p-5 space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-aurax-700/50 pb-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <FileText className="h-5 w-5 text-aurax-400" />
                طلب #{String(order.id).slice(-6).toUpperCase()}
              </h2>
              <div className="text-xs text-aurax-500 flex items-center gap-1.5 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold text-xs ${config.color}`}>
              {config.icon}
              {config.label}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {/* Customer Info */}
            <div className="border border-aurax-700/50 rounded-lg overflow-hidden flex flex-col">
              <h3 className="text-xs font-extrabold text-aurax-400 uppercase tracking-wider flex items-center gap-1.5 px-4 py-3 border-b border-aurax-700/50">
                <User className="h-4 w-4" /> معلومات العميل
              </h3>
              <div className="p-4 space-y-3 text-sm flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-aurax-500 text-xs">الاسم</span>
                  <span className="font-bold text-base">{order.customerName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-aurax-500 text-xs">رقم الهاتف</span>
                  <a href={`tel:${order.phone}`} className="font-bold text-base text-blue-400 hover:text-blue-300 hover:underline inline-flex w-fit items-center gap-1.5 transition" dir="ltr">
                    <Phone className="h-3 w-3" />
                    {order.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="border border-aurax-700/50 rounded-lg overflow-hidden flex flex-col">
              <h3 className="text-xs font-extrabold text-aurax-400 uppercase tracking-wider flex items-center gap-1.5 px-4 py-3 border-b border-aurax-700/50">
                <MapPin className="h-4 w-4" /> عنوان التوصيل
              </h3>
              <div className="p-4 space-y-3 text-sm flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-aurax-500 text-xs">المحافظة</span>
                  <span className="font-bold text-base">{order.city}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-aurax-500 text-xs">العنوان التفصيلي</span>
                  <span className="font-bold text-sm leading-relaxed">{order.address}</span>
                </div>
                {order.notes && (
                  <div className="flex flex-col gap-1 pt-3 mt-1 border-t border-aurax-700/50">
                    <span className="text-aurax-500 text-xs">ملاحظات الزبون</span>
                    <span className="font-bold text-sm text-yellow-400">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items Outline */}
        <div className="rounded-xl border border-aurax-700 p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-aurax-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-aurax-700/50 pb-3">
            <Package className="h-4 w-4" /> المنتجات ({order.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 border border-aurax-700/50 rounded-lg p-3">
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover shrink-0 border border-aurax-700/50"
                  />
                ) : (
                  <div className="h-12 w-12 rounded flex items-center justify-center shrink-0 border border-aurax-700/50">
                    <Package className="h-5 w-5 text-aurax-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{item.product?.name || "منتج محذوف"}</div>
                  <div className="text-xs text-aurax-500 flex gap-2 mt-1">
                    {item.size && <span>القياس: {item.size}</span>}
                    {item.color && <span>اللون: <span dir="ltr">{item.color}</span></span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-aurax-400 mb-0.5">الكمية: {item.quantity}</div>
                  <div className="font-bold text-sm whitespace-nowrap" dir="ltr">
                    {(item.price * item.quantity).toLocaleString()} د.ع
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-4 mt-4 space-y-2 text-sm border border-aurax-700/50">
            <div className="flex justify-between text-aurax-400">
              <span>المجموع الفرعي</span>
              <span dir="ltr">{(order.subtotal || 0).toLocaleString()} د.ع</span>
            </div>
            <div className="flex justify-between text-aurax-400 pb-2 border-b border-aurax-700/50">
              <span>أجور التوصيل</span>
              <span dir="ltr">{(order.shipping || 5000).toLocaleString()} د.ع</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-black">المبلغ الإجمالي</span>
              <span className="font-black text-lg silver-text" dir="ltr">
                {(order.total || 0).toLocaleString()} د.ع
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-xl border border-aurax-700 p-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="text-xs font-bold text-aurax-400">تغيير حالة الطلب:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusConfig).map(([s, conf]) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                  status === s
                    ? conf.color + " ring-2 ring-white/20"
                    : "border-aurax-700 text-aurax-400 hover:border-aurax-500 hover:text-white"
                }`}
              >
                {conf.icon}
                {conf.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
