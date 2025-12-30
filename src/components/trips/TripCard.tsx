import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users } from 'lucide-react';
import { Trip } from '@/data/trips';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TripCardProps {
  trip: Trip;
  index?: number;
}

const typeLabels: Record<string, string> = {
  historical: 'تاريخية',
  beach: 'شاطئية',
  desert: 'صحراوية',
  cultural: 'ثقافية',
  adventure: 'مغامرات',
};

export function TripCard({ trip, index = 0 }: TripCardProps) {
  return (
    <div 
      className="animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-large transition-all duration-500 bg-card">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={trip.images[0]}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-2">
            <Badge className="bg-accent text-accent-foreground font-medium">
              {typeLabels[trip.type]}
            </Badge>
            {trip.originalPrice && (
              <Badge variant="destructive" className="font-medium">
                خصم {Math.round((1 - trip.price / trip.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold text-sm">{trip.rating}</span>
            <span className="text-muted-foreground text-xs">({trip.reviewsCount})</span>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title & Location */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {trip.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{trip.city}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
            {trip.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{trip.duration} {trip.duration === 1 ? 'يوم' : 'أيام'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{trip.availableSeats} مقعد متاح</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-primary">{trip.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">جنيه</span>
              </div>
              {trip.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {trip.originalPrice.toLocaleString()} جنيه
                </span>
              )}
            </div>
            <Button asChild size="sm" className="shadow-soft hover:shadow-gold">
              <Link to={`/trips/${trip.id}`}>التفاصيل</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
