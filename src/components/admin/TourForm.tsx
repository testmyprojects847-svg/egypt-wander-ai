import { useState, useEffect } from 'react';
import { Tour, TourFormData, EGYPTIAN_CITIES, EXPERIENCE_LEVELS, BEST_FOR_OPTIONS, TOURISM_TYPES } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Star, MapPin, Clock, CheckCircle2, XCircle, Users, Shield, Sparkles, Compass } from 'lucide-react';

interface TourFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TourFormData) => void;
  editTour?: Tour | null;
}

const initialFormData: TourFormData = {
  name: '',
  tourism_type: '',
  description: '',
  city: '',
  price: 0,
  currency: 'EGP',
  duration: '',
  availability: 'available',
  image_url: '',
  features: [],
  starting_point: '',
  highlights: [],
  included: [],
  excluded: [],
  experience_level: '',
  best_for: [],
  cancellation_policy: '',
};

// Reusable component for array inputs
function ArrayInput({ 
  label, 
  icon: Icon, 
  items, 
  onAdd, 
  onRemove, 
  placeholder,
  helperText,
  badgeVariant = 'secondary'
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder: string;
  helperText?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} size="icon" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg">
          {items.map((item, index) => (
            <Badge key={index} variant={badgeVariant} className="gap-1.5 py-1.5 px-3">
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export function TourForm({ open, onClose, onSubmit, editTour }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>(initialFormData);

  useEffect(() => {
    if (editTour) {
      setFormData({
        name: editTour.name,
        tourism_type: editTour.tourism_type || '',
        description: editTour.description,
        city: editTour.city,
        price: editTour.price,
        price_egp: editTour.price_egp || null,
        price_usd: editTour.price_usd || null,
        discount_percentage: editTour.discount_percentage || null,
        currency: editTour.currency,
        duration: editTour.duration,
        availability: editTour.availability,
        image_url: editTour.image_url,
        features: editTour.features || [],
        starting_point: editTour.starting_point || '',
        highlights: editTour.highlights || [],
        included: editTour.included || [],
        excluded: editTour.excluded || [],
        experience_level: editTour.experience_level || '',
        best_for: editTour.best_for || [],
        cancellation_policy: editTour.cancellation_policy || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editTour, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const toggleBestFor = (value: string) => {
    const current = formData.best_for || [];
    if (current.includes(value)) {
      setFormData({ ...formData, best_for: current.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, best_for: [...current, value] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {editTour ? 'Edit Tour' : 'Add New Tour'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
              Basic Information
            </h3>
            
            {/* Name */}
            <div>
              <Label htmlFor="name">Tour Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Pyramids of Giza Tour"
                required
                className="mt-1.5"
              />
            </div>

            {/* Tourism Type - Required */}
            <div>
              <Label className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Tourism Type *
              </Label>
              <Select
                value={formData.tourism_type || ''}
                onValueChange={(value) => setFormData({ ...formData, tourism_type: value })}
                required
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select tourism type" />
                </SelectTrigger>
                <SelectContent>
                  {TOURISM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the tour experience..."
                required
                rows={3}
                className="mt-1.5"
              />
            </div>

            {/* City, Duration, Starting Point */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value })}
                  required
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {EGYPTIAN_CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>{city.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 6 hours"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="starting_point" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Starting Point
                </Label>
                <Input
                  id="starting_point"
                  value={formData.starting_point || ''}
                  onChange={(e) => setFormData({ ...formData, starting_point: e.target.value })}
                  placeholder="Pickup location"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Base Price (EGP) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="price_egp">Price EGP/Person</Label>
                <Input
                  id="price_egp"
                  type="number"
                  min={0}
                  value={formData.price_egp || ''}
                  onChange={(e) => setFormData({ ...formData, price_egp: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 2500"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="price_usd">Price USD/Person</Label>
                <Input
                  id="price_usd"
                  type="number"
                  min={0}
                  value={formData.price_usd || ''}
                  onChange={(e) => setFormData({ ...formData, price_usd: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 50"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage" className="flex items-center gap-1 text-red-400">
                  Discount %
                </Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discount_percentage || ''}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 20"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                required
                className="mt-1.5"
              />
            </div>
          </div>

          <Separator />

          {/* Tour Details Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
              Tour Details
            </h3>

            {/* Features */}
            <ArrayInput
              label="Tour Features"
              icon={Star}
              items={formData.features}
              onAdd={(item) => setFormData({ ...formData, features: [...formData.features, item] })}
              onRemove={(item) => setFormData({ ...formData, features: formData.features.filter(f => f !== item) })}
              placeholder="Add a feature (e.g., مرشد سياحي)"
              helperText="أضف المميزات التي تجعل رحلتك مميزة"
            />

            {/* Highlights */}
            <ArrayInput
              label="Highlights (What tourists will do)"
              icon={Sparkles}
              items={formData.highlights || []}
              onAdd={(item) => setFormData({ ...formData, highlights: [...(formData.highlights || []), item] })}
              onRemove={(item) => setFormData({ ...formData, highlights: (formData.highlights || []).filter(f => f !== item) })}
              placeholder="Add a highlight (e.g., Visit the Sphinx)"
              helperText="3-5 bullet points of what the tourist will experience"
            />

            {/* Included */}
            <ArrayInput
              label="What's Included"
              icon={CheckCircle2}
              items={formData.included || []}
              onAdd={(item) => setFormData({ ...formData, included: [...(formData.included || []), item] })}
              onRemove={(item) => setFormData({ ...formData, included: (formData.included || []).filter(f => f !== item) })}
              placeholder="Add included item (e.g., Lunch, Entry tickets)"
              badgeVariant="default"
            />

            {/* Excluded */}
            <ArrayInput
              label="What's Not Included"
              icon={XCircle}
              items={formData.excluded || []}
              onAdd={(item) => setFormData({ ...formData, excluded: [...(formData.excluded || []), item] })}
              onRemove={(item) => setFormData({ ...formData, excluded: (formData.excluded || []).filter(f => f !== item) })}
              placeholder="Add excluded item (e.g., Tips, Personal expenses)"
              badgeVariant="outline"
            />
          </div>

          <Separator />

          {/* Audience & Policies Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
              Audience & Policies
            </h3>

            {/* Experience Level */}
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Experience Level
              </Label>
              <Select
                value={formData.experience_level || ''}
                onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label} ({level.labelAr})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Best For */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Best For (Select all that apply)
              </Label>
              <div className="flex flex-wrap gap-2">
                {BEST_FOR_OPTIONS.map((option) => (
                  <Badge
                    key={option.value}
                    variant={(formData.best_for || []).includes(option.value) ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleBestFor(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <Label htmlFor="cancellation_policy" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Cancellation Policy
              </Label>
              <Textarea
                id="cancellation_policy"
                value={formData.cancellation_policy || ''}
                onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })}
                placeholder="e.g., Free cancellation up to 24 hours before the tour"
                rows={2}
                className="mt-1.5"
              />
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <Label htmlFor="availability" className="text-base font-medium">
                Available for Booking
              </Label>
              <p className="text-sm text-muted-foreground">
                Only available tours are shown publicly and via API
              </p>
            </div>
            <Switch
              id="availability"
              checked={formData.availability === 'available'}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, availability: checked ? 'available' : 'unavailable' })
              }
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="shadow-gold">
              {editTour ? 'Save Changes' : 'Add Tour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
