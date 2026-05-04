import { useEffect, useState, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { LogOut, Plus, Trash2, Package, FolderTree } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  api,
  type ApiCategory,
  type ApiProduct,
} from "../lib/api";

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
      <main className="container mx-auto px-4 py-20 text-center text-aurax-500">
        ...
      </main>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-aurax-500">
            مرحباً، {user.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="btn-outline inline-flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل خروج
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-aurax-200 dark:border-aurax-800">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-3 text-sm font-bold inline-flex items-center gap-2 border-b-2 transition ${
            tab === "products"
              ? "border-aurax-900 dark:border-white text-aurax-900 dark:text-white"
              : "border-transparent text-aurax-500"
          }`}
        >
          <Package className="h-4 w-4" />
          المنتجات ({products.length})
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-3 text-sm font-bold inline-flex items-center gap-2 border-b-2 transition ${
            tab === "categories"
              ? "border-aurax-900 dark:border-white text-aurax-900 dark:text-white"
              : "border-transparent text-aurax-500"
          }`}
        >
          <FolderTree className="h-4 w-4" />
          الفئات ({categories.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-aurax-500 py-8">جاري التحميل...</div>
      )}

      {tab === "categories" && (
        <CategoriesTab
          categories={categories}
          onChange={refresh}
        />
      )}
      {tab === "products" && (
        <ProductsTab
          products={products}
          categories={categories}
          onChange={refresh}
        />
      )}

      <div className="mt-10 text-center">
        <Link to="/" className="text-sm text-aurax-500 hover:underline">
          ← العودة للموقع
        </Link>
      </div>
    </main>
  );
}

// ─────────────────────── Categories ───────────────────────

function CategoriesTab({
  categories,
  onChange,
}: {
  categories: ApiCategory[];
  onChange: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await api.createCategory({ slug, name, nameEn, image: image || null });
      setSlug("");
      setName("");
      setNameEn("");
      setImage("");
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
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="card p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-extrabold">
                {c.name}{" "}
                <span className="text-aurax-500 font-normal">
                  / {c.nameEn}
                </span>
              </div>
              <div className="text-xs text-aurax-500">slug: {c.slug}</div>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="h-9 w-9 grid place-items-center rounded-xl text-red-500 hover:bg-red-500/10 transition"
              aria-label="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="card p-8 text-center text-aurax-500">
            لا توجد فئات بعد
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="card p-5 space-y-3 self-start">
        <h3 className="font-extrabold mb-2">إضافة فئة جديدة</h3>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (مثال: shoes)"
          className="input w-full"
          dir="ltr"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم بالعربية"
          className="input w-full"
        />
        <input
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Name in English"
          className="input w-full"
          dir="ltr"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="رابط صورة (اختياري)"
          className="input w-full"
          dir="ltr"
        />
        {err && (
          <div className="text-sm text-red-500">{err}</div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {submitting ? "جاري الإضافة..." : "إضافة"}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────── Products ───────────────────────

function ProductsTab({
  products,
  categories,
  onChange,
}: {
  products: ApiProduct[];
  categories: ApiCategory[];
  onChange: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!categoryId) {
      setErr("اختر فئة");
      return;
    }
    setSubmitting(true);
    try {
      await api.createProduct({
        slug,
        name,
        nameEn,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        image,
        categoryId,
        gender: gender || null,
        description: description || null,
      });
      setSlug("");
      setName("");
      setNameEn("");
      setPrice("");
      setOldPrice("");
      setImage("");
      setDescription("");
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

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="card p-4 flex items-center gap-4"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-16 w-16 rounded-xl object-cover bg-aurax-100 dark:bg-aurax-800"
            />
            <div className="flex-1 min-w-0">
              <div className="font-extrabold truncate">{p.name}</div>
              <div className="text-xs text-aurax-500 truncate">
                {p.category?.name} · {p.price.toLocaleString()} د.ع
              </div>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="h-9 w-9 grid place-items-center rounded-xl text-red-500 hover:bg-red-500/10 transition shrink-0"
              aria-label="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="card p-8 text-center text-aurax-500">
            لا توجد منتجات بعد
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="card p-5 space-y-3 self-start">
        <h3 className="font-extrabold mb-2">إضافة منتج جديد</h3>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (مثال: red-dress)"
          className="input w-full"
          dir="ltr"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم بالعربية"
          className="input w-full"
        />
        <input
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Name in English"
          className="input w-full"
          dir="ltr"
        />
        <input
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="السعر (د.ع)"
          className="input w-full"
          dir="ltr"
        />
        <input
          type="number"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          placeholder="السعر القديم (اختياري)"
          className="input w-full"
          dir="ltr"
        />
        <input
          required
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="رابط الصورة"
          className="input w-full"
          dir="ltr"
        />
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input w-full"
        >
          <option value="">اختر الفئة</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="input w-full"
        >
          <option value="">الجنس (اختياري)</option>
          <option value="men">رجال</option>
          <option value="women">نساء</option>
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="الوصف (اختياري)"
          className="input w-full min-h-[80px]"
          rows={3}
        />
        {err && <div className="text-sm text-red-500">{err}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {submitting ? "جاري الإضافة..." : "إضافة منتج"}
        </button>
      </form>
    </div>
  );
}
