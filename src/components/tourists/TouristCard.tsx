import { Tourist } from "@/hooks/useTourists";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Languages, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  Heart
} from "lucide-react";
import { format } from "date-fns";

interface TouristCardProps {
  tourist: Tourist;
  onEdit: (tourist: Tourist) => void;
  onDelete: (id: string) => void;
}

export const TouristCard = ({ tourist, onEdit, onDelete }: TouristCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#c9a227] bg-gradient-to-r from-white to-[#f5f0e1]/30">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Main Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#1e3a5f]">{tourist.full_name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {tourist.nationality}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-[#4a90a4]" />
                <span className="truncate">{tourist.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-[#4a90a4]" />
                <span>{tourist.phone}</span>
              </div>
              {tourist.preferred_language && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Languages className="h-4 w-4 text-[#4a90a4]" />
                  <span>{tourist.preferred_language}</span>
                </div>
              )}
              {tourist.country_of_residence && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-[#4a90a4]" />
                  <span>{tourist.country_of_residence}</span>
                </div>
              )}
              {tourist.preferred_city && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-[#c9a227]" />
                  <span>Prefers: {tourist.preferred_city}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-[#4a90a4]" />
                <span>{format(new Date(tourist.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>

            {/* Travel Interests */}
            {tourist.travel_interests && tourist.travel_interests.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Heart className="h-4 w-4 text-[#c9a227]" />
                {tourist.travel_interests.map((interest, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="bg-[#4a90a4]/10 text-[#1e3a5f] text-xs"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            )}

            {/* Special Requests */}
            {tourist.special_requests && (
              <p className="text-sm text-muted-foreground italic bg-[#f5f0e1]/50 p-2 rounded">
                "{tourist.special_requests}"
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Total Bookings: <strong>{tourist.total_bookings}</strong></span>
              {tourist.last_booking_date && (
                <span>Last Booking: {format(new Date(tourist.last_booking_date), "MMM d, yyyy")}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tourist)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(tourist.id)}
              className="flex items-center gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
