import { useState } from "react";
import { useTourists, Tourist, TouristFormData } from "@/hooks/useTourists";
import { TouristCard } from "@/components/tourists/TouristCard";
import { TouristForm } from "@/components/tourists/TouristForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Users, Plus, Search, Globe, Languages, Building2, MessageCircle } from "lucide-react";

const TouristsPage = () => {
  const { tourists, isLoading, addTourist, updateTourist, deleteTourist } = useTourists();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTourists = tourists.filter((tourist) => {
    const query = searchQuery.toLowerCase();
    return (
      tourist.full_name.toLowerCase().includes(query) ||
      tourist.email.toLowerCase().includes(query) ||
      tourist.phone.includes(query) ||
      tourist.nationality.toLowerCase().includes(query)
    );
  });

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
          toast.success("Tourist updated successfully");
          setShowForm(false);
          setEditingTourist(null);
        } else {
          toast.error("Failed to update tourist");
        }
      } else {
        const newTourist = await addTourist(data);
        if (newTourist) {
          toast.success("Tourist registered successfully");
          setShowForm(false);
        } else {
          toast.error("Failed to register tourist");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const success = await deleteTourist(deletingId);
    if (success) {
      toast.success("Tourist deleted successfully");
    } else {
      toast.error("Failed to delete tourist");
    }
    setDeletingId(null);
  };

  // Stats
  const uniqueNationalities = new Set(tourists.map((t) => t.nationality)).size;
  const uniqueCities = new Set(tourists.filter((t) => t.preferred_city).map((t) => t.preferred_city)).size;
  const withLanguagePref = tourists.filter((t) => t.preferred_language).length;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Card Container */}
        <Card className="shadow-lg border-0 bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Tourist Management<br />Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {/* Total Tourists - Cyan */}
              <div className="bg-[#7dd3d8] rounded-xl p-4 text-center">
                <Globe className="h-6 w-6 mx-auto mb-2 text-[#1e5f66]" />
                <span className="text-3xl sm:text-4xl font-bold text-[#1e5f66] block">{tourists.length}</span>
                <span className="text-xs sm:text-sm text-[#1e5f66]/80">Total Tourists</span>
              </div>

              {/* Nationalities - Green */}
              <div className="bg-[#a8d5a2] rounded-xl p-4 text-center">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-[#3d6b38]" />
                <span className="text-3xl sm:text-4xl font-bold text-[#3d6b38] block">{uniqueNationalities}</span>
                <span className="text-xs sm:text-sm text-[#3d6b38]/80">Nationalities</span>
              </div>

              {/* Preferred Cities - Yellow */}
              <div className="bg-[#f5d98a] rounded-xl p-4 text-center">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-[#7a6520]" />
                <span className="text-3xl sm:text-4xl font-bold text-[#7a6520] block">{uniqueCities}</span>
                <span className="text-xs sm:text-sm text-[#7a6520]/80">Preferred Cities</span>
              </div>

              {/* With Language Pref - Orange */}
              <div className="bg-[#f5b97a] rounded-xl p-4 text-center">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-[#8b5a2b]" />
                <span className="text-3xl sm:text-4xl font-bold text-[#8b5a2b] block">{withLanguagePref}</span>
                <span className="text-xs sm:text-sm text-[#8b5a2b]/80">With Language Pref</span>
              </div>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or nationality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border rounded-lg"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingTourist(null);
                  setShowForm(true);
                }}
                className="bg-accent hover:bg-accent-dark text-accent-foreground whitespace-nowrap rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register New Tourist
              </Button>
            </div>

            {/* Tourist List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading tourists...</p>
              </div>
            ) : filteredTourists.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {searchQuery ? "No tourists match your search" : "No tourists registered yet"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Click 'Register New Tourist' to add one"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTourists.map((tourist) => (
                  <TouristCard
                    key={tourist.id}
                    tourist={tourist}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeletingId(id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingTourist ? "Edit Tourist" : "Register New Tourist"}
            </DialogTitle>
          </DialogHeader>
          <TouristForm
            tourist={editingTourist || undefined}
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
            <AlertDialogTitle>Delete Tourist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tourist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TouristsPage;
