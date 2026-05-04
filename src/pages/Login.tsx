import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    const from =
      (location.state as { from?: string } | null)?.from || "/admin";
    return <Navigate to={from} replace />;
  }

  // Shimmer skeleton while restoring session from token
  if (authLoading) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-md">
        <div className="card p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-6 w-40 rounded-lg bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-3 w-56 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
            <div className="h-11 w-full rounded-xl bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-3 w-20 rounded-md bg-aurax-200/50 dark:bg-aurax-800/60 overflow-hidden shimmer" />
            <div className="h-11 w-full rounded-xl bg-aurax-200/60 dark:bg-aurax-800/70 overflow-hidden shimmer" />
            <div className="h-12 w-full rounded-xl bg-aurax-300/60 dark:bg-aurax-700/70 overflow-hidden shimmer mt-2" />
          </div>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-md">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl bg-aurax-900 dark:bg-white text-aurax-50 dark:text-aurax-900 mb-4">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-aurax-500">
            للوصول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-80 relative overflow-hidden inline-flex items-center justify-center gap-2"
          >
            {submitting && (
              <span
                aria-hidden
                className="absolute inset-0 shimmer opacity-70"
              />
            )}
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
