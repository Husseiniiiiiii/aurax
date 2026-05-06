import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Star, X } from "lucide-react";
import { api } from "../lib/api";

/** A local image state item — either an already-uploaded URL, or a pending File. */
export type ImageItem =
  | { kind: "url"; url: string }
  | { kind: "file"; file: File; preview: string };

interface Props {
  value: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  max?: number;
  /** Max compression width. Default 1200. */
  maxWidth?: number;
  /** JPEG quality 0-1. Default 0.82 */
  quality?: number;
}

/**
 * Pending images picker — holds File objects locally (no R2 upload on pick).
 * The first item is always the cover. Use `commitImages()` before submit to
 * upload pending Files to R2 and receive final URLs.
 */
export default function PendingImages({
  value,
  onChange,
  max = 4,
  maxWidth = 1200,
  quality = 0.82,
}: Props) {
  const slots = Array.from({ length: max }, (_, i) => value[i] || null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold text-aurax-300">
          <span className="text-aurax-500 font-normal">
            {value.length}/{max} صور
          </span>
        </div>
        {max > 1 && (
          <div className="text-[10px] text-aurax-500">الأولى هي الغلاف</div>
        )}
      </div>

      <div className={max > 1 ? "grid grid-cols-2 gap-2" : ""}>
        {slots.map((item, i) => (
          <Slot
            key={i}
            item={item}
            isCover={i === 0 && !!item}
            showCover={max > 1}
            maxWidth={maxWidth}
            quality={quality}
            onPicked={(next) => {
              const list = [...value];
              list[i] = next;
              onChange(list);
            }}
            onRemove={() => {
              const list = value.filter((_, idx) => idx !== i);
              onChange(list);
            }}
            onMakeCover={() => {
              const list = [...value];
              const [picked] = list.splice(i, 1);
              list.unshift(picked);
              onChange(list);
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface SlotProps {
  item: ImageItem | null;
  isCover: boolean;
  showCover: boolean;
  maxWidth: number;
  quality: number;
  onPicked: (item: ImageItem) => void;
  onRemove: () => void;
  onMakeCover: () => void;
}

function Slot({
  item,
  isCover,
  showCover,
  maxWidth,
  quality,
  onPicked,
  onRemove,
  onMakeCover,
}: SlotProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("ملف غير صالح");
      return;
    }
    setBusy(true);
    try {
      const blob = await compressImage(file, maxWidth, quality);
      const ext = blob.type === "image/webp" ? "webp" : "jpg";
      const f = new File([blob], `image.${ext}`, { type: blob.type });
      const preview = URL.createObjectURL(f);
      onPicked({ kind: "file", file: f, preview });
    } catch (e: any) {
      setErr(e?.message || "فشل");
    } finally {
      setBusy(false);
    }
  }

  const preview =
    item?.kind === "url" ? item.url : item?.kind === "file" ? item.preview : "";

  const open = () => fileRef.current?.click();

  return (
    <div className="relative aspect-square">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {preview ? (
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-aurax-700 bg-aurax-900">
          <img
            src={preview}
            alt="image"
            className="h-full w-full object-cover"
            onError={() => setErr("تعذّر العرض")}
          />
          {busy && <span className="absolute inset-0 shimmer" />}
          {showCover && isCover && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-aurax-900/80 backdrop-blur text-[9px] font-extrabold text-yellow-300 border border-yellow-300/40">
              <Star className="h-2.5 w-2.5 fill-yellow-300" />
              غلاف
            </span>
          )}
          <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between gap-1">
            {showCover && !isCover ? (
              <button
                type="button"
                onClick={onMakeCover}
                aria-label="جعلها الغلاف"
                className="h-6 px-1.5 inline-flex items-center gap-0.5 rounded-md bg-aurax-900/80 backdrop-blur text-[9px] font-bold text-aurax-100 border border-aurax-700 hover:border-white transition"
              >
                <Star className="h-2.5 w-2.5" />
                غلاف
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => {
                if (item?.kind === "file") URL.revokeObjectURL(item.preview);
                onRemove();
              }}
              aria-label="حذف"
              className="h-6 w-6 grid place-items-center rounded-md bg-red-500/90 text-white hover:bg-red-600 transition"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          disabled={busy}
          className="relative flex flex-col items-center justify-center gap-1 h-full w-full rounded-xl border border-dashed border-aurax-700 bg-aurax-900/30 hover:border-white transition overflow-hidden disabled:opacity-60"
        >
          {busy && <span className="absolute inset-0 shimmer" />}
          {busy ? (
            <Loader2 className="h-6 w-6 text-aurax-500 animate-spin" />
          ) : (
            <div className="relative">
              <ImagePlus className="h-6 w-6 text-aurax-400" />
              <Camera className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-aurax-200 bg-aurax-900 rounded-full p-0.5" />
            </div>
          )}
          <div className="text-[10px] font-bold text-aurax-300">
            {busy ? "..." : "إضافة"}
          </div>
        </button>
      )}

      {err && (
        <div className="absolute inset-x-0 -bottom-4 text-[9px] text-red-500 text-center">
          {err}
        </div>
      )}
    </div>
  );
}

/**
 * Uploads all pending File items and returns the final URL list (ordered).
 * Throws on any upload failure; caller must handle cleanup if desired.
 */
export async function commitImages(items: ImageItem[]): Promise<string[]> {
  const urls: string[] = [];
  for (const item of items) {
    if (item.kind === "url") {
      urls.push(item.url);
    } else {
      const { url } = await api.uploadImage(item.file);
      urls.push(url);
      URL.revokeObjectURL(item.preview);
    }
  }
  return urls;
}

/** Build initial items from an existing URL + extra URL list (edit mode). */
export function itemsFromUrls(cover: string, extra: string[] = []): ImageItem[] {
  const all = [cover, ...extra].filter(Boolean);
  return all.map((url) => ({ kind: "url", url }));
}

// Clean up object URLs when the owning page unmounts
export function useRevokeOnUnmount(items: ImageItem[]) {
  useEffect(() => {
    return () => {
      for (const it of items) {
        if (it.kind === "file") URL.revokeObjectURL(it.preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Compress an image using Canvas → WebP (fallback JPEG).
 * Uses progressive quality reduction to hit the target file size.
 */
function compressImage(
  file: File,
  maxDim: number,
  quality: number
): Promise<Blob> {
  const TARGET_KB = 300; // aim for ≤300KB
  const MIN_QUALITY = 0.55;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("فشل قراءة الملف"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("ملف صورة غير صالح"));
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas غير مدعوم"));

        // Enable image smoothing for better downscale quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);

        // Check if WebP is supported
        const supportsWebP = canvas
          .toDataURL("image/webp")
          .startsWith("data:image/webp");
        const mime = supportsWebP ? "image/webp" : "image/jpeg";

        // Progressive quality reduction to hit target size
        const tryCompress = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("فشل ضغط الصورة"));
              const sizeKB = blob.size / 1024;
              // If still too large and quality can go lower, try again
              if (sizeKB > TARGET_KB && q > MIN_QUALITY) {
                tryCompress(q - 0.08);
              } else {
                console.log(
                  `📸 Compressed: ${(file.size / 1024).toFixed(0)}KB → ${sizeKB.toFixed(0)}KB (${mime}, q=${q.toFixed(2)}, ${w}×${h})`
                );
                resolve(blob);
              }
            },
            mime,
            q
          );
        };

        tryCompress(quality);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
