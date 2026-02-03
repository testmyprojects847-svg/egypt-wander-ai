import { Star, CheckCircle } from 'lucide-react';
import type { Review } from '@/hooks/useReviews';
import { useI18n } from '@/contexts/I18nContext';

// Country code to flag emoji mapping
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Country code to name mapping (bilingual)
const countryNames: Record<string, { en: string; ar: string }> = {
  US: { en: 'USA', ar: 'أمريكا' },
  GB: { en: 'UK', ar: 'بريطانيا' },
  DE: { en: 'Germany', ar: 'ألمانيا' },
  FR: { en: 'France', ar: 'فرنسا' },
  ES: { en: 'Spain', ar: 'إسبانيا' },
  IT: { en: 'Italy', ar: 'إيطاليا' },
  RU: { en: 'Russia', ar: 'روسيا' },
  CN: { en: 'China', ar: 'الصين' },
  JP: { en: 'Japan', ar: 'اليابان' },
  PT: { en: 'Portugal', ar: 'البرتغال' },
  BR: { en: 'Brazil', ar: 'البرازيل' },
  EG: { en: 'Egypt', ar: 'مصر' },
  SA: { en: 'Saudi Arabia', ar: 'السعودية' },
  AE: { en: 'UAE', ar: 'الإمارات' },
  AU: { en: 'Australia', ar: 'أستراليا' },
  CA: { en: 'Canada', ar: 'كندا' },
};

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { language, t } = useI18n();
  const flag = getCountryFlag(review.country_code);
  const countryData = countryNames[review.country_code];
  const countryName = countryData 
    ? (language === 'ar' ? countryData.ar : countryData.en)
    : review.country_code;

  return (
    <div className="flex-shrink-0 w-[300px] md:w-[340px] bg-black border border-primary rounded-lg p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
      {/* Header with avatar and info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar placeholder */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-playfair text-lg font-bold">
            {review.customer_name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Star Rating */}
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.rating
                    ? 'fill-primary text-primary'
                    : 'fill-primary/20 text-primary/20'
                }`}
              />
            ))}
          </div>

          {/* Name and Country */}
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium text-sm truncate">
              {review.customer_name}
            </span>
            <span className="text-primary/60 text-xs">-</span>
            <span className="text-primary/60 text-xs">{countryName}</span>
            <span className="text-base">{flag}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-green-500 text-xs">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{t('verified')}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="text-primary/80 text-sm leading-relaxed line-clamp-3 font-cairo">
        "{review.comment}"
      </p>
    </div>
  );
}
