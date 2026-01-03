import { useState, useEffect } from "react";
import { UserPlus, Users, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTourists, Tourist, TouristFormData } from "@/hooks/useTourists";
import { useTours } from "@/hooks/useTours";
import { TouristForm } from "@/components/tourists/TouristForm";
import { TouristCard } from "@/components/tourists/TouristCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
}

const TouristRegistrationPage = () => {
  const { tourists, isLoading, addTourist, updateTourist, deleteTourist } = useTourists();
  const { tours } = useTours();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, customer_name, customer_email")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookings(data);
      }
    };
    fetchBookings();
  }, []);

  const filteredTourists = tourists.filter(
    (tourist) =>
      tourist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tourist.nationality?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (tourist: Tourist) => {
    setEditingTourist(tourist);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: TouristFormData) => {
    setIsSubmitting(true);
    try {
      if (editingTourist) {
        const success = await updateTourist(editingTourist.id, data);
        if (success) {
          toast({ title: "Tourist updated successfully" });
        } else {
          toast({ title: "Failed to update tourist", variant: "destructive" });
        }
      } else {
        const newTourist = await addTourist(data);
        if (newTourist) {
          toast({ title: "Tourist added successfully" });
        } else {
          toast({ title: "Failed to add tourist", variant: "destructive" });
        }
      }
      setShowForm(false);
      setEditingTourist(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const success = await deleteTourist(deletingId);
    if (success) {
      toast({ title: "Tourist deleted successfully" });
    } else {
      toast({ title: "Failed to delete tourist", variant: "destructive" });
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-amber-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Tourist Registration
            </h1>
            <p className="text-muted-foreground mt-1">
              Admin panel for managing tourist records
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTourist(null);
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Tourist
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tourists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {tourists.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Linked to Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {tourists.filter((t) => t.tour_id).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {tourists.filter((t) => t.booking_id).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTourists.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No tourists match your search" : "No tourists registered yet"}
              </p>
              {!searchQuery && (
                <Button
                  variant="link"
                  onClick={() => setShowForm(true)}
                  className="mt-2"
                >
                  Add your first tourist
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTourists.map((tourist) => (
              <TouristCard
                key={tourist.id}
                tourist={tourist}
                tours={tours}
                bookings={bookings}
                onEdit={handleEdit}
                onDelete={setDeletingId}
              />
            ))}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTourist ? "Edit Tourist" : "Add New Tourist"}
              </DialogTitle>
            </DialogHeader>
            <TouristForm
              tourist={editingTourist}
              tours={tours}
              bookings={bookings}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTourist(null);
              }}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tourist?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The tourist record will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default TouristRegistrationPage;
