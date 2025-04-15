import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackgroundMusic from '@/components/BackgroundMusic';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveProfileCard from '@/components/InteractiveProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

// Tipo para contornar erros de TypeScript
interface ProfileData {
    id: number;
    music_url?: string | null;
    music_file?: string | null;
    banner_image_url?: string | null;
    theme_color?: string | null;
    username?: string | null;
}

const PublicProfile = () => {
    const { username } = useParams<{ username: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [profileSettings, setProfileSettings] = useState({
        musicUrl: '',
        bannerImageUrl: '',
        themeColor: '',
        profileId: 0
    });

    // Função para registrar uma visualização com controle para evitar duplicatas
    const registerView = async (profileId: number) => {
        try {
            // Verificar se já visitou este perfil na sessão atual
            const sessionViews = localStorage.getItem('profile_views');
            const viewedProfiles = sessionViews ? JSON.parse(sessionViews) : {};

            // Se já visitou este perfil nas últimas 24 horas, não conta nova visualização
            const lastVisitTime = viewedProfiles[profileId];
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

            if (lastVisitTime && (now - lastVisitTime) < oneDayMs) {
                console.log('Perfil já visitado nas últimas 24 horas, não contabilizando nova visualização');
                return;
            }

            // Registra a visualização no servidor
            const { error } = await supabase.rpc(
                "increment_view_count",
                { profile_id: profileId }
            );

            if (error) {
                console.error('Erro ao incrementar visualizações:', error);
                return;
            }

            // Marca como visitado na sessão atual
            viewedProfiles[profileId] = now;
            localStorage.setItem('profile_views', JSON.stringify(viewedProfiles));

        } catch (error) {
            console.error('Erro ao registrar visualização:', error);
        }
    };

    useEffect(() => {
        // Buscar configurações de perfil pelo username
        const fetchProfileSettings = async () => {
            try {
                if (!username) {
                    setIsLoading(false);
                    toast.error('Nome de usuário não fornecido');
                    return;
                }

                // Consulta que não inclui view_count, pois ele pode não existir na tabela
                const { data, error } = await supabase
                    .from('profile_settings')
                    .select('id, music_url, music_file, banner_image_url, theme_color')
                    .eq('username', username)
                    .single();

                if (error) {
                    console.error('Erro ao carregar perfil:', error);
                    toast.error('Erro ao carregar perfil');
                    setIsLoading(false);
                    return;
                }

                if (data) {
                    const typedData = data as ProfileData;
                    // A música do arquivo tem prioridade sobre a URL
                    setProfileSettings({
                        musicUrl: typedData.music_file || typedData.music_url || '',
                        bannerImageUrl: typedData.banner_image_url || '',
                        themeColor: typedData.theme_color || '',
                        profileId: typedData.id
                    });

                    // Registrar visualização (com controle anti-duplicação)
                    await registerView(typedData.id);
                } else {
                    toast.error(`Perfil "${username}" não encontrado`);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Erro:', error);
                toast.error('Erro ao carregar o perfil');
                setIsLoading(false);
            }
        };

        fetchProfileSettings();
    }, [username]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
            {profileSettings.musicUrl && (
                <BackgroundMusic customMusicUrl={profileSettings.musicUrl} />
            )}
            <AnimatedBackground
                customBannerUrl={profileSettings.bannerImageUrl}
                customThemeColor={profileSettings.themeColor}
            />

            <div className="relative z-10">
                <InteractiveProfileCard />
            </div>
        </div>
    );
};

export default PublicProfile;
