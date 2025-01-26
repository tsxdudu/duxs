import React, { useEffect, useState } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';
import SocialLink from '@/components/SocialLink';
import Particles from '@/components/Particles';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const Profile = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        // First, get the current view count
        const { data: viewData, error: fetchError } = await supabase
          .from('profile_views')
          .select('view_count')
          .single();

        if (fetchError) throw fetchError;

        const currentCount = viewData?.view_count || 0;
        const newCount = currentCount + 1;

        // Update the view count
        const { error: updateError } = await supabase
          .from('profile_views')
          .update({ 
            view_count: newCount,
            last_updated: new Date().toISOString()
          })
          .eq('id', 1);

        if (updateError) throw updateError;

        setViewCount(newCount);
        setIsLoading(false);
      } catch (error) {
        console.error('Error updating view count:', error);
        toast.error('Failed to update view count');
        setIsLoading(false);
      }
    };

    updateViewCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('profile_views_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_views'
        },
        (payload: any) => {
          if (payload.new?.view_count) {
            setViewCount(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <BackgroundMusic />
      <Particles />

      <div className="relative flex flex-col items-center z-10">
        <img
          src="/491e98a2c3e81f3efb34db8f9e4c62a8.gif"
          alt="Profile"
          onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
          className="w-32 h-32 rounded-full border-2 border-white/20 object-cover"
        />
        
        <div className="relative flex items-center justify-center mt-2">
          <span 
            className="text-2xl text-white animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 10px #8B5CF6) drop-shadow(0 0 20px #8B5CF6)',
            }}
          >
            ☆
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img 
                  src="/verificado.png" 
                  alt="Verificado" 
                  className="w-3 h-3 absolute right-[-12px] top-1/2 transform -translate-y-1/2" 
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Verificado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <p className="mt-8 mb-6 text-center max-w-md px-4 text-lg text-white z-10">
        Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-4 mb-8 z-10 justify-center">
        <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
          <img src="/programador.png" alt="Programador Logo" className="w-5 h-5" />
          Programador
        </span>
        <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
          <img src="/ciber-seguranca.png" alt="Cybersecurity Logo" className="w-5 h-5" />
          Cybersecurity
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md px-4 z-10">
        {/* Redes sociais */}
        <div className="flex gap-4 justify-center">
          <SocialLink
            href="https://instagram.com/tsx.duxs"
            className="!px-3 transition-transform transform hover:scale-110 duration-300"
          >
            <img src="/instagram.png" alt="Instagram" className="w-5 h-5" />
          </SocialLink>
          <SocialLink
            href="https://tiktok.com/@tsx.duxs"
            className="!px-3 transition-transform transform hover:scale-110 duration-300"
          >
            <img src="/tik-tok.png" alt="TikTok" className="w-5 h-5" />
          </SocialLink>
          <SocialLink
            href="https://discord.gg/vKYK4Zxp"
            className="!px-3 !bg-[#5865F2]/20 hover:!bg-[#5865F2]/40 transition-transform transform hover:scale-110 duration-300"
          >
            <img src="/discordia.png" alt="Discord" className="w-5 h-5" />
          </SocialLink>
        </div>

        {/* Spotify */}
        <a
          href="https://open.spotify.com/user/31jau7m672eiyksjzvall2knoh3m?si=JqY6YUoZT-u0K-hdb1cpAg"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-3 rounded-lg bg-[#1DB954]/20 hover:bg-[#1DB954]/40"
        >
          <img src="/spotify.png" alt="Spotify" className="w-7 h-7" />
          <span className="text-white text-base font-medium">Spotify</span>
        </a>
      </div>

      {/* View Counter */}
      <div className="mt-12 flex items-center gap-2 text-white/60 z-10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{isLoading ? "..." : viewCount}</span>
      </div>
    </div>
  );
};

export default Profile;