import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import Index from "./pages/Index";
import ExplorePage from "./pages/ExplorePage";
import ToursPage from "./pages/ToursPage";
import TouristsPage from "./pages/TouristsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/trips" element={<Navigate to="/tours" replace />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/tourists" element={<TouristsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
