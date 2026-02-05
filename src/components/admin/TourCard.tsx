import { Tour, getDiscountedPrice, getTourismTypeLabel, getCityLabel } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit2, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onToggle }: TourCardProps) {
  const isAvailable = tour.availability === 'available';
  const hasDiscount = tour.discount_percentage && tour.discount_percentage > 0;
  const priceEgp = tour.price_egp || tour.price;
  const priceUsd = tour.price_usd || null;

  return (
    <div className="group rounded-lg overflow-hidden border border-primary/30 hover:border-primary bg-black transition-all duration-300 hover:shadow-[0_0_20px_hsla(42,70%,52%,0.2)]">
      {/* Image Container */}
      <div className="p-2 pb-0">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <img
            src={tour.image_url || 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Tourism Type Badge */}
          {tour.tourism_type && (
            <Badge className="absolute top-1.5 left-1.5 bg-primary/90 text-black text-[10px] px-1.5 py-0.5 font-playfair border-0">
              {getTourismTypeLabel(tour.tourism_type, 'en')}
            </Badge>
          )}
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 font-bold border-0">
              {tour.discount_percentage}% OFF
            </Badge>
          )}
          {/* Availability Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-gray-600/90 text-white text-xs font-bold">
                DRAFT
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 pt-2">
        <h3 className="font-playfair text-primary text-xs font-semibold tracking-wide mb-0.5 line-clamp-1 uppercase">
          {tour.name}
        </h3>
        <p className="text-primary/40 font-playfair text-[10px] tracking-wide mb-1.5 line-clamp-1">
          {tour.description || 'Exclusive guided experience'}
        </p>
        
        {/* Duration & City */}
        <div className="flex items-center gap-2 text-[10px] text-primary/50 mb-2">
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
          <span>{tour.duration}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3" />
            <span>{getCityLabel(tour.city, 'en')}</span>
          </span>
        </div>
        
        {/* Price with Discount */}
        <div className="flex items-baseline gap-1.5 mb-2">
          {hasDiscount ? (
            <>
              <span className="text-primary font-playfair text-sm font-bold">
                {getDiscountedPrice(priceEgp, tour.discount_percentage!).toLocaleString()} EGP
              </span>
              <span className="text-primary/40 font-playfair text-[10px] line-through">
                {priceEgp.toLocaleString()} EGP
              </span>
            </>
          ) : (
            <span className="text-primary font-playfair text-sm font-bold">
              {priceEgp.toLocaleString()} EGP
            </span>
          )}
          {priceUsd && (
            <span className="text-primary/50 font-playfair text-[10px]">
              (${priceUsd.toLocaleString()})
            </span>
          )}
        </div>
        
        {/* Admin Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/20">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(tour.id)}
              className={`h-7 px-2 ${isAvailable ? 'text-green-500 hover:text-green-400' : 'text-primary/50 hover:text-primary'}`}
              title={isAvailable ? 'Set as Draft' : 'Publish'}
            >
              {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(tour.id)}
              className="h-7 px-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tour)}
            className="h-7 px-2 gap-1 text-primary border-primary/30 hover:bg-primary hover:text-black text-xs"
            >
            <Edit2 className="w-3 h-3" />
              Edit
            </Button>
        </div>
      </div>
    </div>
  );
}
