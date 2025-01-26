import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Click from "./pages/Click";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const RedirectOnLoad = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialLoad) {
      navigate("/click");
      setIsInitialLoad(false);
    }
  }, [navigate, isInitialLoad]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RedirectOnLoad />
        <Routes>
          <Route path="/click" element={<Click />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/click" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
