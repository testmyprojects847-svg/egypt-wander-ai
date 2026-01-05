import { Tour } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit2, ThumbsUp, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onToggle }: TourCardProps) {
  const isAvailable = tour.availability === 'available';

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.image_url || '/placeholder.svg'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">5k</span>
          </div>
          <span className="text-primary font-bold">
            ~{tour.price.toLocaleString()} {tour.currency}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
          {tour.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
          {tour.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>{tour.duration}</span>
        </div>

        {/* Tags & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tour.best_for && tour.best_for.slice(0, 1).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-primary/10 text-primary border-primary/30 uppercase font-medium"
              >
                {tag}
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className="text-xs bg-accent/10 text-accent border-accent/30 uppercase font-medium"
            >
              {tour.city}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tour)}
              className="gap-1.5 text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge 
              className={isAvailable 
                ? 'bg-success/10 text-success border-success/30' 
                : 'bg-muted text-muted-foreground'
              }
              variant="outline"
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
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
        </div>
      </div>
    </div>
  );
}
