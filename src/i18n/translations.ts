export type TranslationKey =
  | "nav.home"
  | "nav.shop"
  | "nav.categories"
  | "nav.about"
  | "nav.menu"
  | "nav.search"
  | "nav.wishlist"
  | "nav.account"
  | "nav.cart"
  | "nav.searchPlaceholder"
  | "common.viewAll"
  | "common.shopNow"
  | "common.exploreCategories"
  | "common.products"
  | "common.product"
  | "common.customer"
  | "common.rating"
  | "common.outOfStock"
  | "common.addToCart"
  | "common.buyNow"
  | "common.continueShopping"
  | "common.backToStore"
  | "common.backHome"
  | "common.language"
  | "common.theme"
  | "badge.new"
  | "badge.hot"
  | "badge.sale"
  | "badge.limited"
  | "shop.eyebrow"
  | "shop.allProducts"
  | "shop.searchResults"
  | "shop.sale"
  | "shop.filters"
  | "shop.clearAll"
  | "shop.category"
  | "shop.all"
  | "shop.maxPrice"
  | "shop.sort"
  | "shop.sortFeatured"
  | "shop.sortPriceAsc"
  | "shop.sortPriceDesc"
  | "shop.sortRating"
  | "shop.hideFilters"
  | "shop.showFilters"
  | "shop.noResults"
  | "shop.noResultsDesc"
  | "shop.clearFilters"
  | "categories.eyebrow"
  | "categories.title"
  | "categories.desc"
  | "categories.shop"
  | "categories.sectionWomen"
  | "categories.sectionMen"
  | "categories.aislePickCategory"
  | "categories.backToHub"
  | "cart.empty"
  | "cart.emptyDesc"
  | "cart.eyebrow"
  | "cart.title"
  | "cart.clear"
  | "cart.size"
  | "cart.summary"
  | "cart.subtotal"
  | "cart.shipping"
  | "cart.free"
  | "cart.total"
  | "cart.checkout"
  | "product.color"
  | "product.size"
  | "product.quantity"
  | "product.notFound"
  | "product.notFoundDesc"
  | "product.relatedTitle"
  | "product.fastShipping"
  | "product.fastShippingDesc"
  | "product.warranty"
  | "product.warrantyDesc"
  | "product.reviewsLabel"
  | "about.eyebrow"
  | "about.title"
  | "about.desc"
  | "about.visionChip"
  | "about.visionTitle"
  | "about.visionDesc"
  | "about.statsCustomer"
  | "about.statsProducts"
  | "about.statsRating"
  | "about.valuesEyebrow"
  | "about.valuesTitle"
  | "about.value1Title"
  | "about.value1Desc"
  | "about.value2Title"
  | "about.value2Desc"
  | "about.value3Title"
  | "about.value3Desc"
  | "about.value4Title"
  | "about.value4Desc"
  | "footer.newsletterTitle"
  | "footer.newsletterDesc"
  | "footer.emailPlaceholder"
  | "footer.subscribe"
  | "footer.brandDesc"
  | "footer.shopHeader"
  | "footer.linkAll"
  | "footer.linkMen"
  | "footer.linkWomen"
  | "footer.linkAccessories"
  | "footer.linkSale"
  | "footer.helpHeader"
  | "footer.linkAbout"
  | "footer.linkShipping"
  | "footer.linkReturns"
  | "footer.linkFaq"
  | "footer.linkPrivacy"
  | "footer.contactHeader"
  | "footer.address"
  | "footer.copyright"
  | "footer.developedBy"
  | "theme.dark"
  | "theme.light"
  | "theme.switchDark"
  | "theme.switchLight"
  | "theme.tapForDark"
  | "theme.tapForLight"
  | "notFound.title"
  | "notFound.desc"
  | "category.men"
  | "category.women"
  | "category.shoes"
  | "category.accessories"
  | "category.watches"
  | "category.bags";

type Entry = { ar: string; en: string };

export const translations: Record<TranslationKey, Entry> = {
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.shop": { ar: "المتجر", en: "Shop" },
  "nav.categories": { ar: "الفئات", en: "Categories" },
  "nav.about": { ar: "من نحن", en: "About" },
  "nav.menu": { ar: "القائمة", en: "Menu" },
  "nav.search": { ar: "بحث", en: "Search" },
  "nav.wishlist": { ar: "المفضلة", en: "Wishlist" },
  "nav.account": { ar: "الحساب", en: "Account" },
  "nav.cart": { ar: "السلة", en: "Cart" },
  "nav.searchPlaceholder": {
    ar: "ابحث عن منتج، فئة أو ماركة...",
    en: "Search for a product, category or brand...",
  },

  "common.viewAll": { ar: "عرض الكل", en: "View All" },
  "common.shopNow": { ar: "تسوق الآن", en: "Shop Now" },
  "common.exploreCategories": { ar: "استكشف الفئات", en: "Explore Categories" },
  "common.products": { ar: "منتج", en: "products" },
  "common.product": { ar: "منتج", en: "product" },
  "common.customer": { ar: "عميل", en: "customers" },
  "common.rating": { ar: "تقييم", en: "rating" },
  "common.outOfStock": { ar: "نفدت الكمية", en: "Out of stock" },
  "common.addToCart": { ar: "إضافة للسلة", en: "Add to cart" },
  "common.buyNow": { ar: "اشترِ الآن", en: "Buy now" },
  "common.continueShopping": { ar: "متابعة التسوق", en: "Continue shopping" },
  "common.backToStore": { ar: "العودة للمتجر", en: "Back to store" },
  "common.backHome": { ar: "العودة للرئيسية", en: "Back home" },
  "common.language": { ar: "اللغة", en: "Language" },
  "common.theme": { ar: "السمة", en: "Theme" },

  "badge.new": { ar: "جديد", en: "NEW" },
  "badge.hot": { ar: "الأكثر طلبًا", en: "HOT" },
  "badge.sale": { ar: "خصم", en: "SALE" },
  "badge.limited": { ar: "محدود", en: "LIMITED" },

  "shop.eyebrow": { ar: "متجر Aurax", en: "Aurax Store" },
  "shop.allProducts": { ar: "جميع المنتجات", en: "All Products" },
  "shop.searchResults": { ar: "نتائج البحث", en: "Search results" },
  "shop.sale": { ar: "العروض والتخفيضات", en: "Sale & Discounts" },
  "shop.filters": { ar: "الفلاتر", en: "Filters" },
  "shop.clearAll": { ar: "مسح الكل", en: "Clear all" },
  "shop.category": { ar: "الفئة", en: "Category" },
  "shop.all": { ar: "الكل", en: "All" },
  "shop.maxPrice": { ar: "السعر الأقصى", en: "Max price" },
  "shop.sort": { ar: "ترتيب:", en: "Sort:" },
  "shop.sortFeatured": { ar: "المميزة", en: "Featured" },
  "shop.sortPriceAsc": {
    ar: "السعر: من الأقل للأعلى",
    en: "Price: low to high",
  },
  "shop.sortPriceDesc": {
    ar: "السعر: من الأعلى للأقل",
    en: "Price: high to low",
  },
  "shop.sortRating": { ar: "الأعلى تقييمًا", en: "Top rated" },
  "shop.hideFilters": { ar: "إخفاء الفلاتر", en: "Hide filters" },
  "shop.showFilters": { ar: "الفلاتر", en: "Filters" },
  "shop.noResults": { ar: "لا توجد منتجات مطابقة", en: "No matching products" },
  "shop.noResultsDesc": {
    ar: "جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.",
    en: "Try adjusting filters or searching with different keywords.",
  },
  "shop.clearFilters": { ar: "مسح الفلاتر", en: "Clear filters" },

  "categories.eyebrow": { ar: "", en: "" },
  "categories.title": { ar: "فئات المتجر", en: "Store Categories" },
  "categories.desc": {
    ar: "اختر القسم النسائي أو الرجالي، ثم تصفّح الفئات المناسبة.",
    en: "Choose women's or men's, then browse the matching categories.",
  },
  "categories.shop": { ar: "تسوّق", en: "Shop" },
  "categories.sectionWomen": { ar: "قسم نسائي", en: "Women's section" },
  "categories.sectionMen": { ar: "قسم رجالي", en: "Men's section" },
  "categories.aislePickCategory": {
    ar: "اختر إحدى الفئات أدناه للانتقال إلى المتجر.",
    en: "Pick a category below to open the shop.",
  },
  "categories.backToHub": {
    ar: "عودة لاختيار القسم",
    en: "Back to choose section",
  },

  "cart.empty": { ar: "سلتك فارغة", en: "Your cart is empty" },
  "cart.emptyDesc": {
    ar: "لم تضف أي منتجات بعد. ابدأ التسوق الآن واكتشف تشكيلتنا الفاخرة.",
    en: "You haven't added any products yet. Start shopping now and discover our luxury collection.",
  },
  "cart.eyebrow": { ar: "سلة التسوق", en: "Shopping cart" },
  "cart.title": { ar: "سلة التسوق", en: "Shopping Cart" },
  "cart.clear": { ar: "إفراغ السلة", en: "Clear cart" },
  "cart.size": { ar: "المقاس", en: "Size" },
  "cart.summary": { ar: "ملخص الطلب", en: "Order summary" },
  "cart.subtotal": { ar: "المجموع الفرعي", en: "Subtotal" },
  "cart.shipping": { ar: "سعر التوصيل", en: "Shipping" },
  "cart.free": { ar: "مجاني", en: "Free" },
  "cart.total": { ar: "الإجمالي", en: "Total" },
  "cart.checkout": { ar: "إتمام الشراء", en: "Checkout" },

  "product.color": { ar: "اللون", en: "Color" },
  "product.size": { ar: "المقاس", en: "Size" },
  "product.quantity": { ar: "الكمية", en: "Quantity" },
  "product.notFound": { ar: "المنتج غير موجود", en: "Product not found" },
  "product.notFoundDesc": {
    ar: "قد يكون قد تم حذفه أو نقله.",
    en: "It may have been removed or moved.",
  },
  "product.relatedTitle": {
    ar: "منتجات قد تعجبك",
    en: "You may also like",
  },
  "product.fastShipping": { ar: "شحن سريع", en: "Fast shipping" },
  "product.fastShippingDesc": {
    ar: "2–5 أيام عمل",
    en: "2–5 business days",
  },
  "product.warranty": { ar: "ضمان أصلي", en: "Original warranty" },
  "product.warrantyDesc": { ar: "جودة بريميوم", en: "Premium quality" },
  "product.reviewsLabel": { ar: "تقييم", en: "reviews" },

  "about.eyebrow": { ar: "من نحن", en: "About us" },
  "about.title": { ar: "قصة Aurax", en: "The Aurax Story" },
  "about.desc": {
    ar: "وُلِدت Aurax من شغف بالتفاصيل وحب لخطوط التصميم النظيفة. نمزج بين الفضي العصري والأسود الكلاسيكي لنخلق أسلوبًا فريدًا يعكس شخصيتك. أكثر من مجرد متجر — نحن منصة للأناقة المعاصرة.",
    en: "Aurax was born from a passion for detail and a love for clean design. We blend modern silver with classic black to create a unique style that reflects your personality. More than a store — a platform for contemporary elegance.",
  },
  "about.visionChip": { ar: "رؤيتنا", en: "Our vision" },
  "about.visionTitle": {
    ar: "نُعيد تعريف الأناقة العصرية",
    en: "Redefining modern elegance",
  },
  "about.visionDesc": {
    ar: "نسعى لتقديم تجربة تسوق راقية تجمع بين الجودة الفاخرة وأسعار تنافسية. كل منتج في Aurax يُختار بعناية ليلبي تطلعات عميل يعرف ما يريد ويستحق الأفضل.",
    en: "We strive to deliver a refined shopping experience that combines luxury quality with competitive prices. Every Aurax product is carefully chosen for the customer who knows what they want and deserves the best.",
  },
  "about.statsCustomer": { ar: "عميل سعيد", en: "happy customers" },
  "about.statsProducts": { ar: "منتج", en: "products" },
  "about.statsRating": { ar: "تقييم", en: "rating" },
  "about.valuesEyebrow": { ar: "ما يميزنا", en: "What sets us apart" },
  "about.valuesTitle": { ar: "قيم Aurax", en: "Aurax Values" },
  "about.value1Title": { ar: "جودة بريميوم", en: "Premium quality" },
  "about.value1Desc": {
    ar: "نختار أفضل الخامات والتفاصيل لنقدم منتجات تستحق الثقة.",
    en: "We pick the finest materials and details to deliver products you can trust.",
  },
  "about.value2Title": {
    ar: "تجربة عميل استثنائية",
    en: "Exceptional customer experience",
  },
  "about.value2Desc": {
    ar: "فريق دعم مخصص يرافقك في كل خطوة من رحلة الشراء.",
    en: "A dedicated support team that accompanies you at every step.",
  },
  "about.value3Title": { ar: "تصاميم عالمية", en: "Global designs" },
  "about.value3Desc": {
    ar: "تشكيلات مستوحاة من أحدث صيحات الموضة العالمية.",
    en: "Collections inspired by the latest global fashion trends.",
  },
  "about.value4Title": { ar: "موثوقية", en: "Reliability" },
  "about.value4Desc": {
    ar: "ضمان أصلي على جميع المنتجات وسياسة استبدال مرنة.",
    en: "Original warranty on all products and a flexible exchange policy.",
  },

  "footer.newsletterTitle": {
    ar: "انضم لعائلة Aurax",
    en: "Join the Aurax family",
  },
  "footer.newsletterDesc": {
    ar: "اشترك في النشرة البريدية واحصل على آخر التشكيلات الحصرية.",
    en: "Subscribe to our newsletter and get the latest exclusive collections.",
  },
  "footer.emailPlaceholder": {
    ar: "بريدك الإلكتروني",
    en: "Your email address",
  },
  "footer.subscribe": { ar: "اشترك", en: "Subscribe" },
  "footer.brandDesc": {
    ar: "متجر Aurax — وجهتك الأولى للأناقة العصرية، نقدم لك تشكيلة فاخرة من الملابس والإكسسوارات بلمسة فضية وسوداء فريدة.",
    en: "Aurax — your first destination for modern elegance, offering a luxury collection of clothing and accessories with a unique silver and black touch.",
  },
  "footer.shopHeader": { ar: "المتجر", en: "Shop" },
  "footer.linkAll": { ar: "جميع المنتجات", en: "All products" },
  "footer.linkMen": { ar: "رجالي", en: "Men" },
  "footer.linkWomen": { ar: "نسائي", en: "Women" },
  "footer.linkAccessories": { ar: "إكسسوارات", en: "Accessories" },
  "footer.linkSale": { ar: "العروض", en: "Sale" },
  "footer.helpHeader": { ar: "المساعدة", en: "Help" },
  "footer.linkAbout": { ar: "من نحن", en: "About us" },
  "footer.linkShipping": { ar: "الشحن والتوصيل", en: "Shipping & delivery" },
  "footer.linkReturns": {
    ar: "الاستبدال والإرجاع",
    en: "Exchange & returns",
  },
  "footer.linkFaq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "footer.linkPrivacy": { ar: "سياسة الخصوصية", en: "Privacy policy" },
  "footer.contactHeader": { ar: "تواصل معنا", en: "Contact us" },
  "footer.address": {
    ar: "بغداد، العراق",
    en: "Baghdad, Iraq",
  },
  "footer.copyright": {
    ar: "Aurax. جميع الحقوق محفوظة.",
    en: "Aurax. All rights reserved.",
  },
  "footer.developedBy": {
    ar: "تم التطوير بواسطة حسين سعد",
    en: "Developed by Hussein Saad",
  },

  "theme.dark": { ar: "الوضع الداكن", en: "Dark mode" },
  "theme.light": { ar: "الوضع الفاتح", en: "Light mode" },
  "theme.switchDark": {
    ar: "تفعيل الوضع الداكن",
    en: "Switch to dark mode",
  },
  "theme.switchLight": {
    ar: "تفعيل الوضع الفاتح",
    en: "Switch to light mode",
  },
  "theme.tapForDark": { ar: "للداكن", en: "Dark" },
  "theme.tapForLight": { ar: "للفاتح", en: "Light" },

  "notFound.title": { ar: "الصفحة غير موجودة", en: "Page not found" },
  "notFound.desc": {
    ar: "الصفحة التي تبحث عنها قد تكون قد نُقلت أو غير متاحة حالياً.",
    en: "The page you are looking for may have been moved or is unavailable.",
  },

  "category.men": { ar: "ملابس رجالية", en: "Men's Clothing" },
  "category.women": { ar: "ملابس نسائية", en: "Women's Clothing" },
  "category.shoes": { ar: "أحذية", en: "Shoes" },
  "category.accessories": { ar: "إكسسوارات", en: "Accessories" },
  "category.watches": { ar: "ساعات", en: "Watches" },
  "category.bags": { ar: "حقائب", en: "Bags" },
};
