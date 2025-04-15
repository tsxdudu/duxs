import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Exibir alguma indicação de carregamento enquanto verifica a autenticação
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Redirecionar para a página de login se não estiver autenticado
        // Salvar a localização atual para redirecionar após o login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}; 