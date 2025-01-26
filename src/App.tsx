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

const NotFoundPage = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
    }}
  >
    <h1 style={{ fontSize: "3rem" }}>thanks for viewing my profile<3 </h1>
  </div>
);

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
