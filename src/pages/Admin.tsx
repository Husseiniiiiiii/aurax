import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Check,
  FolderTree,
  ImagePlus,
  Loader2,
  LogOut,
  Package,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PendingImages, {
  commitImages,
  itemsFromUrls,
  type ImageItem,
} from "../components/PendingImages";
import { api, type ApiCategory, type ApiProduct } from "../lib/api";
import OrdersTab from "./OrdersTab";

// ─────────── shared UI ───────────

const inputCls =
  "w-full rounded-lg bg-aurax-900/40 border border-aurax-700 px-3 py-2 text-[15px] font-medium text-aurax-100 placeholder:text-aurax-500 focus:border-white focus:bg-aurax-900/70 focus:outline-none transition";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-aurax-200">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {children}
      {hint && <div className="text-[10px] text-aurax-500">{hint}</div>}
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

// ─────────── main page ───────────

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState<"products" | "categories" | "orders">("products");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productsView, setProductsView] = useState<"list" | "form">("list");
  const chromeHidden = tab === "products" && productsView === "form";

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [p, c, o] = await Promise.all([
        api.listProducts(),
        api.listCategories(),
        api.listOrders(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  // One unified skeleton for the whole first-load (auth + initial data fetch).
  if (authLoading || (!hasLoadedOnce && loading)) return <AdminSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 pb-24 max-w-5xl">
      {!chromeHidden && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">لوحة التحكم</h1>
            <p className="mt-0.5 text-[11px] text-aurax-500">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="btn-outline inline-flex items-center gap-1.5 text-sm px-3 py-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            خروج
          </button>
        </div>
      )}

      {/* Top tabs */}
      <div className={`grid grid-cols-3 gap-2 mb-5 ${chromeHidden ? "hidden" : ""}`}>
        {[
          {
            id: "products" as const,
            label: "منتجات",
            count: products.length,
            Icon: Package,
          },
          {
            id: "categories" as const,
            label: "فئات",
            count: categories.length,
            Icon: FolderTree,
          },
          {
            id: "orders" as const,
            label: "الطلبات",
            count: orders.length,
            Icon: PackageCheck,
          },
        ].map(({ id, label, count, Icon }) => {
          const active = tab === id;
          const showShimmer = loading && count === 0;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-2.5 rounded-lg text-sm font-extrabold inline-flex items-center justify-center gap-2 border transition ${
                active
                  ? "border-white text-white bg-white/5"
                  : "border-aurax-700 text-aurax-400 hover:text-aurax-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span
                className={`min-w-[1.5rem] h-5 px-1.5 rounded-full inline-flex items-center justify-center text-[11px] font-black tabular-nums border ${
                  active
                    ? "bg-white text-aurax-900 border-white"
                    : "bg-aurax-800/60 text-aurax-200 border-aurax-700"
                }`}
              >
                {showShimmer ? (
                  <span className="block h-2 w-3 rounded bg-aurax-200/60 dark:bg-aurax-700/70 overflow-hidden shimmer" />
                ) : (
                  count
                )}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5">
          {error}
        </div>
      )}

      {tab === "categories" && (
        <CategoriesTab categories={categories} onChange={refresh} />
      )}
      {tab === "products" && (
        <ProductsTab
          products={products}
          categories={categories}
          onChange={refresh}
          view={productsView}
          onViewChange={setProductsView}
        />
      )}
      {tab === "orders" && (
        <OrdersTab orders={orders} onRefresh={refresh} />
      )}

      {!chromeHidden && (
        <div className="mt-10 text-center">
          <Link to="/" className="text-xs text-aurax-500 hover:underline">
            ← العودة للموقع
          </Link>
        </div>
      )}
    </main>
  );
}

// ─────────── Skeletons ───────────

const skelBase =
  "bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer rounded-md";

function AdminSkeleton() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-10 pb-24 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="space-y-2">
          <div className={`h-7 w-40 ${skelBase}`} />
          <div className={`h-3 w-28 ${skelBase}`} />
        </div>
        <div className={`h-9 w-20 ${skelBase}`} />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-10 ${skelBase}`} />
        ))}
      </div>

      <TabContentSkeleton tab="products" />
    </main>
  );
}

function TabContentSkeleton({ tab }: { tab: "products" | "categories" | "orders" }) {
  if (tab === "products") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl flex items-center gap-3 border border-aurax-700"
          >
            <div className={`h-14 w-14 shrink-0 ${skelBase}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-3.5 w-2/3 ${skelBase}`} />
              <div className={`h-3 w-1/3 ${skelBase}`} />
            </div>
            <div className={`h-8 w-16 ${skelBase}`} />
          </div>
        ))}
      </div>
    );
  }

  if (tab === "categories") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-aurax-700 p-3 space-y-3"
          >
            <div className={`aspect-square w-full ${skelBase}`} />
            <div className={`h-3.5 w-2/3 ${skelBase}`} />
          </div>
        ))}
      </div>
    );
  }

  // orders
  return (
    <div className="space-y-5">
      <div className={`h-24 w-full rounded-xl ${skelBase}`} />
      <div className="space-y-2">
        <div className={`h-3 w-32 ${skelBase}`} />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-9 w-20 shrink-0 ${skelBase}`} />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-aurax-700 flex items-center gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-1/3 ${skelBase}`} />
              <div className={`h-3 w-1/2 ${skelBase}`} />
            </div>
            <div className={`h-7 w-24 rounded-full ${skelBase}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── Categories ───────────

function CategoriesTab({
  categories,
  onChange,
}: {
  categories: ApiCategory[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [gender, setGender] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [categoryTab, setCategoryTab] = useState<"all" | "men-sub" | "women-sub">("all");

  const slug = useMemo(() => slugify(nameEn || name), [nameEn, name]);

  // Filter categories by tab
  const filteredCategories = useMemo(() => {
    if (categoryTab === "all") return categories;
    return categories.filter((c) => c.gender === categoryTab);
  }, [categories, categoryTab]);

  // Count categories by gender
  const menCount = categories.filter((c) => c.gender === "men-sub").length;
  const womenCount = categories.filter((c) => c.gender === "women-sub").length;

  function resetForm() {
    setEditing(null);
    setName("");
    setNameEn("");
    setGender("");
    setImages([]);
    setErr(null);
  }

  function startEdit(c: ApiCategory) {
    setEditing(c);
    setName(c.name);
    setNameEn(c.nameEn);
    setGender(c.gender || "");
    setImages(c.image ? itemsFromUrls(c.image) : []);
    setErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name || !nameEn) return setErr("الرجاء إكمال الأسماء");
    setSubmitting(true);
    try {
      const urls = await commitImages(images);
      const payload: Partial<ApiCategory> = {
        slug: editing?.slug || slug,
        name,
        nameEn,
        gender: gender || null,
        image: urls[0] || null,
      };
      if (editing) {
        await api.updateCategory(editing.id, payload);
      } else {
        await api.createCategory(payload);
      }
      resetForm();
      onChange();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const category = categories.find((c) => c.id === id);
    // Prevent deletion of main gender sections (men/women)
    if (category && (category.gender === "men" || category.gender === "women")) {
      alert("لا يمكن حذف القسم الرئيسي (رجالي/نسائي)");
      return;
    }
    if (!confirm("حذف هذه الفئة وكل منتجاتها؟")) return;
    try {
      await api.deleteCategory(id);
      onChange();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400">
            {editing ? "تعديل فئة" : "إضافة فئة جديدة"}
          </h3>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[11px] text-aurax-500 hover:text-white inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              إلغاء
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="الاسم بالعربية" required>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أحذية"
              className={inputCls}
            />
          </Field>
          <Field label="Name (English)" required>
            <input
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Shoes"
              className={inputCls}
              dir="ltr"
            />
          </Field>
        </div>

        <Field label="القسم" required hint="اختر أين ستظهر هذه الفئة">
          <select
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputCls}
          >
            <option value="">— اختر القسم —</option>
            <option value="men-sub">👔 رجالي</option>
            <option value="women-sub">👗 نسائي</option>
          </select>
        </Field>

        <div>
          <div className="text-xs font-bold text-aurax-200 mb-1.5">
            صورة الفئة{" "}
            <span className="text-aurax-500 font-normal">(اختياري)</span>
          </div>
          <div className="max-w-[160px]">
            <PendingImages value={images} onChange={setImages} max={1} />
          </div>
        </div>

        {err && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 text-sm py-2.5"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : editing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {submitting
            ? "جاري الحفظ..."
            : editing
            ? "حفظ التعديل"
            : "إضافة الفئة"}
        </button>
      </form>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCategoryTab("all")}
          className={`px-3 py-2 rounded-lg text-xs font-extrabold border transition ${
            categoryTab === "all"
              ? "border-white text-white bg-white/5"
              : "border-aurax-700 text-aurax-400 hover:text-aurax-200"
          }`}
        >
          الكل ({categories.length})
        </button>
        <button
          onClick={() => setCategoryTab("men-sub")}
          className={`px-3 py-2 rounded-lg text-xs font-extrabold border transition ${
            categoryTab === "men-sub"
              ? "border-white text-white bg-white/5"
              : "border-aurax-700 text-aurax-400 hover:text-aurax-200"
          }`}
        >
          👔 رجالي ({menCount})
        </button>
        <button
          onClick={() => setCategoryTab("women-sub")}
          className={`px-3 py-2 rounded-lg text-xs font-extrabold border transition ${
            categoryTab === "women-sub"
              ? "border-white text-white bg-white/5"
              : "border-aurax-700 text-aurax-400 hover:text-aurax-200"
          }`}
        >
          👗 نسائي ({womenCount})
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400 mb-2">
          الفئات الحالية ({filteredCategories.length})
        </h3>
        <ul className="divide-y divide-aurax-800 border border-aurax-700 rounded-lg bg-aurax-900/20">
          {filteredCategories.map((c) => (
            <CategoryRow
              key={c.id}
              category={c}
              onEdit={() => startEdit(c)}
              onDelete={() => handleDelete(c.id)}
              onApplyUpload={async (file) => {
                const { url } = await api.uploadImage(file);
                await api.updateCategory(c.id, { image: url });
                onChange();
              }}
              onRemoveImage={async () => {
                await api.updateCategory(c.id, { image: null });
                onChange();
              }}
            />
          ))}
          {filteredCategories.length === 0 && (
            <li className="p-6 text-center text-aurax-500 text-sm">
              لا توجد فئات في هذا القسم
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  onApplyUpload,
  onRemoveImage,
}: {
  category: ApiCategory;
  onEdit: () => void;
  onDelete: () => void;
  onApplyUpload: (file: File) => Promise<void>;
  onRemoveImage: () => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  useEffect(() => {
    return () => {
      const p = pendingRef.current;
      if (p) URL.revokeObjectURL(p.preview);
    };
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (pending) URL.revokeObjectURL(pending.preview);
    setPending({ file: f, preview: URL.createObjectURL(f) });
    if (fileRef.current) fileRef.current.value = "";
  };

  const cancelPending = () => {
    if (pending) URL.revokeObjectURL(pending.preview);
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const apply = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await onApplyUpload(pending.file);
      URL.revokeObjectURL(pending.preview);
      setPending(null);
    } catch (e: any) {
      alert(e.message || "فشل الرفع");
    } finally {
      setBusy(false);
    }
  };

  const removeImg = async () => {
    setBusy(true);
    try {
      await onRemoveImage();
    } catch (e: any) {
      alert(e.message || "فشل");
    } finally {
      setBusy(false);
    }
  };

  const displaySrc = pending?.preview ?? category.image ?? null;

  return (
    <li className="flex flex-wrap items-center gap-2.5 p-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-aurax-700 bg-aurax-800">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-aurax-500">
            <FolderTree className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-bold text-sm truncate text-aurax-100">
          {category.name}
        </div>
        <div className="text-[11px] text-aurax-500 truncate" dir="ltr">
          {category.slug} · {category.nameEn}
        </div>
        {category.gender && (
          <span className={`inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${
            category.gender === "men" || category.gender === "men-sub" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
            category.gender === "women" || category.gender === "women-sub" ? "bg-pink-500/10 text-pink-400 border-pink-500/30" :
            "bg-aurax-500/10 text-aurax-300 border-aurax-500/20"
          }`}>
            {category.gender === "men" || category.gender === "men-sub" ? "رجالي" :
             category.gender === "women" || category.gender === "women-sub" ? "نسائي" :
             "مشترك"}
          </span>
        )}
      </div>

      <label
        className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-aurax-700 px-2.5 py-1.5 text-[11px] font-bold text-aurax-200 hover:border-white transition ${
          busy ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <ImagePlus className="h-3.5 w-3.5" />
        {busy
          ? "…"
          : pending
          ? "تغيير"
          : category.image
          ? "صورة جديدة"
          : "اختيار صورة"}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
          disabled={busy}
        />
      </label>

      {pending && (
        <>
          <button
            type="button"
            onClick={apply}
            disabled={busy}
            className="shrink-0 inline-flex items-center gap-1 rounded-md bg-white text-aurax-900 px-2.5 py-1.5 text-[11px] font-extrabold disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            تطبيق
          </button>
          <button
            type="button"
            onClick={cancelPending}
            disabled={busy}
            className="shrink-0 rounded-md border border-aurax-700 px-2 py-1.5 text-[11px] text-aurax-400 hover:text-white"
          >
            إلغاء
          </button>
        </>
      )}

      {category.image && !pending && (
        <button
          type="button"
          onClick={removeImg}
          disabled={busy}
          aria-label="إزالة الصورة"
          className="shrink-0 h-8 w-8 grid place-items-center rounded-md border border-aurax-700 text-aurax-400 hover:text-white transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={onEdit}
        aria-label="تعديل"
        className="shrink-0 h-8 w-8 grid place-items-center rounded-md border border-aurax-700 text-aurax-300 hover:border-white transition"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {category.gender !== "men" && category.gender !== "women" && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="حذف"
          className="shrink-0 h-8 w-8 grid place-items-center rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );
}

// ─────────── Products ───────────

function ProductsTab({
  products,
  categories,
  onChange,
  view,
  onViewChange,
}: {
  products: ApiProduct[];
  categories: ApiCategory[];
  onChange: () => void;
  view: "list" | "form";
  onViewChange: (v: "list" | "form") => void;
}) {
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [badge, setBadge] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Gender + Category filters for the LIST (not for the form)
  const [filterGender, setFilterGender] = useState<"all" | "men" | "women">("all");
  const [filterCat, setFilterCat] = useState<string>("all");

  const slug = useMemo(() => {
    const base = slugify(nameEn || name);
    return base
      ? base + "-" + Math.random().toString(36).slice(2, 6)
      : "";
  }, [nameEn, name]);

  function resetForm() {
    setEditing(null);
    setName("");
    setNameEn("");
    setPrice("");
    setOldPrice("");
    setImages([]);
    setDescription("");
    setGender("");
    setSizes("");
    setColors([]);
    setBadge("");
    setStock("");
    setFeatured(false);
    setErr(null);
    setStep(1);
  }

  function openCreate() {
    resetForm();
    onViewChange("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    resetForm();
    onViewChange("list");
  }

  function startEdit(p: ApiProduct) {
    setEditing(p);
    setName(p.name);
    setNameEn(p.nameEn);
    setPrice(String(p.price));
    setOldPrice(p.oldPrice ? String(p.oldPrice) : "");
    setImages(itemsFromUrls(p.image, p.images || []));
    setCategoryId(p.categoryId);
    setGender(p.gender || "");
    setDescription(p.description || "");
    setSizes((p.sizes || []).join(", "));
    setColors(p.colors || []);
    setBadge(p.badge || "");
    setStock(p.stock != null ? String(p.stock) : "");
    setFeatured(!!p.featured);
    setErr(null);
    setStep(1);
    onViewChange("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    setErr(null);
    if (step === 1) {
      if (!name.trim() || !nameEn.trim())
        return setErr("الرجاء إكمال الأسماء");
      if (!categoryId) return setErr("الرجاء اختيار فئة");
    }
    if (step === 2) {
      if (!price || Number(price) <= 0) return setErr("السعر غير صحيح");
    }
    if (step === 3) {
      if (images.length === 0)
        return setErr("الرجاء رفع صورة واحدة على الأقل");
    }
    setStep((s) => Math.min(totalSteps, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!categoryId) return setErr("الرجاء اختيار فئة");
    if (images.length === 0) return setErr("الرجاء رفع صورة واحدة على الأقل");
    if (!name || !nameEn) return setErr("الرجاء إكمال الأسماء");
    if (!price || Number(price) <= 0) return setErr("سعر غير صحيح");
    setSubmitting(true);
    try {
      const urls = await commitImages(images);
      const payload: Partial<ApiProduct> = {
        name,
        nameEn,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        image: urls[0],
        images: urls.slice(1),
        categoryId,
        gender: gender || null,
        description: description || null,
        sizes: sizes
          .split(/[,،]/)
          .map((s) => s.trim())
          .filter(Boolean),
        colors,
        badge: badge.trim() || null,
        stock: stock ? Number(stock) : 0,
        inStock: stock ? Number(stock) > 0 : true,
        featured,
      };
      if (editing) {
        await api.updateProduct(editing.id, payload);
      } else {
        await api.createProduct({ ...payload, slug });
      }
      resetForm();
      onViewChange("list");
      onChange();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await api.deleteProduct(id);
      onChange();
    } catch (e: any) {
      alert(e.message);
    }
  }

  // Build a map of categoryId → gender for fast lookup
  const catGenderMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) {
      if (c.gender) m.set(c.id, c.gender);
    }
    return m;
  }, [categories]);

  // Two-tier filtering: gender section first, then category
  const filtered = useMemo(() => {
    let list = products;

    // Filter by gender section
    if (filterGender !== "all") {
      const genderTag = `${filterGender}-sub`; // e.g. "men-sub"
      list = list.filter((p) => {
        const g = catGenderMap.get(p.categoryId);
        return g === genderTag || g === filterGender || g === "both-sub";
      });
    }

    // Then filter by specific category
    if (filterCat !== "all") {
      list = list.filter((p) => p.categoryId === filterCat);
    }

    return list;
  }, [products, filterGender, filterCat, catGenderMap]);

  // Only subcategories (exclude main section circles gender=men/women)
  const subCategories = useMemo(
    () => categories.filter((c) => c.gender === "men-sub" || c.gender === "women-sub" || c.gender === "both-sub"),
    [categories]
  );

  // Categories visible under the current gender tab
  const visibleCategories = useMemo(() => {
    if (filterGender === "all") return subCategories;
    const genderTag = `${filterGender}-sub`;
    return subCategories.filter(
      (c) => c.gender === genderTag || c.gender === "both-sub"
    );
  }, [subCategories, filterGender]);

  // Counts for gender tabs
  const menCount = useMemo(() => {
    return products.filter((p) => {
      const g = catGenderMap.get(p.categoryId);
      return g === "men-sub" || g === "men" || g === "both-sub";
    }).length;
  }, [products, catGenderMap]);

  const womenCount = useMemo(() => {
    return products.filter((p) => {
      const g = catGenderMap.get(p.categoryId);
      return g === "women-sub" || g === "women" || g === "both-sub";
    }).length;
  }, [products, catGenderMap]);

  if (view === "form") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < totalSteps) {
            handleNext();
          } else {
            handleSubmit(e);
          }
        }}
        className="space-y-4"
      >
        {/* Back header */}
        <div className="flex items-center gap-2 -mt-1 mb-1">
          <button
            type="button"
            onClick={closeForm}
            className="h-10 w-10 grid place-items-center rounded-lg border border-aurax-700 text-aurax-200 hover:border-white hover:text-white transition"
            aria-label="رجوع"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-black truncate">
              {editing ? "تعديل منتج" : "إضافة منتج"}
            </h2>
            <div className="text-[11px] text-aurax-500">
              {editing ? editing.name : "اتبع الخطوات لإضافة منتج جديد"}
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Stepper
          step={step}
          total={totalSteps}
          labels={["الأساسيات", "السعر", "الصور", "التفاصيل"]}
          onJump={(s) => setStep(s)}
        />

        {/* Step content */}
        <div className="rounded-xl border border-aurax-700 bg-aurax-900/30 p-3 space-y-3">
          {step === 1 && (
            <>
              <StepHeading
                num={1}
                title="الأساسيات"
                hint="اسم المنتج بالعربية والإنجليزية + الفئة والجنس"
              />
              <Field label="الاسم بالعربية" required>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="قميص قطن"
                  className={inputCls}
                />
              </Field>
              <Field label="Name (English)" required>
                <input
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Cotton Shirt"
                  className={inputCls}
                  dir="ltr"
                />
              </Field>
              <Field label="الفئة" required>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— اختر —</option>
                  {subCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.gender === "men-sub" ? "👔 رجالي" : c.gender === "women-sub" ? "👗 نسائي" : "🔄 مشترك"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="الجنس">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputCls}
                >
                  <option value="">للجميع</option>
                  <option value="men">رجال</option>
                  <option value="women">نساء</option>
                </select>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading
                num={2}
                title="السعر والشارة"
                hint="السعر الحالي والقديم (اختياري) والشارة"
              />
              <Field label="السعر (د.ع)" required>
                <input
                  required
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="25000"
                  className={inputCls}
                  dir="ltr"
                />
              </Field>
              <Field label="السعر القديم" hint="اتركه فارغاً إذا لا يوجد خصم">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="—"
                  className={inputCls}
                  dir="ltr"
                />
              </Field>
              <Field label="الشارة" hint="تظهر على بطاقة المنتج">
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— بدون —</option>
                  <option value="new">جديد</option>
                  <option value="sale">خصم</option>
                  <option value="hot">رائج</option>
                  <option value="limited">محدود</option>
                </select>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading
                num={3}
                title="الصور"
                hint="حتى 4 صور — الأولى هي صورة الغلاف"
              />
              <PendingImages value={images} onChange={setImages} max={4} />
            </>
          )}

          {step === 4 && (
            <>
              <StepHeading
                num={4}
                title="التفاصيل"
                hint="الوصف، المقاسات، الألوان، والإعدادات"
              />
              <Field label="الوصف">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف اختياري..."
                  className={`${inputCls} min-h-[80px] resize-y`}
                  rows={3}
                />
              </Field>
              <Field label="المقاسات" hint="افصل بفاصلة — مثل: S, M, L">
                <input
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className={inputCls}
                  dir="ltr"
                />
              </Field>
              <Field label="الألوان" hint="اضغط على لون لإضافته أو حذفه">
                <ColorsPicker value={colors} onChange={setColors} />
              </Field>
              <Field label="الكمية بالمخزون" hint="اكتب 0 إذا نفد المنتج">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="مثال: 50"
                  className={inputCls}
                  dir="ltr"
                />
                {stock && Number(stock) > 0 ? (
                  <div className="mt-1 text-[10px] font-bold text-green-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    متوفر — {Number(stock).toLocaleString()} قطعة
                  </div>
                ) : stock === "0" ? (
                  <div className="mt-1 text-[10px] font-bold text-red-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    نفد من المخزون
                  </div>
                ) : null}
              </Field>
              <div className="grid grid-cols-1 gap-2">
                <Toggle
                  label="عرض في البانر الرئيسي"
                  checked={featured}
                  onChange={setFeatured}
                />
              </div>
            </>
          )}
        </div>

        {err && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            {err}
          </div>
        )}

        {/* Navigation */}
        <div className="sticky bottom-3 z-10 flex items-center gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErr(null);
                setStep((s) => Math.max(1, s - 1));
              }}
              className="btn-outline inline-flex items-center justify-center gap-1.5 px-3 py-3 text-sm"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2 shadow-lg shadow-black/20 disabled:opacity-60 text-sm py-3"
          >
            {step < totalSteps ? (
              <>
                التالي
                <ChevronLeft className="h-4 w-4" />
              </>
            ) : submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الرفع والنشر...
              </>
            ) : editing ? (
              <>
                <Check className="h-4 w-4" />
                حفظ التعديل
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                نشر المنتج
              </>
            )}
          </button>
        </div>
      </form>
    );
  }

  // ─── List view ───
  return (
    <div className="space-y-4">
      {/* Add new product */}
      <button
        type="button"
        onClick={openCreate}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm py-3"
      >
        <Plus className="h-4 w-4" />
        إضافة منتج جديد
      </button>

      {/* ─── Gender section tabs ─── */}
      <div className="rounded-xl border border-aurax-700 bg-aurax-900/40 p-1">
        <div className="grid grid-cols-3 gap-1">
          {([
            { id: "all" as const, label: "الكل", count: products.length, emoji: "📦", color: "white" },
            { id: "men" as const, label: "رجالي", count: menCount, emoji: "👔", color: "blue" },
            { id: "women" as const, label: "نسائي", count: womenCount, emoji: "👗", color: "pink" },
          ] as const).map(({ id, label, count, emoji, color }) => {
            const active = filterGender === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setFilterGender(id);
                  setFilterCat("all");
                }}
                className={`relative px-2 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  active
                    ? color === "blue"
                      ? "bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : color === "pink"
                      ? "bg-pink-500/15 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                      : "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    : "text-aurax-500 hover:text-aurax-300"
                }`}
              >
                <span className="text-sm">{emoji}</span>
                <span>{label}</span>
                <span
                  className={`min-w-[1.25rem] h-[18px] px-1 rounded-full text-[10px] font-black inline-flex items-center justify-center tabular-nums transition-all ${
                    active
                      ? color === "blue"
                        ? "bg-blue-500/30 text-blue-300"
                        : color === "pink"
                        ? "bg-pink-500/30 text-pink-300"
                        : "bg-white/20 text-white"
                      : "bg-aurax-800 text-aurax-500"
                  }`}
                >
                  {count}
                </span>
                {active && (
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all ${
                      color === "blue"
                        ? "bg-blue-400"
                        : color === "pink"
                        ? "bg-pink-400"
                        : "bg-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Category sub-filter chips ─── */}
      {visibleCategories.length > 0 && (
        <div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <CatChip
              active={filterCat === "all"}
              onClick={() => setFilterCat("all")}
              label={`الكل (${filterGender === "all" ? products.length : filterGender === "men" ? menCount : womenCount})`}
            />
            {visibleCategories.map((c) => {
              const count = products.filter(
                (p) => p.categoryId === c.id
              ).length;
              return (
                <CatChip
                  key={c.id}
                  active={filterCat === c.id}
                  onClick={() => setFilterCat(c.id)}
                  label={`${c.name} (${count})`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Products header ─── */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400">
          المنتجات ({filtered.length})
        </h3>
        {filterGender !== "all" && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            filterGender === "men"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
          }`}>
            {filterGender === "men" ? "👔 قسم رجالي" : "👗 قسم نسائي"}
          </span>
        )}
      </div>

      {/* ─── Product list ─── */}
      <div className="space-y-2">
        {filtered.map((p) => {
          const g = catGenderMap.get(p.categoryId);
          const isMen = g === "men-sub" || g === "men";
          return (
            <div
              key={p.id}
              className="p-2.5 rounded-lg flex items-center gap-3 border border-aurax-700 bg-aurax-900/30 hover:border-aurax-600 transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-14 w-14 rounded-md object-cover bg-aurax-800"
                />
                {/* Gender dot indicator */}
                <span
                  className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-aurax-900 ${
                    isMen ? "bg-blue-400" : "bg-pink-400"
                  }`}
                  title={isMen ? "رجالي" : "نسائي"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate flex items-center gap-1.5">
                  {p.name}
                  {p.featured && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  )}
                  {p.stock != null && p.stock > 0 ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/25">
                      {p.stock}
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      نفد
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-aurax-500 truncate">
                  {p.category?.name} · {p.price.toLocaleString()} د.ع
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="h-8 w-8 grid place-items-center rounded-md text-aurax-300 border border-aurax-700 hover:border-white transition"
                  aria-label="تعديل"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="h-8 w-8 grid place-items-center rounded-md text-red-400 border border-red-500/30 hover:bg-red-500/10 transition"
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 rounded-xl text-center border border-dashed border-aurax-700 bg-aurax-900/20">
            <div className="text-2xl mb-2">
              {filterGender === "men" ? "👔" : filterGender === "women" ? "👗" : "📦"}
            </div>
            <div className="text-aurax-500 text-sm font-bold">
              لا توجد منتجات {filterGender === "men" ? "في القسم الرجالي" : filterGender === "women" ? "في القسم النسائي" : "في هذه الفئة"}
            </div>
            <div className="text-aurax-600 text-xs mt-1">
              أضف منتجات جديدة باستخدام الزر أعلاه
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({
  step,
  total,
  labels,
  onJump,
}: {
  step: number;
  total: number;
  labels: string[];
  onJump: (s: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-bold text-aurax-300">
          الخطوة {step} من {total}
        </div>
        <div className="text-[11px] font-bold text-aurax-400">
          {labels[step - 1]}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1;
          const reached = idx <= step;
          return (
            <button
              key={i}
              type="button"
              onClick={() => idx < step && onJump(idx)}
              disabled={idx > step}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                reached ? "bg-white" : "bg-aurax-700"
              } ${idx < step ? "cursor-pointer hover:bg-aurax-200" : ""}`}
              aria-label={labels[i]}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepHeading({
  num,
  title,
  hint,
}: {
  num: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 pb-2 border-b border-aurax-800">
      <div className="h-7 w-7 grid place-items-center rounded-full bg-white text-aurax-900 text-xs font-black shrink-0">
        {num}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-extrabold text-white">{title}</div>
        {hint && (
          <div className="text-[11px] text-aurax-500 leading-tight mt-0.5">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

const COLOR_PALETTE = [
  "#000000",
  "#FFFFFF",
  "#9CA3AF",
  "#C0C0C0",
  "#EF4444",
  "#F59E0B",
  "#EAB308",
  "#22C55E",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#A855F7",
  "#78350F",
  "#1E3A8A",
];

function ColorsPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [custom, setCustom] = useState("#888888");

  const has = (c: string) =>
    value.some((v) => v.toLowerCase() === c.toLowerCase());

  const toggle = (c: string) => {
    if (has(c)) {
      onChange(value.filter((v) => v.toLowerCase() !== c.toLowerCase()));
    } else {
      onChange([...value, c]);
    }
  };

  const addCustom = () => {
    if (!has(custom)) onChange([...value, custom]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map((c) => {
          const active = has(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              aria-label={c}
              title={c}
              className={`relative h-8 w-8 rounded-full border transition ${
                active
                  ? "ring-2 ring-white ring-offset-2 ring-offset-aurax-900 border-white"
                  : "border-aurax-700 hover:border-aurax-500"
              }`}
              style={{ backgroundColor: c }}
            >
              {active && (
                <Check
                  className={`absolute inset-0 m-auto h-4 w-4 ${
                    c.toLowerCase() === "#ffffff" ||
                    c.toLowerCase() === "#fff"
                      ? "text-aurax-900"
                      : "text-white"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-aurax-700 bg-aurax-900/40 px-2 py-1.5">
          <span
            className="h-5 w-5 rounded-full border border-aurax-600"
            style={{ backgroundColor: custom }}
          />
          <span className="text-[11px] text-aurax-300 font-bold">
            لون مخصص
          </span>
          <input
            type="color"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="sr-only"
          />
        </label>
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex items-center gap-1 rounded-lg border border-aurax-700 px-2.5 py-1.5 text-[11px] font-bold text-aurax-200 hover:border-white"
        >
          <Plus className="h-3 w-3" />
          إضافة
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-aurax-800">
          <span className="text-[10px] text-aurax-500 font-bold pt-1.5 ml-1">
            المختار ({value.length}):
          </span>
          {value.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              title={`حذف ${c}`}
              className="group relative h-7 w-7 rounded-full border border-aurax-600 hover:border-red-400 transition"
              style={{ backgroundColor: c }}
            >
              <X className="absolute inset-0 m-auto h-3 w-3 opacity-0 group-hover:opacity-100 text-red-400 drop-shadow" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
        checked
          ? "border-white bg-white/5 text-white"
          : "border-aurax-700 bg-aurax-900/40 text-aurax-300"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-white" : "bg-aurax-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-aurax-900 transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function CatChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
        active
          ? "bg-white text-aurax-900 border-white"
          : "bg-aurax-900/40 text-aurax-300 border-aurax-700 hover:border-aurax-500"
      }`}
    >
      {label}
    </button>
  );
}
