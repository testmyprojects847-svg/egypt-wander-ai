import { useState } from "react";
import { useTourists, Tourist, TouristFormData } from "@/hooks/useTourists";
import { TouristCard } from "@/components/tourists/TouristCard";
import { TouristForm } from "@/components/tourists/TouristForm";
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
import { toast } from "sonner";
import { Users, Plus, Search, Globe, Languages, MapPin } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0e1] to-white">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="h-8 w-8" />
                Tourist Management
              </h1>
              <p className="text-[#4a90a4] mt-1">Admin dashboard for tourist registration</p>
            </div>
            <Button
              onClick={() => {
                setEditingTourist(null);
                setShowForm(true);
              }}
              className="bg-[#c9a227] hover:bg-[#b8922f] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register New Tourist
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-t-4 border-t-[#1e3a5f]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Tourists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1e3a5f]" />
                <span className="text-2xl font-bold text-[#1e3a5f]">{tourists.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#c9a227]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Nationalities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#c9a227]" />
                <span className="text-2xl font-bold text-[#c9a227]">{uniqueNationalities}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#4a90a4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Preferred Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#4a90a4]" />
                <span className="text-2xl font-bold text-[#4a90a4]">{uniqueCities}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">With Language Pref</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{withLanguagePref}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or nationality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tourist List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tourists...</p>
          </div>
        ) : filteredTourists.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                {searchQuery ? "No tourists match your search" : "No tourists registered yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Click 'Register New Tourist' to add one"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
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
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">
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
