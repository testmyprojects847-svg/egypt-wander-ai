import { useState, useEffect } from 'react';
import { useTours } from '@/hooks/useTours';
import { Tour } from '@/types/tour';
import { Sidebar } from '@/components/admin/Sidebar';
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
  Filter,
  Bell,
  Menu,
  Moon,
  Sun,
  User
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

const AdminPage = () => {
  const { tours, isLoading, addTour, updateTour, deleteTour, toggleAvailability, getAvailableTours } = useTours();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
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

  // Force dark mode for consistent luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Luxury Gold/Black Theme */}
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-primary/20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu */}
            <button className="lg:hidden p-2 hover:bg-primary/10 rounded-lg text-primary">
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center relative max-w-md flex-1 mx-4">
              <Search className="absolute left-3 w-4 h-4 text-primary/60" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40 focus:border-primary"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-primary/10 rounded-lg flex items-center gap-2 text-sm text-primary"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-primary/10 rounded-lg relative text-primary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-black">
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

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/5 border-primary/20 text-primary"
              />
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
        </main>
      </div>

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tour</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tour? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
