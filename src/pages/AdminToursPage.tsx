 import { useState, useEffect, useMemo } from 'react';
 import { useTours } from '@/hooks/useTours';
 import { Tour, TOURISM_TYPES, getCityLabel } from '@/types/tour';
 import { AdminNavbar } from '@/components/admin/AdminNavbar';
 import { LuxuryFooter } from '@/components/home/LuxuryFooter';
 import { TourCard } from '@/components/admin/TourCard';
 import { TourForm } from '@/components/admin/TourForm';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Slider } from '@/components/ui/slider';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from '@/components/ui/popover';
 import { Calendar } from '@/components/ui/calendar';
 import { useToast } from '@/hooks/use-toast';
 import { format } from 'date-fns';
 import { 
   Plus, 
   Search, 
   LayoutGrid, 
   List, 
   MapPin, 
   Filter,
   Compass,
   CalendarIcon,
   Percent,
   X
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
   
   // Admin-only filters
   const [tourismTypeFilter, setTourismTypeFilter] = useState<string>('all');
   const [cityFilter, setCityFilter] = useState<string>('all');
   const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
   const [discountFilter, setDiscountFilter] = useState<string>('all');
   const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
   const [showFilters, setShowFilters] = useState(false);
 
   useEffect(() => {
     document.documentElement.classList.add('dark');
   }, []);
 
   const availableTours = getAvailableTours();
   const unavailableTours = tours.filter(t => t.availability !== 'available');
   const displayedTours = activeTab === 'published' ? availableTours : unavailableTours;
   
   const maxPrice = useMemo(() => {
     if (tours.length === 0) return 50000;
     return Math.max(...tours.map(t => t.price_egp || t.price || 0), 50000);
   }, [tours]);
   
   const availableCities = useMemo(() => {
     if (tourismTypeFilter === 'all') {
       return [...new Set(tours.map(t => t.city))].sort();
     }
     return [...new Set(
       tours.filter(t => t.tourism_type === tourismTypeFilter).map(t => t.city)
     )].sort();
   }, [tours, tourismTypeFilter]);
 
   const filteredTours = useMemo(() => {
     return displayedTours.filter((tour) => {
       const matchesSearch = 
         tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         tour.city.toLowerCase().includes(searchQuery.toLowerCase());
       const matchesTourismType = tourismTypeFilter === 'all' || tour.tourism_type === tourismTypeFilter;
       const matchesCity = cityFilter === 'all' || tour.city === cityFilter;
       const tourPrice = tour.price_egp || tour.price || 0;
       const matchesPrice = tourPrice >= priceRange[0] && tourPrice <= priceRange[1];
       let matchesDiscount = true;
       if (discountFilter === 'has_discount') {
         matchesDiscount = (tour.discount_percentage || 0) > 0;
       } else if (discountFilter === 'no_discount') {
         matchesDiscount = (tour.discount_percentage || 0) === 0;
       }
       let matchesDate = true;
       if (dateFilter) {
         const tourDate = new Date(tour.last_updated || '');
         matchesDate = tourDate >= dateFilter;
       }
       return matchesSearch && matchesTourismType && matchesCity && matchesPrice && matchesDiscount && matchesDate;
     });
   }, [displayedTours, searchQuery, tourismTypeFilter, cityFilter, priceRange, discountFilter, dateFilter]);
   
   const clearFilters = () => {
     setSearchQuery('');
     setTourismTypeFilter('all');
     setCityFilter('all');
     setPriceRange([0, maxPrice]);
     setDiscountFilter('all');
     setDateFilter(undefined);
   };
   
   const hasActiveFilters = searchQuery || tourismTypeFilter !== 'all' || cityFilter !== 'all' || 
     priceRange[0] > 0 || priceRange[1] < maxPrice || discountFilter !== 'all' || dateFilter;
 
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
       <AdminNavbar />
 
       <main className="flex-1 px-4 md:px-8 py-6">
         <div className="max-w-7xl mx-auto">
           {/* Header */}
           <div className="flex items-center justify-between mb-6">
             <div>
               <h1 className="font-playfair text-2xl md:text-3xl text-primary tracking-wide">Tours Management</h1>
               <p className="text-primary/60 mt-1 font-playfair text-sm">{filteredTours.length} of {tours.length} tours</p>
             </div>
             <Button onClick={() => setFormOpen(true)} size="sm" className="gap-2 bg-primary text-black hover:bg-primary/90">
               <Plus className="w-4 h-4" />
               Add Tour
             </Button>
           </div>
 
           {/* Search & Filter Row */}
           <div className="flex flex-col md:flex-row gap-2 mb-4">
             <div className="relative flex-1 md:max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
               <Input
                 placeholder="Search tours..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 h-9 bg-black border-primary/30 text-primary placeholder:text-primary/40 focus:border-primary text-sm"
               />
             </div>
             
             <Select value={tourismTypeFilter} onValueChange={setTourismTypeFilter}>
               <SelectTrigger className="w-full md:w-44 h-9 bg-black border-primary/30 text-primary text-sm">
                 <Compass className="w-3.5 h-3.5 text-primary/50 mr-1.5" />
                 <SelectValue placeholder="All Types" />
               </SelectTrigger>
               <SelectContent className="bg-black border-primary/40">
                 <SelectItem value="all" className="text-primary hover:bg-primary/10 text-sm">All Types</SelectItem>
                 {TOURISM_TYPES.map(type => (
                   <SelectItem key={type.value} value={type.value} className="text-primary hover:bg-primary/10 text-sm">
                     {type.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             
             <Select value={cityFilter} onValueChange={setCityFilter}>
               <SelectTrigger className="w-full md:w-40 h-9 bg-black border-primary/30 text-primary text-sm">
                 <MapPin className="w-3.5 h-3.5 text-primary/50 mr-1.5" />
                 <SelectValue placeholder="All Cities" />
               </SelectTrigger>
               <SelectContent className="bg-black border-primary/40">
                 <SelectItem value="all" className="text-primary hover:bg-primary/10 text-sm">All Cities</SelectItem>
                 {availableCities.map(city => (
                   <SelectItem key={city} value={city} className="text-primary hover:bg-primary/10 text-sm">
                     {getCityLabel(city, 'en')}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setShowFilters(!showFilters)}
               className={`gap-2 border-primary/30 text-primary hover:bg-primary/10 h-9 ${showFilters ? 'bg-primary/10' : ''}`}
             >
               <Filter className="w-4 h-4" />
               Filters
               {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
             </Button>
             
             {hasActiveFilters && (
               <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary/60 hover:text-primary h-9">
                 <X className="w-4 h-4 mr-1" />
                 Clear
               </Button>
             )}
           </div>
           
           {/* Advanced Filters Panel */}
           {showFilters && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4 border border-primary/20 rounded-lg bg-primary/5">
               <div className="space-y-2">
                 <Label className="text-primary/80 text-xs">Price Range (EGP)</Label>
                 <div className="px-2">
                   <Slider
                     value={priceRange}
                     onValueChange={(v) => setPriceRange(v as [number, number])}
                     min={0}
                     max={maxPrice}
                     step={500}
                     className="w-full"
                   />
                   <div className="flex justify-between text-xs text-primary/50 mt-1">
                     <span>{priceRange[0].toLocaleString()}</span>
                     <span>{priceRange[1].toLocaleString()}</span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <Label className="text-primary/80 text-xs flex items-center gap-1">
                   <Percent className="w-3 h-3" />
                   Discount
                 </Label>
                 <Select value={discountFilter} onValueChange={setDiscountFilter}>
                   <SelectTrigger className="h-9 bg-black border-primary/30 text-primary text-sm">
                     <SelectValue placeholder="All" />
                   </SelectTrigger>
                   <SelectContent className="bg-black border-primary/40">
                     <SelectItem value="all" className="text-primary hover:bg-primary/10 text-sm">All</SelectItem>
                     <SelectItem value="has_discount" className="text-primary hover:bg-primary/10 text-sm">Has Discount</SelectItem>
                     <SelectItem value="no_discount" className="text-primary hover:bg-primary/10 text-sm">No Discount</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               <div className="space-y-2">
                 <Label className="text-primary/80 text-xs flex items-center gap-1">
                   <CalendarIcon className="w-3 h-3" />
                   Created After
                 </Label>
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button variant="outline" className="w-full h-9 justify-start text-left font-normal bg-black border-primary/30 text-primary text-sm">
                       {dateFilter ? format(dateFilter, 'PPP') : <span className="text-primary/40">Pick a date</span>}
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0 bg-black border-primary/40" align="start">
                     <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus className="pointer-events-auto" />
                   </PopoverContent>
                 </Popover>
               </div>
             </div>
           )}
 
           {/* Tabs & View Controls */}
           <div className="flex items-center justify-between gap-4 mb-4">
             <div className="flex items-center gap-1 border-b border-primary/20">
               <button
                 onClick={() => setActiveTab('published')}
                 className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                   activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-primary/60 hover:text-primary'
                 }`}
               >
                 <span className="w-2 h-2 rounded-full bg-green-500" />
                 Published ({availableTours.length})
               </button>
               <button
                 onClick={() => setActiveTab('draft')}
                 className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                   activeTab === 'draft' ? 'border-primary text-primary' : 'border-transparent text-primary/60 hover:text-primary'
                 }`}
               >
                 <span className="w-2 h-2 rounded-full bg-gray-500" />
                 Draft ({unavailableTours.length})
               </button>
             </div>
 
             <div className="flex items-center bg-primary/10 rounded-lg p-1">
               <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-primary/60 hover:text-primary'}`}>
                 <LayoutGrid className="w-4 h-4" />
               </button>
               <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-primary/60 hover:text-primary'}`}>
                 <List className="w-4 h-4" />
               </button>
             </div>
           </div>
 
           {/* Tours Grid */}
           {isLoading ? (
             <div className="text-center py-16 bg-primary/5 rounded-lg border border-primary/20">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-primary/60">Loading tours...</p>
             </div>
           ) : filteredTours.length > 0 ? (
             <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' : 'space-y-3'}>
               {filteredTours.map((tour) => (
                 <TourCard key={tour.id} tour={tour} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} onToggle={handleToggle} />
               ))}
             </div>
           ) : (
             <div className="text-center py-16 bg-primary/5 rounded-lg border border-primary/20">
               <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-primary mb-2">No tours found</h3>
               <p className="text-primary/60 mb-4">{hasActiveFilters ? 'Try adjusting your filters' : 'Add your first tour to get started'}</p>
               {hasActiveFilters ? (
                 <Button onClick={clearFilters} variant="outline" className="gap-2 border-primary/30 text-primary">
                   <X className="w-4 h-4" />
                   Clear Filters
                 </Button>
               ) : (
                 <Button onClick={() => setFormOpen(true)} className="gap-2 bg-primary text-black hover:bg-primary/90">
                   <Plus className="w-4 h-4" />
                   Add Tour
                 </Button>
               )}
             </div>
           )}
         </div>
       </main>
 
       <LuxuryFooter />
 
       <TourForm open={formOpen} onClose={() => { setFormOpen(false); setEditTour(null); }} onSubmit={handleFormSubmit} editTour={editTour} />
 
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
             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 };
 
 export default AdminToursPage;