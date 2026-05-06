import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, Truck, PackageCheck, XCircle, Bell, Loader2, MapPin, Calendar, ClipboardList, ArrowLeft, Trash2 } from "lucide-react";
import { api } from "../lib/api";

const statusConfig: Record<string, { color: string; label: string; icon: ReactNode }> = {
  pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "بانتظار التأكيد", icon: <Clock className="w-3 h-3" /> },
  confirmed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "مؤكد", icon: <CheckCircle className="w-3 h-3" /> },
  shipped: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "تم الشحن", icon: <Truck className="w-3 h-3" /> },
  delivered: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "تم التوصيل", icon: <PackageCheck className="w-3 h-3" /> },
  cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "ملغي", icon: <XCircle className="w-3 h-3" /> },
};

export default function OrdersTab({ orders, onRefresh }: { orders: any[]; onRefresh?: () => void }) {
  const [pushStatus, setPushStatus] = useState<"loading" | "subscribed" | "not-subscribed" | "unsupported">("loading");
  const [pushMsg, setPushMsg] = useState<string | null>(null);
  const [pushBusy, setPushBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  useEffect(() => {
    import("../hooks/usePushNotifications").then(({ getSubscriptionStatus }) => {
      getSubscriptionStatus().then(setPushStatus);
    }).catch(() => setPushStatus("unsupported"));
  }, []);

  async function handleSubscribe() {
    setPushBusy(true);
    setPushMsg(null);
    try {
      const { subscribeAdmin } = await import("../hooks/usePushNotifications");
      const result = await subscribeAdmin();
      if (result.ok) setPushStatus("subscribed");
      setPushMsg(result.message);
    } catch {}
    setPushBusy(false);
    setTimeout(() => setPushMsg(null), 6000);
  }

  async function handleUnsubscribe() {
    setPushBusy(true);
    try {
      const { unsubscribeAdmin } = await import("../hooks/usePushNotifications");
      await unsubscribeAdmin();
      setPushStatus("not-subscribed");
      setPushMsg("تم إيقاف الإشعارات");
    } catch {}
    setPushBusy(false);
    setTimeout(() => setPushMsg(null), 4000);
  }

  async function sendTestPush() {
    setPushBusy(true);
    setPushMsg(null);
    try {
      if (Notification.permission !== "granted") {
        throw new Error("يجب السماح للإشعارات أولاً");
      }
      const result = await api.sendTestPush();
      setPushMsg(
        `✅ تم إرسال Web Push حقيقي إلى ${result.sent} جهاز — تفقّد إشعاراتك خلال ثوانٍ!`
      );
    } catch (e: any) {
      setPushMsg(`❌ ${e.message}`);
    }
    setPushBusy(false);
    setTimeout(() => setPushMsg(null), 8000);
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    setDeleteLoading(id);
    try {
      await api.deleteOrder(id);
      if (onRefresh) onRefresh();
    } catch (e: any) {
      alert(e.message || "فشل حذف الطلب");
    } finally {
      setDeleteLoading(null);
    }
  }

  async function handleDeleteAllOrders() {
    if (!confirm("هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.")) return;
    setDeleteAllLoading(true);
    try {
      await api.deleteAllOrders();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      alert(e.message || "فشل حذف جميع الطلبات");
    } finally {
      setDeleteAllLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Push Notifications Control Panel ── */}
      <div className="rounded-xl border border-aurax-700 bg-aurax-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-aurax-400" />
            <span className="text-sm font-extrabold">إشعارات الطلبات</span>
            {pushStatus === "loading" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-aurax-700/50 text-aurax-400 font-bold">جاري التحقق...</span>
            )}
            {pushStatus === "subscribed" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold">🟢 مفعّل</span>
            )}
            {pushStatus === "not-subscribed" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold">⚪ غير مفعّل</span>
            )}
            {pushStatus === "unsupported" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold">❌ غير مدعوم</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {pushStatus === "not-subscribed" && (
              <button
                onClick={handleSubscribe}
                disabled={pushBusy}
                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
              >
                {pushBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
                تفعيل الإشعارات
              </button>
            )}
            {pushStatus === "subscribed" && (
              <>
                <button
                  onClick={sendTestPush}
                  disabled={pushBusy}
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50"
                >
                  {pushBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
                  إرسال إشعار تجريبي
                </button>
                <button
                  onClick={handleUnsubscribe}
                  disabled={pushBusy}
                  className="text-[11px] font-bold text-aurax-500 hover:text-red-400 transition"
                >
                  إيقاف
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-[11px] text-aurax-500 leading-relaxed">
          {pushStatus === "subscribed"
            ? "✅ ستصلك إشعارات فورية عند وصول أي طلب جديد — حتى لو الموقع أو المتصفح مغلق."
            : pushStatus === "unsupported"
            ? "❌ متصفحك لا يدعم الإشعارات. استخدم Chrome أو Edge أو Firefox."
            : "فعّل الإشعارات لتصلك تنبيهات فورية على جهازك عند وصول أي طلب جديد، حتى لو الموقع مغلق."}
        </p>

        {pushMsg && (
          <div className={`text-xs font-bold px-3 py-1.5 rounded-lg ${pushMsg.startsWith("✅") ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
            {pushMsg}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400">
            الطلبات الواردة ({orders.length})
          </h3>
          {orders.length > 0 && (
            <button
              onClick={handleDeleteAllOrders}
              disabled={deleteAllLoading}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition disabled:opacity-50 inline-flex items-center gap-1"
            >
              {deleteAllLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              حذف الكل
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === "all"
                ? "bg-aurax-900 dark:bg-white text-white dark:text-aurax-900"
                : "bg-aurax-800/40 text-aurax-400 hover:bg-aurax-800/60 hover:text-white"
            }`}
          >
            الكل
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                statusFilter === status
                  ? "bg-aurax-900 dark:bg-white text-white dark:text-aurax-900"
                  : "bg-aurax-800/40 text-aurax-400 hover:bg-aurax-800/60 hover:text-white"
              }`}
            >
              {config.icon}
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-aurax-500 rounded-xl border border-aurax-700">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">لا توجد طلبات بعد</p>
          <p className="text-sm mt-1">ستظهر الطلبات هنا عند وصولها من العملاء.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders
            .filter((order) => statusFilter === "all" || (order.status || "pending") === statusFilter)
            .map((order: any) => {
              const status = order.status || "pending";
              const config = statusConfig[status] || statusConfig.pending;
              return (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="block w-full text-right rounded-xl border border-aurax-700 hover:border-aurax-500 transition p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{order.customerName}</span>
                      <span className="text-[10px] border border-aurax-700 px-2 py-0.5 rounded text-aurax-400 tracking-wider">
                        #{String(order.id).slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-aurax-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.city}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-0 border-aurax-700/30 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div className="text-sm font-black" dir="ltr">
                      {(order.total || 0).toLocaleString()} د.ع
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold text-[10px] tracking-wide ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteOrder(order.id);
                      }}
                      disabled={deleteLoading === order.id}
                      className="shrink-0 h-8 w-8 grid place-items-center rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                      aria-label="حذف الطلب"
                    >
                      {deleteLoading === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </button>
                    <div className="hidden sm:flex h-8 w-8 rounded-full items-center justify-center border border-aurax-700 text-aurax-500 group-hover:border-aurax-500 group-hover:text-white transition">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}

          {orders.filter((order) => statusFilter === "all" || (order.status || "pending") === statusFilter).length === 0 && (
            <div className="text-center py-10 text-aurax-500 rounded-xl border border-aurax-700">
              <p className="font-bold">لا توجد طلبات بهذه الحالة</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
