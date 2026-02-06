import { useState } from "react";
import { Tourist } from "@/hooks/useTourists";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Mail, Phone, Calendar, Globe, User, Edit, Trash2, MapPin, 
  DollarSign, Users, Clock, Navigation
} from "lucide-react";

interface TouristCardProps {
  tourist: Tourist;
  onEdit: (tourist: Tourist) => void;
  onDelete: (id: string) => void;
}

export const TouristCard = ({ tourist, onEdit, onDelete }: TouristCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(tourist.created_at), { addSuffix: true });
  
  return (
    <>
      {/* Clickable Card */}
      <div 
        onClick={() => setShowDetails(true)}
        className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 cursor-pointer relative group"
      >
        {/* Time Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-black text-[10px] px-2 py-0.5 rounded-full font-medium">
            {timeAgo}
          </span>
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center mt-5 mb-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center group-hover:scale-105 transition-transform">
            <User className="w-7 h-7 text-primary" />
          </div>
          
          <h3 className="mt-2 text-sm font-bold text-primary text-center font-playfair line-clamp-1">
            {tourist.full_name}
          </h3>
          
          <span className="mt-1 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-semibold">
            T-{tourist.id.slice(0, 4).toUpperCase()}
          </span>

          {tourist.tour_name && (
            <Badge className="mt-1.5 bg-primary/30 text-primary border-primary/40 text-[10px] px-2">
              <MapPin className="w-2.5 h-2.5 mr-0.5" />
              {tourist.tour_name.length > 15 ? tourist.tour_name.slice(0, 15) + '...' : tourist.tour_name}
            </Badge>
          )}
        </div>

        {/* Quick Info */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-primary/70">
            <Mail className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{tourist.email}</span>
          </div>

          <div className="flex items-center gap-1.5 text-primary/70">
            <Globe className="w-3 h-3 text-primary flex-shrink-0" />
            <span>{tourist.nationality}</span>
          </div>

          <div className="flex items-center justify-between text-primary/70 pt-2 border-t border-primary/10 mt-2">
            <span className="text-[10px]">Bookings:</span>
            <span className="font-bold text-primary text-sm">{tourist.total_bookings}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 mt-3 pt-3 border-t border-primary/20">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(tourist); }}
            className="flex-1 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary hover:text-black transition-colors h-7 px-2"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(tourist.id); }}
            className="flex-1 text-[10px] gap-1 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors h-7 px-2"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </div>

      {/* Full Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg bg-black border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-primary font-playfair text-xl flex items-center gap-2">
              <User className="w-5 h-5" />
              Tourist Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-primary/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary font-playfair">{tourist.full_name}</h3>
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                  T-{tourist.id.slice(0, 4).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">Email</span>
                </div>
                <p className="text-primary/80 text-sm truncate">{tourist.email}</p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-medium">Phone</span>
                </div>
                <p className="text-primary/80 text-sm">{tourist.phone}</p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium">Nationality</span>
                </div>
                <p className="text-primary/80 text-sm">{tourist.nationality}</p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Registered</span>
                </div>
                <p className="text-primary/80 text-sm">{format(new Date(tourist.created_at), "dd MMM yyyy")}</p>
              </div>
            </div>

            {/* Booking Info */}
            {tourist.tour_name && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Booking Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-primary/60 text-xs">Tour</span>
                    <p className="text-primary font-medium">{tourist.tour_name}</p>
                  </div>
                  {tourist.booking_date && (
                    <div>
                      <span className="text-primary/60 text-xs">Date</span>
                      <p className="text-primary font-medium">{format(new Date(tourist.booking_date), "dd MMM yyyy")}</p>
                    </div>
                  )}
                  {tourist.number_of_people && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary/60" />
                      <span className="text-primary">{tourist.number_of_people} people</span>
                    </div>
                  )}
                  {tourist.total_price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary/60" />
                      <span className="text-primary font-bold">${tourist.total_price}</span>
                    </div>
                  )}
                  {tourist.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary/60" />
                      <span className="text-primary">{tourist.duration}</span>
                    </div>
                  )}
                  {tourist.starting_point && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-primary/60" />
                      <span className="text-primary">{tourist.starting_point}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            {(tourist.preferred_language || tourist.preferred_city || tourist.country_of_residence) && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <h4 className="text-primary font-semibold text-sm mb-2">Preferences</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {tourist.preferred_language && (
                    <div>
                      <span className="text-primary/60">Language</span>
                      <p className="text-primary">{tourist.preferred_language}</p>
                    </div>
                  )}
                  {tourist.preferred_city && (
                    <div>
                      <span className="text-primary/60">City</span>
                      <p className="text-primary">{tourist.preferred_city}</p>
                    </div>
                  )}
                  {tourist.country_of_residence && (
                    <div>
                      <span className="text-primary/60">Residence</span>
                      <p className="text-primary">{tourist.country_of_residence}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Travel Interests */}
            {tourist.travel_interests && tourist.travel_interests.length > 0 && (
              <div>
                <span className="text-primary/60 text-xs">Travel Interests</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tourist.travel_interests.map((interest, i) => (
                    <Badge key={i} className="bg-primary/20 text-primary border-primary/30 text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requests */}
            {tourist.special_requests && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <span className="text-primary/60 text-xs">Special Requests</span>
                <p className="text-primary/90 text-sm mt-1">{tourist.special_requests}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-primary/20">
              <span className="text-primary/60 text-sm">Total Bookings</span>
              <span className="text-2xl font-bold text-primary">{tourist.total_bookings}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
