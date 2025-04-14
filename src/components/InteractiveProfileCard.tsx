import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SocialLink from '@/components/SocialLink';

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

const InteractiveProfileCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <StyledWrapper>
      <div className="container noselect" ref={containerRef}>
        <div id="card" ref={cardRef}>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src="/491e98a2c3e81f3efb34db8f9e4c62a8.jpg"
                alt="Profile"
                onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
                className="profile-image"
              />
            </div>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl text-white animate-pulse star">☆</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      src="/verificado.png"
                      alt="Verificado"
                      className="verified-icon"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verificado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="bio">
              Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻
            </p>
            <div className="tags">
              <span className="tag">
                <img src="/programador.png" alt="Programador Logo" className="tag-icon" />
                Programador
              </span>
              <span className="tag">
                <img src="/ciber-seguranca.png" alt="Cybersecurity Logo" className="tag-icon" />
                Cybersecurity
              </span>
            </div>
            <div className="social-links">
              <SocialLink
                href="https://instagram.com/xo.duxs"
                className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
              >
                <img src="/instagram.png" alt="Instagram" className="social-icon" />
              </SocialLink>
              <SocialLink
                href="https://tiktok.com/@tsx.duxs"
                className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
              >
                <img src="/tik-tok.png" alt="TikTok" className="social-icon" />
              </SocialLink>
              <SocialLink
                href="https://discord.gg/yf8QdyBR"
                className="!px-3 !py-2 !bg-transparent hover:!bg-white/10"
              >
                <img src="/discordia.png" alt="Discord" className="social-icon" />
              </SocialLink>
            </div>
            <a
              href="https://open.spotify.com/user/31jau7m672eiyksjzvall2knoh3m?si=JqY6YUoZT-u0K-hdb1cpAg"
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-link"
            >
              <img src="/spotify.png" alt="Spotify" className="spotify-icon" />
              <span className="spotify-text">Spotify</span>
            </a>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default InteractiveProfileCard; 