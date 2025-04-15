import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SocialLink from '@/components/SocialLink';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/integrations/supabase/types';
import { useAuth } from '@/integrations/auth/AuthContext';

const StyledWrapper = styled.div`
  .container {
    position: relative;
    width: 320px;
    height: 450px;
    transition: 200ms;
  }

  #card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    transition: 300ms;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: visible;
  }

  .profile-content {
    position: relative;
    z-index: 99; /* Valor alto para garantir que está acima de tudo */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    color: white;
    width: 100%;
    pointer-events: auto; /* Isso garante que os elementos dentro são clicáveis */
  }

  .profile-image-container {
    position: relative;
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-bottom: 0.5rem;
  }

  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    object-fit: cover;
    background: #000;
  }

  .star {
    filter: drop-shadow(0 0 10px #8B5CF6) drop-shadow(0 0 20px #8B5CF6);
    font-size: 1.25rem;
  }

  .verified-icon {
    width: 10px;
    height: 10px;
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .bio {
    margin: 0.25rem 0;
    text-align: center;
    font-size: 0.85rem;
    max-width: 90%;
    padding: 0.5rem;
    border-radius: 12px;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    margin: 0.25rem 0;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.7rem;
  }

  .tag-icon {
    width: 14px;
    height: 14px;
  }

  .social-links {
    display: flex;
    gap: 1rem;
    margin: 0.25rem 0;
    position: relative;
    z-index: 100; /* Valor alto para garantir que está acima de tudo */
  }

  .social-icon {
    width: 20px;
    height: 20px;
  }

  .spotify-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: 0.5rem;
    background: rgba(29, 185, 84, 0.2);
    transition: background-color 0.3s;
    margin-top: 0.25rem;
    position: relative;
    z-index: 100; /* Valor alto para garantir que está acima de tudo */
  }

  .spotify-link:hover {
    background: rgba(29, 185, 84, 0.4);
  }

  .spotify-icon {
    width: 20px;
    height: 20px;
  }

  .spotify-text {
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
  }

  #card::before {
    content: '';
    background: rgba(255, 255, 255, 0.1);
    filter: blur(2rem);
    opacity: 30%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    transition: 200ms;
  }

  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

type ProfileSettings = {
  profileImageUrl: string;
  bannerImageUrl: string;
  musicUrl: string;
  bio: string;
  tags: Tag[];
  themeColor: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    discord: string;
    spotify: string;
  };
  starIcon: string;
  verifiedIcon: string;
};

// Função utilitária para normalizar uma tag em qualquer formato
const normalizeTag = (tag: any): Tag => {
  // Se for uma string que parece ser JSON
  if (typeof tag === 'string' && (tag.startsWith('{') || tag.startsWith('['))) {
    try {
      const parsed = JSON.parse(tag);

      // Se for um objeto com a estrutura esperada
      if (parsed && typeof parsed === 'object' && 'text' in parsed) {
        return {
          text: parsed.text || '',
          icon: parsed.icon || ''
        };
      }
      // Caso contrário, usa a string como texto
      return { text: tag, icon: '' };
    } catch (e) {
      return { text: tag, icon: '' };
    }
  }

  // Se já for um objeto
  if (typeof tag === 'object' && tag !== null) {
    return {
      text: typeof tag.text === 'string' ? tag.text : String(tag.text || tag),
      icon: typeof tag.icon === 'string' ? tag.icon : ''
    };
  }

  // Para qualquer outro caso, converte para string
  return { text: String(tag), icon: '' };
};

// Funções auxiliares para tratamento de tags
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTagDisplayText = (tag: any): string => {
  // Se for string, verifica se é JSON
  if (typeof tag === 'string') {
    try {
      const parsed = JSON.parse(tag);
      if (parsed && typeof parsed === 'object' && 'text' in parsed) {
        return parsed.text;
      }
      return tag;
    } catch (e) {
      // Não é JSON, retorna a string diretamente
      return tag;
    }
  }

  // Se for objeto com propriedade text
  if (tag && typeof tag === 'object' && 'text' in tag) {
    return tag.text;
  }

  // Fallback - converte para string
  return String(tag || '');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTagDisplayIcon = (tag: any): string => {
  // Se for string, verifica se é JSON
  if (typeof tag === 'string') {
    try {
      const parsed = JSON.parse(tag);
      if (parsed && typeof parsed === 'object' && 'icon' in parsed) {
        return parsed.icon;
      }
      return '';
    } catch (e) {
      // Não é JSON
      return '';
    }
  }

  // Se for objeto com propriedade icon
  if (tag && typeof tag === 'object' && 'icon' in tag) {
    return tag.icon;
  }

  // Fallback
  return '';
};

const InteractiveProfileCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ProfileSettings>({
    profileImageUrl: '',
    bannerImageUrl: '',
    musicUrl: '',
    bio: 'Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻',
    tags: [{ text: 'Programador', icon: '' }, { text: 'Cybersecurity', icon: '' }],
    themeColor: '#8B5CF6',
    socialLinks: {
      instagram: 'https://instagram.com/xo.duxs',
      tiktok: 'https://tiktok.com/@tsx.duxs',
      discord: 'https://discord.gg/yf8QdyBR',
      spotify: 'https://open.spotify.com/user/31jau7m672eiyksjzvall2knoh3m?si=JqY6YUoZT-u0K-hdb1cpAg'
    },
    starIcon: '☆',
    verifiedIcon: '/verificado.png'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const { user } = useAuth();

  // Função para formatar contagem de visualizações
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${Math.floor(count / 1000000)}M`;
    } else if (count >= 1000) {
      return `${Math.floor(count / 1000)}k`;
    }
    return count.toString();
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Se não há usuário autenticado, usar configurações padrão
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao carregar configurações do perfil:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          let formattedTags: Tag[] = [];
          if (data.tags) {
            console.log('Tags originais do banco:', data.tags);

            try {
              // Se tags for um array, processa cada item
              if (Array.isArray(data.tags)) {
                formattedTags = data.tags.map(tag => normalizeTag(tag));
              }
              // Se não for array, tenta converter
              else {
                formattedTags = [normalizeTag(data.tags)];
              }
            } catch (error) {
              console.error('Erro ao processar tags:', error);
              formattedTags = [];
            }

            console.log('Tags processadas:', formattedTags);
          }

          setSettings({
            profileImageUrl: data.profile_image_url || '/profile-placeholder.png',
            bannerImageUrl: data.banner_image_url || '/banner-placeholder.png',
            musicUrl: data.music_url || '',
            bio: data.bio || 'Bio não configurada',
            tags: formattedTags,
            themeColor: data.theme_color || '#8B5CF6',
            socialLinks: {
              instagram: data.social_links?.instagram || '',
              tiktok: data.social_links?.tiktok || '',
              discord: data.social_links?.discord || '',
              spotify: data.social_links?.spotify || ''
            },
            starIcon: data.star_icon || '☆',
            verifiedIcon: data.verified_icon || '/verificado.png'
          });
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
          return;
        }

        setViewCount(viewData.view_count);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSettings();
    fetchViewCount();

    // Subscribe to realtime changes para profile_settings
    const settingsChannel = supabase
      .channel('profile_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_settings',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        (payload: any) => {
          if (payload.new) {
            const newData = payload.new;
            setSettings({
              profileImageUrl: newData.profile_image_url || '',
              bannerImageUrl: newData.banner_image_url || '',
              musicUrl: newData.music_url || '',
              bio: newData.bio || 'Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻',
              tags: newData.tags || [{ text: 'Programador', icon: '' }, { text: 'Cybersecurity', icon: '' }],
              themeColor: newData.theme_color || '#8B5CF6',
              socialLinks: {
                instagram: newData.social_links?.instagram || '',
                tiktok: newData.social_links?.tiktok || '',
                discord: newData.social_links?.discord || '',
                spotify: newData.social_links?.spotify || ''
              },
              starIcon: newData.star_icon || '☆',
              verifiedIcon: newData.verified_icon || '/verificado.png'
            });
          }
        }
      )
      .subscribe();

    // Subscribe para mudanças em profile_views
    const viewsChannel = supabase
      .channel('profile_views_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_views'
        },
        (payload: { new?: { view_count?: number } }) => {
          if (payload.new?.view_count) {
            setViewCount(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [user]);

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calcular a posição relativa (de 0 a 1)
      const relativeX = x / rect.width;
      const relativeY = y / rect.height;

      // Mapear para ângulos (-20 a 20 graus)
      const rotateY = (relativeX - 0.5) * 40; // -20 a 20 graus
      const rotateX = (0.5 - relativeY) * 40; // -20 a 20 graus

      // Aplicar a transformação
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      card.style.transition = '150ms';

      // Efeito de brilho
      card.style.filter = 'brightness(1.1)';
    };

    const handleMouseLeave = () => {
      // Resetar a transformação
      card.style.transition = '300ms';
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      // Resetar o efeito de brilho
      card.style.filter = 'brightness(1)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Aplica a cor do tema ao card
  const cardStyle = {
    boxShadow: `0 0 15px ${settings.themeColor}50, 0 0 30px ${settings.themeColor}30`,
    borderColor: `${settings.themeColor}40`,
  };

  return (
    <StyledWrapper>
      <div className="container noselect" ref={containerRef}>
        <div id="card" ref={cardRef} style={cardStyle}>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={settings.profileImageUrl || "/491e98a2c3e81f3efb34db8f9e4c62a8.jpg"}
                alt="Profile"
                onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
                className="profile-image"
              />
            </div>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl text-white animate-pulse star" style={{ color: settings.themeColor }}>{settings.starIcon}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      src={settings.verifiedIcon}
                      alt="Verificado"
                      className="verified-icon"
                      onError={(e) => (e.currentTarget.src = '/verificado.png')}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verificado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="bio">
              {settings.bio}
            </p>
            <div className="tags">
              {settings.tags.map((tag, index) => {
                const displayText = getTagDisplayText(tag);
                const displayIcon = getTagDisplayIcon(tag);

                return (
                  <span key={index} className="tag" style={{ borderColor: `${settings.themeColor}40` }}>
                    {displayIcon ? (
                      <img
                        src={displayIcon}
                        alt={`${displayText} Icon`}
                        className="tag-icon"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <img
                        src={index === 0 ? "/programador.png" : "/ciber-seguranca.png"}
                        alt={`${displayText} Logo`}
                        className="tag-icon"
                      />
                    )}
                    {displayText}
                  </span>
                );
              })}
            </div>
            <div className="social-links">
              {settings.socialLinks.instagram && (
                <SocialLink
                  href={settings.socialLinks.instagram}
                  className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
                >
                  <img src="/instagram.png" alt="Instagram" className="social-icon" />
                </SocialLink>
              )}
              {settings.socialLinks.tiktok && (
                <SocialLink
                  href={settings.socialLinks.tiktok}
                  className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
                >
                  <img src="/tik-tok.png" alt="TikTok" className="social-icon" />
                </SocialLink>
              )}
              {settings.socialLinks.discord && (
                <SocialLink
                  href={settings.socialLinks.discord}
                  className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
                >
                  <img src="/discordia.png" alt="Discord" className="social-icon" />
                </SocialLink>
              )}
            </div>
            {settings.socialLinks.spotify && (
              <a
                href={settings.socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
                style={{ backgroundColor: `rgba(29, 185, 84, 0.2)` }}
              >
                <img src="/spotify.png" alt="Spotify" className="spotify-icon" />
                <span className="spotify-text">Spotify</span>
              </a>
            )}

            {/* View Counter - Estilo Antigo */}
            <div className="mt-4 flex items-center justify-center gap-2 text-white/60 z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{viewCount !== null ? formatViewCount(viewCount) : "..."}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default InteractiveProfileCard; 