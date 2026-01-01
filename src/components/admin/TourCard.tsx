import { Tour } from '@/types/tour';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Edit2, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onToggle }: TourCardProps) {
  const isAvailable = tour.availability === 'available';

  return (
    <Card className="group overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.image_url}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            className={isAvailable 
              ? 'bg-success text-success-foreground' 
              : 'bg-muted text-muted-foreground'
            }
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold">
          {tour.price.toLocaleString()} {tour.currency}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
          {tour.name}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{tour.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
          {tour.description}
        </p>

        {/* Features */}
        {tour.features && tour.features.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
              <Star className="w-3.5 h-3.5" />
              <span>المميزات</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tour.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                  {feature}
                </Badge>
              ))}
              {tour.features.length > 3 && (
                <Badge variant="outline" className="text-xs bg-muted">
                  +{tour.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tour)}
            className="flex-1 gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(tour.id)}
            className={isAvailable ? 'text-success hover:text-success' : 'text-muted-foreground'}
          >
            {isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(tour.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground mt-3">
          Updated: {new Date(tour.last_updated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
