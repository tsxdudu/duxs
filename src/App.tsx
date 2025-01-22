import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Click from "./pages/Click";
import Profile from "./pages/Profile";
import React, { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Verifica se a página foi recarregada e se a URL é a raiz
    if (location.pathname === "/" && !localStorage.getItem("visited")) {
      // Redireciona automaticamente para /click
      localStorage.setItem("visited", "true");
    }
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota para /click */}
            <Route path="/click" element={<Click />} />
            {/* Rota para /profile */}
            <Route path="/profile" element={<Profile />} />
            {/* Rota inicial que redireciona para /click */}
            <Route
              path="/"
              element={localStorage.getItem("visited") ? <Navigate to="/click" /> : <Navigate to="/profile" />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
