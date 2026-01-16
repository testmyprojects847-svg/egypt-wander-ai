import { useState, useEffect } from 'react';
import { useTours } from '@/hooks/useTours';
import { Tour } from '@/types/tour';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { TourCard } from '@/components/admin/TourCard';
import { TourForm } from '@/components/admin/TourForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MapPin, 
  Filter
} from 'lucide-react';
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

const AdminToursPage = () => {
  const { tours, isLoading, addTour, updateTour, deleteTour, toggleAvailability, getAvailableTours } = useTours();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');

  // Force dark mode for consistent luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const availableTours = getAvailableTours();
  const unavailableTours = tours.filter(t => t.availability !== 'available');

  const displayedTours = activeTab === 'published' ? availableTours : unavailableTours;

  const filteredTours = displayedTours.filter((tour) =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (tour: Tour) => {
    setEditTour(tour);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editTour) {
      await updateTour(editTour.id, data);
      toast({ title: 'Tour updated successfully!' });
    } else {
      await addTour(data);
      toast({ title: 'Tour added successfully!' });
    }
    setEditTour(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteTour(deleteId);
      toast({ title: 'Tour deleted', variant: 'destructive' });
      setDeleteId(null);
    }
  };

  const handleToggle = async (id: string) => {
    await toggleAvailability(id);
    const tour = tours.find((t) => t.id === id);
    if (tour) {
      toast({
        title: tour.availability === 'available' 
          ? 'Tour is now unavailable' 
          : 'Tour is now available',
      });
    }
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
            <h1 className="font-playfair text-3xl md:text-4xl text-primary tracking-wide">Tours Management</h1>
            <p className="text-primary/60 mt-2 font-playfair">Create, edit, and manage tour packages</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40 focus:border-primary"
              />
            </div>
          </div>

          {/* Tabs & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-primary/20">
              <button
                onClick={() => setActiveTab('published')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'published'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-primary/60 hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Published ({availableTours.length})
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'draft'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-primary/60 hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                Draft ({unavailableTours.length})
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-primary/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-primary/60 hover:text-primary'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-primary/60 hover:text-primary'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button onClick={() => setFormOpen(true)} size="sm" className="gap-2 bg-primary text-black hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Add Tour
              </Button>
            </div>
          </div>

          {/* Tours Grid */}
          {isLoading ? (
            <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-primary/60">Loading tours...</p>
            </div>
          ) : filteredTours.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
              <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">No tours found</h3>
              <p className="text-primary/60 mb-4">
                {searchQuery ? 'Try a different search term' : 'Add your first tour to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setFormOpen(true)} className="gap-2 bg-primary text-black hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Add Tour
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <LuxuryFooter />

      {/* Tour Form Dialog */}
      <TourForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTour(null);
        }}
        onSubmit={handleFormSubmit}
        editTour={editTour}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-black border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Delete Tour</AlertDialogTitle>
            <AlertDialogDescription className="text-primary/60">
              Are you sure you want to delete this tour? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary/30 text-primary hover:bg-primary/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminToursPage;
