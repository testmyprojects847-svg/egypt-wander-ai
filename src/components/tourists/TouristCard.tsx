import { User, Mail, Phone, Globe, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tourist } from "@/hooks/useTourists";
import { Tour } from "@/types/tour";

interface TouristCardProps {
  tourist: Tourist;
  tours: Tour[];
  bookings: Array<{ id: string; customer_name: string }>;
  onEdit: (tourist: Tourist) => void;
  onDelete: (id: string) => void;
}

export const TouristCard = ({
  tourist,
  tours,
  bookings,
  onEdit,
  onDelete,
}: TouristCardProps) => {
  const linkedTour = tours.find((t) => t.id === tourist.tour_id);
  const linkedBooking = bookings.find((b) => b.id === tourist.booking_id);

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">
                {tourist.full_name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{tourist.email}</span>
              </div>
              
              {tourist.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{tourist.phone}</span>
                </div>
              )}
              
              {tourist.nationality && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{tourist.nationality}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(tourist.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {linkedTour && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {linkedTour.name}
                </Badge>
              )}
              {linkedBooking && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Booking: {linkedBooking.customer_name}
                </Badge>
              )}
            </div>

            {tourist.notes && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mt-3">
                {tourist.notes}
              </p>
            )}
          </div>

          <div className="flex gap-2 ml-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(tourist)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(tourist.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
