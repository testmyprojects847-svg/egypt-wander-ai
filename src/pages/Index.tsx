import { useEffect } from 'react';
import { PyramidsHero } from '@/components/home/PyramidsHero';
import { ExploreSection } from '@/components/home/ExploreSection';
import { FeaturedTrips } from '@/components/home/FeaturedTrips';
import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  // Force dark mode for the luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <PyramidsHero />
      <ExploreSection />
      <FeaturedTrips />
      <ChatBot 
        welcomeMessage="Welcome to Egypt Tours! How can I help you plan your adventure?"
        placeholder="Ask about tours, destinations..."
        onlineText="Online"
      />
    </div>
  );
};

export default Index;
