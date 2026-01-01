import { useState } from 'react';
import { useTours } from '@/hooks/useTours';
import { Tour } from '@/types/tour';
import { TourCard } from '@/components/admin/TourCard';
import { TourForm } from '@/components/admin/TourForm';
import { ApiPanel } from '@/components/admin/ApiPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MapPin, 
  Sparkles,
  Globe
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

  const baseUrl = window.location.origin;
  const availableTours = getAvailableTours();

  const filteredTours = tours.filter((tour) =>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">Egypt Tours Admin</h1>
                <p className="text-xs text-muted-foreground">Manage your tourism offers</p>
              </div>
            </div>
            <Button onClick={() => setFormOpen(true)} className="gap-2 shadow-gold">
              <Plus className="w-4 h-4" />
              Add Tour
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-xl shadow-soft border border-border">
                <p className="text-sm text-muted-foreground">Total Tours</p>
                <p className="text-2xl font-bold text-foreground">{tours.length}</p>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-soft border border-border">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">{availableTours.length}</p>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-soft border border-border">
                <p className="text-sm text-muted-foreground">Unavailable</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {tours.length - availableTours.length}
                </p>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-soft border border-border">
                <p className="text-sm text-muted-foreground">Cities</p>
                <p className="text-2xl font-bold text-accent">
                  {new Set(tours.map(t => t.city)).size}
                </p>
              </div>
            </div>

            {/* Search & View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search tours by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tours Grid */}
            {isLoading ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-soft border border-border">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading tours...</p>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
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
              <div className="text-center py-16 bg-card rounded-2xl shadow-soft border border-border">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tours found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try a different search term' : 'Add your first tour to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setFormOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Tour
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - API Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ApiPanel baseUrl={baseUrl} availableCount={availableTours.length} />
              
              {/* Quick Tips */}
              <div className="bg-card p-5 rounded-xl shadow-soft border border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Only available tours appear in the API</li>
                  <li>• Changes are reflected immediately</li>
                  <li>• Use high-quality images for tours</li>
                  <li>• Keep descriptions concise for AI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

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
