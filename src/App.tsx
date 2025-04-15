import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Click from "./pages/Click";
import Profile from "./pages/Profile";
import Customize from "./pages/Customize";
import Login from "./pages/Login";
import { AuthProvider } from "./integrations/auth/AuthContext";
import { ProtectedRoute } from "./integrations/auth/ProtectedRoute";
import PublicProfile from "./pages/PublicProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/click" element={<Click />} />
            <Route path="/p/:username" element={<PublicProfile />} />

            {/* Rotas protegidas */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customize"
              element={
                <ProtectedRoute>
                  <Customize />
                </ProtectedRoute>
              }
            />

            {/* Redirecionamento padrão */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
