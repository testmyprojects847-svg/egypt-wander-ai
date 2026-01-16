import { useState, useEffect } from "react";
import { useTourists, Tourist, TouristFormData } from "@/hooks/useTourists";
import { TouristCard } from "@/components/tourists/TouristCard";
import { TouristForm } from "@/components/tourists/TouristForm";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { LuxuryFooter } from "@/components/home/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Globe,
  PlaneTakeoff,
  CalendarCheck,
  ArrowUpDown
} from "lucide-react";

interface Stats {
  totalBookings: number;
  totalNationalities: number;
  cancelledTrips: number;
  todaysBookings: number;
}

const AdminTouristsPage = () => {
  const { tourists, isLoading, addTourist, updateTourist, deleteTourist } = useTourists();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalBookings: 0, totalNationalities: 0, cancelledTrips: 0, todaysBookings: 0 });
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'nationality'>('date');
  const [filterNationality, setFilterNationality] = useState<string>('all');

  // Force dark mode for consistent luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Fetch stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: touristsData } = await supabase.from('tourists').select('total_bookings, nationality, last_booking_date');
        const totalBookings = touristsData?.reduce((sum, t) => sum + (t.total_bookings || 0), 0) || 0;
        
        const uniqueNationalities = new Set(touristsData?.map(t => t.nationality).filter(Boolean));
        
        const todaysDate = new Date().toISOString().split('T')[0];
        const todaysBookings = touristsData?.filter(t => t.last_booking_date === todaysDate).length || 0;
        
        setStats({
          totalBookings,
          totalNationalities: uniqueNationalities.size,
          cancelledTrips: 0,
          todaysBookings
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, [tourists]);

  // Get unique nationalities for filter
  const nationalities = [...new Set(tourists.map(t => t.nationality).filter(Boolean))];

  // Filter and sort tourists
  const filteredTourists = tourists
    .filter((tourist) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tourist.full_name.toLowerCase().includes(query) ||
        tourist.email.toLowerCase().includes(query) ||
        tourist.phone.includes(query) ||
        tourist.nationality.toLowerCase().includes(query);
      
      const matchesNationality = filterNationality === 'all' || tourist.nationality === filterNationality;
      
      return matchesSearch && matchesNationality;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        case 'nationality':
          return a.nationality.localeCompare(b.nationality);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
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

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 px-8 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl text-primary tracking-wide">Tourists Management</h1>
            <p className="text-primary/60 mt-2 font-playfair">View and manage registered tourists</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
              <p className="text-xs text-primary/60 uppercase tracking-wide">Total Bookings</p>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.totalNationalities}</p>
              <p className="text-xs text-primary/60 uppercase tracking-wide">Nationalities</p>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <PlaneTakeoff className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{tourists.length}</p>
              <p className="text-xs text-primary/60 uppercase tracking-wide">Total Tourists</p>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.todaysBookings}</p>
              <p className="text-xs text-primary/60 uppercase tracking-wide">Today's Bookings</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40 focus:border-primary"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'nationality') => setSortBy(value)}>
              <SelectTrigger className="w-[180px] bg-primary/5 border-primary/20 text-primary">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/20">
                <SelectItem value="date" className="text-primary">Date (Newest)</SelectItem>
                <SelectItem value="name" className="text-primary">Name (A-Z)</SelectItem>
                <SelectItem value="nationality" className="text-primary">Nationality</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by Nationality */}
            <Select value={filterNationality} onValueChange={setFilterNationality}>
              <SelectTrigger className="w-[180px] bg-primary/5 border-primary/20 text-primary">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/20">
                <SelectItem value="all" className="text-primary">All Nationalities</SelectItem>
                {nationalities.map(nat => (
                  <SelectItem key={nat} value={nat} className="text-primary">{nat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Tourist Button */}
            <Button
              onClick={() => {
                setEditingTourist(null);
                setShowForm(true);
              }}
              className="gap-2 bg-primary text-black hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Tourist
            </Button>
          </div>

          {/* Tourist Cards Grid */}
          {isLoading ? (
            <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-primary/60">Loading tourists...</p>
            </div>
          ) : filteredTourists.length === 0 ? (
            <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
              <Users className="h-12 w-12 text-primary/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">
                {searchQuery || filterNationality !== 'all' ? "No tourists match your search" : "No tourists registered yet"}
              </h3>
              <p className="text-primary/60 mb-4">
                {searchQuery || filterNationality !== 'all' ? "Try a different search term or filter" : "Click 'Add Tourist' to register one"}
              </p>
              {!searchQuery && filterNationality === 'all' && (
                <Button
                  onClick={() => {
                    setEditingTourist(null);
                    setShowForm(true);
                  }}
                  className="gap-2 bg-primary text-black hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Add Tourist
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      </main>

      {/* Footer */}
      <LuxuryFooter />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary font-playfair text-xl">
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
        <AlertDialogContent className="bg-black border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Delete Tourist</AlertDialogTitle>
            <AlertDialogDescription className="text-primary/60">
              Are you sure you want to delete this tourist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary/30 text-primary hover:bg-primary/10">Cancel</AlertDialogCancel>
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

export default AdminTouristsPage;
