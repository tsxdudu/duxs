import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Click from "./pages/Click";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Componente para controlar o redirecionamento
const RedirectOnLoad = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Apenas redireciona se for o carregamento inicial
    if (isInitialLoad) {
      navigate("/click");
      setIsInitialLoad(false); // Marca que o carregamento inicial foi feito
    }
  }, [navigate, isInitialLoad]);

  return null; // Não renderiza nada
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RedirectOnLoad /> {/* Redireciona apenas no carregamento inicial */}
        <Routes>
          <Route path="/click" element={<Click />} />
          <Route path="/profile" element={<Profile />} />
          {/* Página 404 */}
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
