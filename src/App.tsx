import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatorPortal from "./pages/CreatorPortal";
import ValentineProposal from "./pages/ValentineProposal";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { DonationPopup } from "@/components/DonationPopup";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showNavigation = location.pathname !== "/";

  return (
    <>
      {showNavigation && <Navigation />}
      <div className={showNavigation ? "pt-16 pb-14" : "pb-14"}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/valentine" element={<ValentineProposal />} />
          <Route path="/creators" element={<CreatorPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!showNavigation && <Footer />}
      <DonationPopup trigger="timer" delayMs={45000} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
