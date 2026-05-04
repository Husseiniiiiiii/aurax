export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  badge?: "new" | "hot" | "sale" | "limited";
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  featured?: boolean;
}

export type CategoryId =
  | "men"
  | "women"
  | "shoes"
  | "accessories"
  | "watches"
  | "bags";

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  nameKey:
    | "category.men"
    | "category.women"
    | "category.shoes"
    | "category.accessories"
    | "category.watches"
    | "category.bags";
  image: string;
  count: number;
}

export const categories: Category[] = [
  {
    id: "men",
    name: "ملابس رجالية",
    nameEn: "Men",
    nameKey: "category.men",
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop",
    count: 124,
  },
  {
    id: "women",
    name: "ملابس نسائية",
    nameEn: "Women",
    nameKey: "category.women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    count: 156,
  },
  {
    id: "shoes",
    name: "أحذية",
    nameEn: "Shoes",
    nameKey: "category.shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    count: 88,
  },
  {
    id: "accessories",
    name: "إكسسوارات",
    nameEn: "Accessories",
    nameKey: "category.accessories",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop",
    count: 64,
  },
  {
    id: "watches",
    name: "ساعات",
    nameEn: "Watches",
    nameKey: "category.watches",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop",
    count: 42,
  },
  {
    id: "bags",
    name: "حقائب",
    nameEn: "Bags",
    nameKey: "category.bags",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
    count: 38,
  },
];

export type GenderAisleId = "women" | "men";

const AISLE_CATEGORY_ORDER: Record<GenderAisleId, CategoryId[]> = {
  women: ["women", "shoes", "accessories", "watches", "bags"],
  men: ["men", "shoes", "accessories", "watches", "bags"],
};

export function getCategoriesForAisle(aisle: GenderAisleId): Category[] {
  return AISLE_CATEGORY_ORDER[aisle]
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is Category => c !== undefined);
}

export function isGenderAisleParam(s: string | undefined): s is GenderAisleId {
  return s === "women" || s === "men";
}

export const products: Product[] = [
  {
    id: "p1",
    name: "جاكيت جلد كلاسيكي",
    nameEn: "Classic Leather Jacket",
    category: "men",
    price: 459,
    oldPrice: 599,
    rating: 4.8,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop",
    description:
      "جاكيت جلد طبيعي بقصة عصرية وتفاصيل معدنية فضية فاخرة، مثالي للإطلالات الجريئة.",
    badge: "sale",
    colors: ["#0B0C0E", "#3A3E45", "#7A808A"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "p2",
    name: "فستان سهرة فضي",
    nameEn: "Silver Evening Dress",
    category: "women",
    price: 689,
    rating: 4.9,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop",
    description:
      "فستان سهرة بلمسة معدنية فضية وقصة انسيابية تمنحك إطلالة ملكية أنيقة.",
    badge: "new",
    colors: ["#BDC1C7", "#0B0C0E"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
  },
  {
    id: "p3",
    name: "حذاء رياضي بريميوم",
    nameEn: "Premium Sneakers",
    category: "shoes",
    price: 329,
    oldPrice: 399,
    rating: 4.7,
    reviews: 213,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    description:
      "حذاء رياضي عصري مصنوع من خامات فاخرة بألوان فضية وسوداء أنيقة وراحة استثنائية.",
    badge: "hot",
    colors: ["#FFFFFF", "#0B0C0E", "#7A808A"],
    sizes: ["40", "41", "42", "43", "44"],
    inStock: true,
  },
  {
    id: "p4",
    name: "ساعة كرونوغراف فضية",
    nameEn: "Silver Chronograph Watch",
    category: "watches",
    price: 1299,
    rating: 5.0,
    reviews: 56,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
    description:
      "ساعة كرونوغراف فاخرة بإطار ستانلس ستيل فضي ومينا أسود لمسة تكنولوجية أنيقة.",
    badge: "limited",
    colors: ["#BDC1C7", "#0B0C0E"],
    inStock: true,
  },
  {
    id: "p5",
    name: "نظارة شمسية أنيقة",
    nameEn: "Elegant Sunglasses",
    category: "accessories",
    price: 179,
    oldPrice: 229,
    rating: 4.6,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
    description:
      "نظارة شمسية بإطار معدني فضي وعدسات سوداء بحماية UV400 لإطلالة جذابة.",
    badge: "sale",
    colors: ["#0B0C0E", "#7A808A"],
    inStock: true,
  },
  {
    id: "p6",
    name: "حقيبة يد جلدية",
    nameEn: "Leather Handbag",
    category: "bags",
    price: 549,
    rating: 4.8,
    reviews: 71,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
    description:
      "حقيبة يد من الجلد الطبيعي بتصميم عصري وتفاصيل فضية فاخرة لإطلالة راقية.",
    colors: ["#0B0C0E", "#3A3E45"],
    inStock: true,
  },
  {
    id: "p7",
    name: "قميص قطن بريميوم",
    nameEn: "Premium Cotton Shirt",
    category: "men",
    price: 189,
    rating: 4.5,
    reviews: 134,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop",
    description:
      "قميص قطن مصري بقصة سليم فت ولون أسود راقٍ يناسب المناسبات الرسمية وغير الرسمية.",
    badge: "new",
    colors: ["#0B0C0E", "#FFFFFF", "#7A808A"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
  },
  {
    id: "p8",
    name: "بلوزة حريرية",
    nameEn: "Silk Blouse",
    category: "women",
    price: 259,
    oldPrice: 319,
    rating: 4.7,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=800&auto=format&fit=crop",
    description:
      "بلوزة حريرية فاخرة بقصة فضفاضة وتفاصيل أنيقة لإطلالة عصرية متجددة.",
    badge: "sale",
    colors: ["#BDC1C7", "#0B0C0E"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
  },
  {
    id: "p9",
    name: "حزام جلد فاخر",
    nameEn: "Luxury Leather Belt",
    category: "accessories",
    price: 129,
    rating: 4.6,
    reviews: 45,
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop",
    description:
      "حزام جلد طبيعي بإبزيم معدني فضي مميز يضيف لمسة فخامة لأي إطلالة.",
    colors: ["#0B0C0E", "#3A3E45"],
    inStock: true,
  },
  {
    id: "p10",
    name: "حذاء كلاسيكي رسمي",
    nameEn: "Classic Formal Shoes",
    category: "shoes",
    price: 389,
    rating: 4.8,
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop",
    description:
      "حذاء رسمي من الجلد الإيطالي بقصة كلاسيكية مثالي للمناسبات الفاخرة.",
    colors: ["#0B0C0E"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    inStock: true,
  },
  {
    id: "p11",
    name: "ساعة ذكية AURAX X1",
    nameEn: "AURAX X1 Smartwatch",
    category: "watches",
    price: 899,
    oldPrice: 1099,
    rating: 4.9,
    reviews: 187,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop",
    description:
      "ساعة ذكية بشاشة AMOLED وحساسات صحية متقدمة، تجمع التقنية بالأناقة الفضية.",
    badge: "hot",
    colors: ["#0B0C0E", "#BDC1C7"],
    inStock: true,
  },
  {
    id: "p12",
    name: "حقيبة ظهر عصرية",
    nameEn: "Modern Backpack",
    category: "bags",
    price: 299,
    rating: 4.6,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
    description:
      "حقيبة ظهر عصرية مقاومة للماء بمساحة واسعة وتصميم أنيق يناسب الحياة اليومية.",
    badge: "new",
    colors: ["#0B0C0E", "#3A3E45"],
    inStock: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return products.filter((p) => p.category === categoryId);
}
