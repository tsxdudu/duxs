import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Click from "./pages/Click";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  // Usamos um useEffect para verificar quando o componente é montado e redirecionar.
  React.useEffect(() => {
    if (location.pathname === '/') {
      // Redireciona para a página /click
      window.location.replace('/click');
    }
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/click" element={<Click />} />
            <Route path="/profile" element={<Profile />} />
            {/* Definindo a rota raíz como um redirect para /click */}
            <Route path="/" element={<Navigate to="/click" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
