# 🪞 Aurax — Silver × Noir Store

متجر Aurax — تطبيق ويب فاخر للملابس والإكسسوارات بثيم فضي وأسود أنيق.

## 🛠️ التقنيات

| الفئة | التقنية |
| --- | --- |
| Framework | **React 18 + TypeScript** |
| Build Tool | **Vite** |
| Styling | **Tailwind CSS v3** + class-based dark mode |
| Routing | **React Router DOM v6** |
| Icons | **Lucide React** |
| Font | **Tajawal** (Arabic / English) |
| State | React Context (Theme + Cart) |
| Persistence | `localStorage` |

## 🎨 الألوان (Aurax Palette)

نظام ألوان مخصص (50→900) بدرجات تتدرج من الفضي الفاتح للأسود الفحمي:

```
50:  #F7F7F8     500: #7A808A   ← اللون الأساسي (silver)
100: #EDEEF0     600: #565B64
200: #D9DBDF     700: #3A3E45
300: #BDC1C7     800: #1F2226
400: #9AA0A8     900: #0B0C0E   ← الأسود (noir)
```

## 📁 هيكل المشروع

```
src/
├── components/        ← Navbar · Footer · ProductCard · ThemeToggle · Logo
├── context/           ← ThemeContext · CartContext
├── data/              ← products.ts (بيانات تجريبية + فئات)
├── pages/             ← Home · Shop · ProductDetail · Cart · Categories · About · NotFound
├── App.tsx            ← Router setup
├── main.tsx           ← Entry point
└── index.css          ← Tailwind + custom utilities
```

## 🚀 التشغيل

```bash
npm install
npm run dev      # تطوير → http://localhost:5173
npm run build    # إصدار إنتاجي
npm run preview  # معاينة بناء الإنتاج
```

## ✨ الميزات

- 🌓 **وضع داكن / فاتح** قابل للتبديل + حفظ التفضيل
- 🛒 **سلة تسوق** كاملة مع localStorage persistence
- 🔍 **بحث + فلاتر** (فئة، سعر، ترتيب)
- 📱 **تصميم متجاوب** بالكامل (موبايل / تابلت / ديسكتوب)
- 🌐 **دعم RTL كامل** للعربية
- 🎯 **6 فئات** + **12 منتج تجريبي** بصور عالية الجودة من Unsplash
- ⚡ **انيميشن سلسة** (shimmer · floaty · hover)

## 📄 الصفحات

| المسار | الصفحة |
| --- | --- |
| `/` | الرئيسية (Hero · فئات · منتجات مميزة · عروض) |
| `/shop` | المتجر مع فلاتر متقدمة |
| `/categories` | جميع الفئات |
| `/product/:id` | صفحة المنتج التفصيلية |
| `/cart` | سلة التسوق |
| `/about` | من نحن |

---

**Aurax © 2026 — Crafted with care.**
