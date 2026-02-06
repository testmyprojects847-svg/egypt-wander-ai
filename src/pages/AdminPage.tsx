import { useEffect, useState } from 'react';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LuxuryHero } from '@/components/home/LuxuryHero';
import { LuxuryExplore } from '@/components/home/LuxuryExplore';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { EditSectionButton } from '@/components/admin/EditSectionButton';
import { HeroEditModal } from '@/components/admin/HeroEditModal';
import { ExploreEditModal } from '@/components/admin/ExploreEditModal';
import { ApiPanel } from '@/components/admin/ApiPanel';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminPage = () => {
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [apiPanelOpen, setApiPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AdminNavbar />

      {/* API Documentation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setApiPanelOpen(true)}
          className="bg-primary text-black hover:bg-primary/90 gap-2 shadow-lg"
        >
          <Code className="w-4 h-4" />
          API Docs
        </Button>
      </div>

      {/* Main Content - Same as public Home page with edit buttons */}
      <main className="flex-1">
        {/* Hero Section with Edit Button */}
        <div className="relative">
          <LuxuryHero />
          <EditSectionButton 
            label="Edit Hero Text" 
            onClick={() => setHeroModalOpen(true)} 
          />
        </div>

        {/* Explore Section with Edit Button */}
        <div className="relative">
          <LuxuryExplore />
          <EditSectionButton 
            label="Edit Explore Section" 
            onClick={() => setExploreModalOpen(true)} 
          />
        </div>
      </main>

      <LuxuryFooter />

      {/* Edit Modals */}
      <HeroEditModal 
        open={heroModalOpen} 
        onClose={() => setHeroModalOpen(false)} 
      />
      <ExploreEditModal 
        open={exploreModalOpen} 
        onClose={() => setExploreModalOpen(false)} 
      />

      {/* API Documentation Modal */}
      <Dialog open={apiPanelOpen} onOpenChange={setApiPanelOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-primary font-playfair text-xl flex items-center gap-2">
              <Code className="w-5 h-5" />
              REST API Documentation
            </DialogTitle>
          </DialogHeader>
          <ApiPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
