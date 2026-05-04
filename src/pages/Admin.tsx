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
  Pencil,
  Plus,
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
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([
        api.listProducts(),
        api.listCategories(),
      ]);
      setProducts(p);
      setCategories(c);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (authLoading) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-aurax-500" />
      </main>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 pb-24 max-w-5xl">
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

      {/* Top tabs */}
      <div className="grid grid-cols-2 gap-2 mb-5">
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
        ].map(({ id, label, count, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3 py-2.5 rounded-lg text-sm font-extrabold inline-flex items-center justify-center gap-2 border transition ${
              tab === id
                ? "border-white text-white bg-white/5"
                : "border-aurax-700 text-aurax-400 hover:text-aurax-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label} ({count})
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-aurax-500 py-6 inline-flex items-center gap-2 justify-center w-full">
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري التحميل...
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
        />
      )}

      <div className="mt-10 text-center">
        <Link to="/" className="text-xs text-aurax-500 hover:underline">
          ← العودة للموقع
        </Link>
      </div>
    </main>
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
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const slug = useMemo(() => slugify(nameEn || name), [nameEn, name]);

  function resetForm() {
    setEditing(null);
    setName("");
    setNameEn("");
    setImages([]);
    setErr(null);
  }

  function startEdit(c: ApiCategory) {
    setEditing(c);
    setName(c.name);
    setNameEn(c.nameEn);
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

      <div className="space-y-2">
        <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400">
          الفئات الحالية
        </h3>
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-2.5 rounded-lg flex items-center gap-3 border border-aurax-700 bg-aurax-900/30"
          >
            {c.image ? (
              <img
                src={c.image}
                alt={c.name}
                className="h-12 w-12 rounded-md object-cover bg-aurax-800 shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-md bg-aurax-800 grid place-items-center text-aurax-600 shrink-0">
                <FolderTree className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{c.name}</div>
              <div className="text-[11px] text-aurax-500 truncate">
                {c.nameEn}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => startEdit(c)}
                className="h-8 w-8 grid place-items-center rounded-md text-aurax-300 border border-aurax-700 hover:border-white transition"
                aria-label="تعديل"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="h-8 w-8 grid place-items-center rounded-md text-red-400 border border-red-500/30 hover:bg-red-500/10 transition"
                aria-label="حذف"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="p-6 rounded-lg text-center text-aurax-500 text-sm border border-dashed border-aurax-700">
            لا توجد فئات بعد
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────── Products ───────────

function ProductsTab({
  products,
  categories,
  onChange,
}: {
  products: ApiProduct[];
  categories: ApiCategory[];
  onChange: () => void;
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
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Category filter for the LIST (not for the form)
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
    setErr(null);
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
    setErr(null);
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
      };
      if (editing) {
        await api.updateProduct(editing.id, payload);
      } else {
        await api.createProduct({ ...payload, slug });
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
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await api.deleteProduct(id);
      onChange();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const filtered = useMemo(
    () =>
      filterCat === "all"
        ? products
        : products.filter((p) => p.categoryId === filterCat),
    [products, filterCat]
  );

  return (
    <div className="space-y-5">
      {/* Add/Edit form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400">
            {editing ? "تعديل منتج" : "إضافة منتج"}
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
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <Field label="السعر القديم">
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="الفئة" required>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputCls}
            >
              <option value="">— اختر —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
        </div>

        <div>
          <div className="text-xs font-bold text-aurax-200 mb-1.5">
            الصور <span className="text-red-400">*</span>
          </div>
          <PendingImages value={images} onChange={setImages} max={4} />
        </div>

        <Field label="الوصف">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف اختياري..."
            className={`${inputCls} min-h-[70px] resize-y`}
            rows={3}
          />
        </Field>

        {err && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            {err}
          </div>
        )}

        <div className="sticky bottom-4 z-10">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 shadow-lg shadow-black/20 disabled:opacity-60 text-sm py-3"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editing ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {submitting
              ? "جاري الرفع والنشر..."
              : editing
              ? "حفظ التعديل"
              : "نشر المنتج"}
          </button>
        </div>
      </form>

      {/* Category filter tabs */}
      <div>
        <h3 className="text-xs font-extrabold tracking-widest uppercase text-aurax-400 mb-2">
          المنتجات ({filtered.length})
        </h3>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <CatChip
            active={filterCat === "all"}
            onClick={() => setFilterCat("all")}
            label={`الكل (${products.length})`}
          />
          {categories.map((c) => {
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

      <div className="space-y-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-2.5 rounded-lg flex items-center gap-3 border border-aurax-700 bg-aurax-900/30"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-14 w-14 rounded-md object-cover bg-aurax-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{p.name}</div>
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
        ))}
        {filtered.length === 0 && (
          <div className="p-6 rounded-lg text-center text-aurax-500 text-sm border border-dashed border-aurax-700">
            لا توجد منتجات في هذه الفئة
          </div>
        )}
      </div>
    </div>
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
