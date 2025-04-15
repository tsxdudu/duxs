import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundMusic from '@/components/BackgroundMusic';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveProfileCard from '@/components/InteractiveProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/integrations/auth/AuthContext';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileSettings, setProfileSettings] = useState({
    musicUrl: '',
    bannerImageUrl: '',
    themeColor: ''
  });
  const { signOut, user } = useAuth();

  useEffect(() => {
    // Buscar configurações de perfil
    const fetchProfileSettings = async () => {
      try {
        // Se não há usuário autenticado, não buscar dados
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profile_settings')
          .select('music_url, banner_image_url, theme_color')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao carregar configurações do perfil:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          setProfileSettings({
            musicUrl: data.music_url || '',
            bannerImageUrl: data.banner_image_url || '',
            themeColor: data.theme_color || ''
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erro:', error);
        setIsLoading(false);
      }
    };

    fetchProfileSettings();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <BackgroundMusic customMusicUrl={profileSettings.musicUrl} />
      <AnimatedBackground
        customBannerUrl={profileSettings.bannerImageUrl}
        customThemeColor={profileSettings.themeColor}
      />

      {/* Botão de Personalização no Canto Superior Esquerdo */}
      <Link
        to="/customize"
        className="fixed top-4 left-4 z-50"
      >
        <Button
          variant="outline"
          className="bg-black/20 border border-white/20 backdrop-blur-md hover:bg-black/40"
        >
          <Settings className="w-5 h-5 mr-2" />
          Personalizar
        </Button>
      </Link>

      {/* Botão de Logout no Canto Superior Direito */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="fixed top-4 right-20 z-50 bg-black/20 border border-white/20 backdrop-blur-md hover:bg-black/40"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sair
      </Button>

      <div className="relative z-10">
        <InteractiveProfileCard />
      </div>
    </div>
  );
};

export default Profile;
