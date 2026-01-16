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
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 relative">
      {/* Time Badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-primary text-black text-xs px-3 py-1 rounded-full font-medium">
          {timeAgo}
        </span>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        
        {/* Name */}
        <h3 className="mt-3 text-lg font-bold text-primary text-center font-playfair">
          {tourist.full_name}
        </h3>
        
        {/* ID Badge */}
        <span className="mt-1 bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-semibold">
          T-{tourist.id.slice(0, 4).toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {/* Email */}
        <div className="flex items-center gap-2 text-primary/70">
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate">{tourist.email || 'No email'}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-primary/70">
          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{tourist.phone || 'No phone'}</span>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 text-primary/70">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{format(new Date(tourist.created_at), "dd-MM-yyyy hh:mm a")}</span>
        </div>

        {/* Nationality */}
        <div className="flex items-center gap-2 text-primary/70">
          <Globe className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{tourist.nationality}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-primary/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(tourist)}
          className="flex-1 text-xs gap-1 border-primary/30 text-primary hover:bg-primary hover:text-black transition-colors"
        >
          <Edit className="w-3 h-3" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(tourist.id)}
          className="flex-1 text-xs gap-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </div>
    </div>
  );
};
