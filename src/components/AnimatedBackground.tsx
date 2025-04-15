import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/auth/AuthContext';

type Props = {
    customBannerUrl?: string;
    customThemeColor?: string;
};

const AnimatedBackground: React.FC<Props> = ({ customBannerUrl, customThemeColor }) => {
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [themeColor, setThemeColor] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        // Se temos valores personalizados passados como props, usamos eles
        if (customBannerUrl) {
            setBannerUrl(customBannerUrl);
        }

        if (customThemeColor) {
            setThemeColor(customThemeColor);
        }

        // Caso contrário, buscamos do banco de dados
        const fetchSettings = async () => {
            try {
                // Se não temos um usuário autenticado ou se os valores já foram fornecidos, não buscar do banco
                if (!user || (customBannerUrl && customThemeColor)) return;

                const { data, error } = await supabase
                    .from('profile_settings')
                    .select('banner_image_url, theme_color')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Erro ao carregar banner e cor de tema:', error);
                    return;
                }

                if (data) {
                    if (!customBannerUrl && data.banner_image_url) {
                        setBannerUrl(data.banner_image_url);
                    }

                    if (!customThemeColor && data.theme_color) {
                        setThemeColor(data.theme_color);
                    }
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        fetchSettings();
    }, [customBannerUrl, customThemeColor, user]);

    // Função para criar um gradiente com a cor do tema
    const getGradient = () => {
        // Converte a cor para um formato que possamos manipular
        // Assumindo que themeColor é uma string HEX como "#8B5CF6"
        return {
            background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ${themeColor}20 100%)`,
        };
    };

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
            <img
                src={bannerUrl || '/banner_1.gif'}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={getGradient()} />
        </div>
    );
};

export default AnimatedBackground; 