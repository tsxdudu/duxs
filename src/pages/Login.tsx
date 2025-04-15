import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from '@/integrations/auth/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn } from 'lucide-react';

type LocationState = {
    from?: {
        pathname?: string;
    };
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as LocationState;
    const from = locationState?.from?.pathname || '/customize';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegistering) {
                // Registro de novo usuário
                const { error, data } = await signUp(email, password);

                if (error) {
                    toast.error(`Erro ao criar conta: ${error.message}`);
                    return;
                }

                if (data?.user) {
                    toast.success('Conta criada com sucesso! Verifique seu email para confirmação.');
                    setIsRegistering(false);
                }
            } else {
                // Login
                const { error } = await signIn(email, password);

                if (error) {
                    toast.error(`Erro ao fazer login: ${error.message}`);
                    return;
                }

                toast.success('Login realizado com sucesso!');
                navigate(from, { replace: true });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Efeito para criar o background animado
    useEffect(() => {
        const createBubble = () => {
            const bubbleContainer = document.querySelector('.bubble-container');
            if (!bubbleContainer) return;

            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            // Randomize bubble properties
            const size = Math.random() * 60 + 20; // 20px to 80px
            const posX = Math.random() * 100; // 0 to 100%
            const duration = Math.random() * 10 + 8; // 8s to 18s
            const hue = Math.floor(Math.random() * 60) + 220; // Mostly blue-purple hues

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${posX}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.background = `hsla(${hue}, 80%, 50%, 0.15)`;
            bubble.style.backdropFilter = 'blur(1px)';

            bubbleContainer.appendChild(bubble);

            // Remove bubble after animation ends
            setTimeout(() => {
                bubble.remove();
            }, duration * 1000);
        };

        // Create bubbles at regular intervals
        const interval = setInterval(createBubble, 800);

        // Initial bubbles
        for (let i = 0; i < 10; i++) {
            createBubble();
        }

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-black via-purple-950/30 to-black text-white">
            {/* Animated background */}
            <div className="bubble-container absolute inset-0 overflow-hidden pointer-events-none"></div>

            {/* Glass card container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 w-full max-w-md relative z-10 shadow-[0_0_25px_rgba(139,92,246,0.2)]"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-1 rounded-full border-2 border-white/20 border-dashed"
                    ></motion.div>
                    {isRegistering ? (
                        <User size={40} className="text-white drop-shadow-md" />
                    ) : (
                        <LogIn size={40} className="text-white drop-shadow-md" />
                    )}
                </motion.div>

                <h1 className="text-3xl font-bold mb-6 text-center mt-6">
                    {isRegistering ? 'Criar Conta' : 'Acessar Perfil'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                            <Mail size={16} className="text-purple-400" />
                            E-mail
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-black/50 border-white/10 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Label htmlFor="password" className="text-white/90 flex items-center gap-2">
                            <Lock size={16} className="text-purple-400" />
                            Senha
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-black/50 border-white/10 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            minLength={6}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                                    Aguarde...
                                </span>
                            ) : (
                                isRegistering ? 'Criar Conta' : 'Entrar'
                            )}
                        </Button>
                    </motion.div>
                </form>

                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-300"
                    >
                        {isRegistering
                            ? 'Já tem uma conta? Faça login'
                            : 'Não tem uma conta? Registre-se'}
                    </button>
                </motion.div>
            </motion.div>

            {/* CSS for animated bubbles */}
            <style jsx>{`
                .bubble-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                .bubble {
                    position: absolute;
                    bottom: -100px;
                    border-radius: 50%;
                    animation-name: float;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                }
                @keyframes float {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login; 