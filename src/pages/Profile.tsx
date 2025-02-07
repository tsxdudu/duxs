
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return count.toString();
};

const animes = [
  {
    title: "Tokyo Ghoul",
    image: "https://images.unsplash.com/photo-1580477667929-3ef27c684b7a?auto=format&fit=crop&w=500",
    description: "Um estudante universitário se transforma em um ghoul após um encontro fatídico."
  },
  {
    title: "Darling in the Franxx",
    image: "https://images.unsplash.com/photo-1633957897986-70e83293f3ff?auto=format&fit=crop&w=500",
    description: "Em um futuro distópico, jovens pilotos lutam para proteger a humanidade."
  },
  {
    title: "Akame ga Kill",
    image: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&w=500",
    description: "Assassinos revolucionários lutam contra um império corrupto."
  },
  {
    title: "Cyberpunk: Edgerunners",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500",
    description: "Um jovem mercenário luta para sobreviver em uma cidade do futuro obcecada por tecnologia."
  },
  {
    title: "Plastic Memories",
    image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&w=500",
    description: "Uma história emocionante sobre androides e suas limitadas expectativas de vida."
  },
  {
    title: "86: Eighty-Six",
    image: "https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc?auto=format&fit=crop&w=500",
    description: "A história de discriminação e guerra entre humanos e os 86."
  },
  {
    title: "Takt Op. Destiny",
    image: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=format&fit=crop&w=500",
    description: "Músicos lutam contra monstros em uma América pós-apocalíptica."
  },
  {
    title: "Solo Leveling",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500",
    description: "Sung Jin-Woo se torna o único caçador que pode subir de nível."
  },
  {
    title: "Your Lie in April",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500",
    description: "Um pianista encontra inspiração em uma violinista de espírito livre."
  },
  {
    title: "Engage Kiss",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500",
    description: "Um caçador de demônios se envolve em um triângulo amoroso complicado."
  },
  {
    title: "Bunny Girl Senpai",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=500",
    description: "Sakuta ajuda garotas afetadas pela Síndrome da Adolescência."
  }
];

const Profile = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const { data: viewData, error: fetchError } = await supabase
          .from('profile_views')
          .select('view_count')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching view count:', fetchError);
          toast.error('Failed to load view count');
          setIsLoading(false);
          return;
        }

        setViewCount(viewData.view_count);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load view count');
        setIsLoading(false);
      }
    };

    fetchViewCount();

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

      <Tabs defaultValue="profile" className="w-full max-w-4xl px-4 z-10">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="animes">Animes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="relative flex flex-col items-center">
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

            <p className="mt-8 mb-6 text-center max-w-md px-4 text-lg text-white">
              Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
                <img src="/programador.png" alt="Programador Logo" className="w-5 h-5" />
                Programador
              </span>
              <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
                <img src="/ciber-seguranca.png" alt="Cybersecurity Logo" className="w-5 h-5" />
                Cybersecurity
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
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
            <div className="mt-12 flex items-center gap-2 text-white/60">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{isLoading ? "..." : viewCount !== null ? formatViewCount(viewCount) : "..."}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="animes" className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animes.map((anime) => (
              <div 
                key={anime.title}
                className="group relative overflow-hidden rounded-lg bg-black/50 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{anime.title}</h3>
                  <p className="text-sm text-gray-400">{anime.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
