import { useEffect } from 'react';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LuxuryHero } from '@/components/home/LuxuryHero';
import { LuxuryExplore } from '@/components/home/LuxuryExplore';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { EditSectionButton } from '@/components/admin/EditSectionButton';
import { HeroEditModal } from '@/components/admin/HeroEditModal';
import { ExploreEditModal } from '@/components/admin/ExploreEditModal';
import { useState } from 'react';

const AdminPage = () => {
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AdminNavbar />

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
    </div>
  );
};

export default AdminPage;
