export interface Trip {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number;
  originalPrice?: number;
  duration: number;
  type: 'cultural' | 'adventure' | 'beach' | 'desert' | 'historical';
  rating: number;
  reviewsCount: number;
  availableSeats: number;
  images: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  includes: string[];
  excludes: string[];
}

export const trips: Trip[] = [
  {
    id: "1",
    title: "رحلة الأقصر وأسوان الساحرة",
    description: "استكشف روعة الحضارة الفرعونية في رحلة مميزة تجمع بين معابد الأقصر الشهيرة ومعبد أبو سمبل العظيم وجمال النيل في أسوان",
    city: "الأقصر - أسوان",
    price: 4500,
    originalPrice: 5500,
    duration: 5,
    type: 'historical',
    rating: 4.9,
    reviewsCount: 234,
    availableSeats: 12,
    images: [
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800",
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800",
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800"
    ],
    highlights: [
      "زيارة معبد الكرنك",
      "جولة في وادي الملوك",
      "رحلة نيلية بالفلوكة",
      "معبد أبو سمبل"
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى الأقصر", description: "استقبال في المطار والتوجه للفندق، جولة مسائية في كورنيش الأقصر" },
      { day: 2, title: "الضفة الغربية", description: "زيارة وادي الملوك ومعبد حتشبسوت وتمثالي ممنون" },
      { day: 3, title: "معبد الكرنك", description: "جولة في معبد الكرنك ومعبد الأقصر، عرض الصوت والضوء مساءً" },
      { day: 4, title: "الرحلة إلى أسوان", description: "رحلة بالقطار إلى أسوان، زيارة معبد فيلة ورحلة بالفلوكة" },
      { day: 5, title: "معبد أبو سمبل", description: "رحلة صباحية لمعبد أبو سمبل والعودة" }
    ],
    includes: ["الإقامة 4 ليالي", "الإفطار والعشاء", "المواصلات", "دليل سياحي", "رسوم الدخول"],
    excludes: ["تذاكر الطيران", "المشروبات", "الإكراميات"]
  },
  {
    id: "2",
    title: "سحر شرم الشيخ",
    description: "استمتع بأجمل شواطئ البحر الأحمر والشعاب المرجانية الخلابة في رحلة استرخاء لا تُنسى",
    city: "شرم الشيخ",
    price: 3200,
    duration: 4,
    type: 'beach',
    rating: 4.7,
    reviewsCount: 189,
    availableSeats: 20,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800"
    ],
    highlights: [
      "الغوص في رأس محمد",
      "رحلة سفاري صحراوية",
      "السنوركلينج",
      "خليج نعمة"
    ],
    itinerary: [
      { day: 1, title: "الوصول", description: "الوصول والاستقرار في المنتجع" },
      { day: 2, title: "رأس محمد", description: "رحلة غوص في محمية رأس محمد" },
      { day: 3, title: "سفاري", description: "رحلة سفاري صحراوية مع عشاء بدوي" },
      { day: 4, title: "يوم حر والمغادرة", description: "يوم حر على الشاطئ ثم المغادرة" }
    ],
    includes: ["الإقامة 3 ليالي", "الإفطار", "رحلة الغوص", "السفاري"],
    excludes: ["تذاكر الطيران", "الغداء والعشاء"]
  },
  {
    id: "3",
    title: "الأهرامات والحضارة الفرعونية",
    description: "رحلة يوم كامل لاستكشاف أهرامات الجيزة العظيمة وأبو الهول والمتحف المصري الكبير",
    city: "القاهرة",
    price: 850,
    duration: 1,
    type: 'historical',
    rating: 4.8,
    reviewsCount: 456,
    availableSeats: 30,
    images: [
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800"
    ],
    highlights: [
      "أهرامات الجيزة الثلاثة",
      "أبو الهول",
      "المتحف المصري الكبير",
      "عرض الصوت والضوء"
    ],
    itinerary: [
      { day: 1, title: "جولة كاملة", description: "زيارة الأهرامات صباحاً، الغداء، المتحف المصري الكبير، عرض الصوت والضوء مساءً" }
    ],
    includes: ["المواصلات", "الغداء", "رسوم الدخول", "دليل سياحي"],
    excludes: ["الإكراميات"]
  },
  {
    id: "4",
    title: "مغامرة الصحراء البيضاء",
    description: "استكشف سحر الصحراء البيضاء الفريدة والواحات البحرية في رحلة مغامرة لا تُنسى تحت النجوم",
    city: "الواحات البحرية",
    price: 2800,
    duration: 3,
    type: 'desert',
    rating: 4.6,
    reviewsCount: 98,
    availableSeats: 8,
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800"
    ],
    highlights: [
      "الصحراء البيضاء",
      "الصحراء السوداء",
      "الكامب تحت النجوم",
      "الينابيع الساخنة"
    ],
    itinerary: [
      { day: 1, title: "الانطلاق", description: "الانطلاق من القاهرة إلى الواحات البحرية" },
      { day: 2, title: "الصحراء البيضاء", description: "استكشاف الصحراء البيضاء والسوداء، الكامب تحت النجوم" },
      { day: 3, title: "العودة", description: "زيارة الينابيع الساخنة والعودة للقاهرة" }
    ],
    includes: ["المواصلات", "الوجبات", "الكامب", "المرشد"],
    excludes: ["المشروبات"]
  },
  {
    id: "5",
    title: "الإسكندرية عروس البحر المتوسط",
    description: "اكتشف جمال الإسكندرية التاريخية من مكتبة الإسكندرية إلى قلعة قايتباي وكورنيش البحر",
    city: "الإسكندرية",
    price: 1200,
    duration: 2,
    type: 'cultural',
    rating: 4.5,
    reviewsCount: 167,
    availableSeats: 25,
    images: [
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800"
    ],
    highlights: [
      "مكتبة الإسكندرية",
      "قلعة قايتباي",
      "المسرح الروماني",
      "كورنيش الإسكندرية"
    ],
    itinerary: [
      { day: 1, title: "الوصول والجولة", description: "الوصول، زيارة مكتبة الإسكندرية والمتحف القومي" },
      { day: 2, title: "قايتباي والكورنيش", description: "قلعة قايتباي، المسرح الروماني، جولة الكورنيش والعودة" }
    ],
    includes: ["المواصلات", "الإقامة ليلة", "الإفطار", "رسوم الدخول"],
    excludes: ["الغداء والعشاء"]
  },
  {
    id: "6",
    title: "الغردقة - جنة البحر الأحمر",
    description: "استمتع بعطلة مثالية على شواطئ الغردقة مع أنشطة مائية متنوعة ومنتجعات فاخرة",
    city: "الغردقة",
    price: 2900,
    originalPrice: 3500,
    duration: 4,
    type: 'beach',
    rating: 4.7,
    reviewsCount: 203,
    availableSeats: 15,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800"
    ],
    highlights: [
      "جزيرة الجفتون",
      "الغوص والسنوركلينج",
      "رحلة الغروب",
      "السوق القديم"
    ],
    itinerary: [
      { day: 1, title: "الوصول", description: "الوصول والاستقرار في المنتجع" },
      { day: 2, title: "جزيرة الجفتون", description: "رحلة بحرية لجزيرة الجفتون مع الغداء" },
      { day: 3, title: "الغوص", description: "جلسة غوص أو سنوركلينج" },
      { day: 4, title: "المغادرة", description: "يوم حر والمغادرة" }
    ],
    includes: ["الإقامة 3 ليالي شامل الإفطار", "رحلة الجفتون", "الغوص"],
    excludes: ["تذاكر الطيران"]
  }
];

export const cities = ["القاهرة", "الأقصر - أسوان", "شرم الشيخ", "الغردقة", "الإسكندرية", "الواحات البحرية"];
export const tripTypes = [
  { value: 'historical', label: 'تاريخية' },
  { value: 'beach', label: 'شاطئية' },
  { value: 'desert', label: 'صحراوية' },
  { value: 'cultural', label: 'ثقافية' },
  { value: 'adventure', label: 'مغامرات' }
];
