import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users } from 'lucide-react';
import { Trip } from '@/data/trips';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TripCardProps {
  trip: Trip;
  index?: number;
}

const typeLabels: Record<string, string> = {
  historical: 'Historical',
  beach: 'Beach',
  desert: 'Desert',
  cultural: 'Cultural',
  adventure: 'Adventure',
};

export function TripCard({ trip, index = 0 }: TripCardProps) {
  return (
    <motion.div 
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 30px hsla(45, 90%, 50%, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={trip.images[0]}
            alt={trip.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-primary text-primary-foreground font-medium">
              {typeLabels[trip.type]}
            </Badge>
            {trip.originalPrice && (
              <Badge variant="destructive" className="font-medium">
                {Math.round((1 - trip.price / trip.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-semibold text-sm text-foreground">{trip.rating}</span>
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
              <MapPin className="w-4 h-4 text-primary" />
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
              <span>{trip.duration} {trip.duration === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{trip.availableSeats} seats available</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-primary">{trip.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">EGP</span>
              </div>
              {trip.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {trip.originalPrice.toLocaleString()} EGP
                </span>
              )}
            </div>
            <Button asChild size="sm" className="btn-gold">
              <Link to={`/trips/${trip.id}`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}