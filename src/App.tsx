import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import AdminPage from "./pages/AdminPage";
import AdminToursPage from "./pages/AdminToursPage";
import AdminTouristsPage from "./pages/AdminTouristsPage";
import AdminComplaintsPage from "./pages/AdminComplaintsPage";
import Index from "./pages/Index";
import ExplorePage from "./pages/ExplorePage";
import ToursPage from "./pages/ToursPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import { ChatBot } from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/trips" element={<Navigate to="/tours" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/tours" element={<AdminToursPage />} />
            <Route path="/admin/tourists" element={<AdminTouristsPage />} />
            <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
            
            {/* Redirect old routes */}
            <Route path="/tourists" element={<Navigate to="/admin/tourists" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Global ChatBot - appears on all pages */}
          <ChatBot 
            welcomeMessage="Welcome to Egypt Explorer! 🇪🇬 How can I help you plan your journey?"
            placeholder="Type your message..."
            onlineText="Online"
          />
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
