import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Importando useEffect
import Click from "./pages/Click";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate(); // Usando o hook useNavigate

  useEffect(() => {
    // Verifica se a navegação foi um reload (F5 ou refresh)
    if (performance.navigation.type === 1) {
      navigate("/"); // Redireciona para a página principal
    }
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Click />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
