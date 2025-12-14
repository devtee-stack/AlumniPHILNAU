import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import ExecutivesPage from "./pages/ExecutivesPage";
import DirectoryPage from "./pages/DirectoryPage";
import CareersPage from "./pages/CareersPage";
import EventsPage from "./pages/EventsPage";
import ForumPage from "./pages/ForumPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const needsSetup = localStorage.getItem("needsProfileSetup") === "true";
      if (needsSetup && location.pathname !== "/profile") {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, loading, location, navigate]);

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProtectedLayout>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/executives" element={<ExecutivesPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ProtectedLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
