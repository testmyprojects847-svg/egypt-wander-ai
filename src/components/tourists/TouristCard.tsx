import { Tourist } from "@/hooks/useTourists";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TouristCardProps {
  tourist: Tourist;
  onEdit: (tourist: Tourist) => void;
  onDelete: (id: string) => void;
}

export const TouristCard = ({ tourist, onEdit, onDelete }: TouristCardProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors border border-border/50">
      {/* Checkbox placeholder / Avatar */}
      <div className="h-8 w-8 rounded-full bg-border/50 flex items-center justify-center flex-shrink-0">
        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <span className="font-medium text-foreground truncate block">{tourist.full_name}</span>
      </div>

      {/* Email/Phone */}
      <div className="hidden sm:block flex-1 min-w-0">
        <span className="text-sm text-muted-foreground truncate block">
          {tourist.email ? `Email: ${tourist.email}` : `Phone: ${tourist.phone}`}
        </span>
      </div>

      {/* Registration Date */}
      <div className="hidden md:block flex-shrink-0">
        <span className="text-sm text-muted-foreground">
          {format(new Date(tourist.created_at), "MMM d, yyyy")}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(tourist)}
          className="text-xs px-3 py-1 h-7 bg-muted hover:bg-muted-foreground/10"
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDelete(tourist.id)}
          className="text-xs px-3 py-1 h-7 bg-accent text-accent-foreground hover:bg-accent-dark"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
