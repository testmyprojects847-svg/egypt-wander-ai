import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

interface ExploreEditModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultDestinations: Destination[] = [
  {
    id: '1',
    name: 'Ancient Wonders',
    subtitle: 'Discover the timeless and ancient temples',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=90',
  },
  {
    id: '2',
    name: 'Cosmopolitan Cairo',
    subtitle: 'Experience the bustling capital and culture',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=90',
  },
  {
    id: '3',
    name: 'Red Sea Riviera',
    subtitle: 'Relax in pristine beaches and dive into marine life',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90',
  },
];

export function ExploreEditModal({ open, onClose }: ExploreEditModalProps) {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>(defaultDestinations);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCard = () => {
    const newCard: Destination = {
      id: Date.now().toString(),
      name: 'New Destination',
      subtitle: 'Enter description here',
      image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=90',
    };
    setDestinations([...destinations, newCard]);
    setEditingId(newCard.id);
  };

  const handleDeleteCard = (id: string) => {
    if (destinations.length <= 1) {
      toast({ title: 'Error', description: 'At least one card is required', variant: 'destructive' });
      return;
    }
    setDestinations(destinations.filter((d) => d.id !== id));
  };

  const handleUpdateCard = (id: string, field: keyof Destination, value: string) => {
    setDestinations(
      destinations.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = () => {
    // Validate - no empty strings
    const hasEmpty = destinations.some((d) => !d.name.trim() || !d.subtitle.trim());
    if (hasEmpty) {
      toast({ title: 'Error', description: 'Name and subtitle cannot be empty', variant: 'destructive' });
      return;
    }

    // In a real app, this would persist to database
    toast({ title: 'Changes saved', description: 'Explore section updated successfully' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-primary/30 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-primary text-xl tracking-wider">
            Edit Explore Section
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className="border border-primary/20 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-primary/40" />
                  <span className="text-primary/60 text-xs font-playfair">Card {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCard(dest.id)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-primary/80 font-playfair text-xs">Title</Label>
                  <Input
                    value={dest.name}
                    onChange={(e) => handleUpdateCard(dest.id, 'name', e.target.value)}
                    className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary/80 font-playfair text-xs">Image URL</Label>
                  <Input
                    value={dest.image}
                    onChange={(e) => handleUpdateCard(dest.id, 'image', e.target.value)}
                    className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-primary/80 font-playfair text-xs">Subtitle</Label>
                <Textarea
                  value={dest.subtitle}
                  onChange={(e) => handleUpdateCard(dest.id, 'subtitle', e.target.value)}
                  className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40 text-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Preview */}
              <div className="mt-2">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-24 object-cover rounded border border-primary/20"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddCard}
            className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-black hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
