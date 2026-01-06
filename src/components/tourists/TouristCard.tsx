import { Tourist } from "@/hooks/useTourists";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Mail, Phone, Calendar, Globe, User, Edit, Trash2 } from "lucide-react";

interface TouristCardProps {
  tourist: Tourist;
  onEdit: (tourist: Tourist) => void;
  onDelete: (id: string) => void;
}

export const TouristCard = ({ tourist, onEdit, onDelete }: TouristCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(tourist.created_at), { addSuffix: true });
  
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 relative">
      {/* Time Badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
          {timeAgo}
        </span>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center border-4 border-primary/20">
          <User className="w-10 h-10 text-primary" />
        </div>
        
        {/* Name */}
        <h3 className="mt-3 text-lg font-bold text-foreground text-center">
          {tourist.full_name}
        </h3>
        
        {/* ID Badge */}
        <span className="mt-1 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-semibold">
          T-{tourist.id.slice(0, 4).toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {/* Email */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate">{tourist.email || 'No email'}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{tourist.phone || 'No phone'}</span>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{format(new Date(tourist.created_at), "dd-MM-yyyy hh:mm a")}</span>
        </div>

        {/* Nationality */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{tourist.nationality}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(tourist)}
          className="flex-1 text-xs gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Edit className="w-3 h-3" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(tourist.id)}
          className="flex-1 text-xs gap-1 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </div>
    </div>
  );
};
