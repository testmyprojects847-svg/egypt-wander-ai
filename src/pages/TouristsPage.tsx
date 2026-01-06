import { useState, useEffect, useMemo } from "react";
import { useTourists, Tourist, TouristFormData } from "@/hooks/useTourists";
import { TouristCard } from "@/components/tourists/TouristCard";
import { TouristForm } from "@/components/tourists/TouristForm";
import { Sidebar } from "@/components/admin/Sidebar";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Plus, 
  Search, 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  User,
  Filter,
  RotateCcw,
  CheckCircle,
  Globe,
  PlaneTakeoff,
  CalendarCheck
} from "lucide-react";

interface Stats {
  totalBookings: number;
  totalNationalities: number;
  cancelledTrips: number;
  todaysBookings: number;
}

const TouristsPage = () => {
  const { tourists, isLoading, addTourist, updateTourist, deleteTourist } = useTourists();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalBookings: 0, totalNationalities: 0, cancelledTrips: 0, todaysBookings: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total bookings from tourists table
        const { data: touristsData } = await supabase.from('tourists').select('total_bookings, nationality');
        const totalBookings = touristsData?.reduce((sum, t) => sum + (t.total_bookings || 0), 0) || 0;
        
        // Get unique nationalities
        const uniqueNationalities = new Set(touristsData?.map(t => t.nationality).filter(Boolean));
        
        // Get bookings stats
        const today = new Date().toISOString().split('T')[0];
        const { data: bookingsData } = await supabase.from('bookings').select('status, created_at');
        
        const cancelledTrips = bookingsData?.filter(b => b.status === 'cancelled').length || 0;
        const todaysBookings = bookingsData?.filter(b => b.created_at.startsWith(today)).length || 0;
        
        setStats({
          totalBookings,
          totalNationalities: uniqueNationalities.size,
          cancelledTrips,
          todaysBookings
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, [tourists]);

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">TOURISTS HISTORY</h1>
                <p className="text-sm text-muted-foreground">HOME / TOURISTS HISTORY</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-secondary rounded-lg flex items-center gap-2 text-sm"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 bg-muted/30">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {/* Total Bookings */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-sky-400 flex items-center justify-center shadow-lg ring-4 ring-sky-200 dark:ring-sky-400/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.totalBookings}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
            
            {/* Total Nationalities */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center shadow-lg ring-4 ring-orange-200 dark:ring-orange-400/30">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.totalNationalities}</p>
                <p className="text-xs text-muted-foreground">Total Nationalities</p>
              </div>
            </div>
            
            {/* Cancelled Trips */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-red-400 flex items-center justify-center shadow-lg ring-4 ring-red-200 dark:ring-red-400/30">
                <PlaneTakeoff className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.cancelledTrips}</p>
                <p className="text-xs text-muted-foreground">Cancelled Trips</p>
              </div>
            </div>
            
            {/* Today's Bookings */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-4 ring-green-200 dark:ring-green-500/30">
                <CalendarCheck className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.todaysBookings}</p>
                <p className="text-xs text-muted-foreground">Today's Bookings</p>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="bg-card rounded-xl p-4 mb-6 border border-border">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border rounded-lg"
                />
              </div>

              {/* Filter & Reset Buttons */}
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-accent hover:bg-accent-dark text-accent-foreground gap-1">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary gap-1">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Add Tourist Button */}
              <Button
                onClick={() => {
                  setEditingTourist(null);
                  setShowForm(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tourist
              </Button>
            </div>
          </div>

          {/* Tourist Cards Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading tourists...</p>
            </div>
          ) : filteredTourists.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-muted-foreground">
                {searchQuery ? "No tourists match your search" : "No tourists registered yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Click 'Add Tourist' to register one"}
              </p>
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
        </main>
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
