import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface HeroEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function HeroEditModal({ open, onClose }: HeroEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title1: 'EXPLORE',
    title2: 'MODERN',
    title3: 'EGYPT',
    subtitle1: 'Unlock Ancient Mysteries &',
    subtitle2: 'Contemporary Wonders',
  });

  const handleSave = () => {
    // Validate - no empty strings
    if (!formData.title1.trim() || !formData.title2.trim() || !formData.title3.trim()) {
      toast({ title: 'Error', description: 'Title fields cannot be empty', variant: 'destructive' });
      return;
    }

    // In a real app, this would persist to database
    toast({ title: 'Changes saved', description: 'Hero section updated successfully' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-primary text-xl tracking-wider">
            Edit Hero Section
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-primary/60 text-xs font-playfair">
            Note: Hero images are locked and cannot be changed.
          </p>

          <div className="space-y-2">
            <Label className="text-primary/80 font-playfair text-sm">Title Line 1</Label>
            <Input
              value={formData.title1}
              onChange={(e) => setFormData({ ...formData, title1: e.target.value })}
              className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary/80 font-playfair text-sm">Title Line 2</Label>
            <Input
              value={formData.title2}
              onChange={(e) => setFormData({ ...formData, title2: e.target.value })}
              className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary/80 font-playfair text-sm">Title Line 3</Label>
            <Input
              value={formData.title3}
              onChange={(e) => setFormData({ ...formData, title3: e.target.value })}
              className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary/80 font-playfair text-sm">Subtitle Line 1</Label>
            <Input
              value={formData.subtitle1}
              onChange={(e) => setFormData({ ...formData, subtitle1: e.target.value })}
              className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary/80 font-playfair text-sm">Subtitle Line 2</Label>
            <Input
              value={formData.subtitle2}
              onChange={(e) => setFormData({ ...formData, subtitle2: e.target.value })}
              className="bg-primary/5 border-primary/30 text-primary placeholder:text-primary/40"
            />
          </div>
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
