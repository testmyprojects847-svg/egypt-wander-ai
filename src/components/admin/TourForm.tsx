import { useState, useEffect } from 'react';
import { Tour, TourFormData, EGYPTIAN_CITIES } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface TourFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TourFormData) => void;
  editTour?: Tour | null;
}

const initialFormData: TourFormData = {
  name: '',
  description: '',
  city: '',
  price: 0,
  currency: 'EGP',
  duration: '',
  availability: 'available',
  image_url: '',
};

export function TourForm({ open, onClose, onSubmit, editTour }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>(initialFormData);

  useEffect(() => {
    if (editTour) {
      setFormData({
        name: editTour.name,
        description: editTour.description,
        city: editTour.city,
        price: editTour.price,
        currency: editTour.currency,
        duration: editTour.duration,
        availability: editTour.availability,
        image_url: editTour.image_url,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editTour ? 'Edit Tour' : 'Add New Tour'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
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

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the tour experience..."
              required
              rows={4}
              className="mt-1.5"
            />
          </div>

          {/* City & Duration */}
          <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem key={city} value={city}>{city}</SelectItem>
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
                placeholder="e.g., 6 hours, 2 days"
                required
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (EGP) *</Label>
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

          {/* Availability */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <Label htmlFor="availability" className="text-base font-medium">
                Available for Booking
              </Label>
              <p className="text-sm text-muted-foreground">
                Only available tours are shown to AI assistants
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
