import React, { useEffect, useRef } from 'react';
import backgroundAudio from './background-audio.mp3'; // Certifique-se de usar um arquivo de áudio válido

interface BackgroundMusicProps {}

const BackgroundMusic = ({}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handleInteraction = () => {
      if (audio) {
        audio.volume = 0.3; // Ajusta o volume inicial
        audio.play().catch((error) => {
          console.error('Erro ao reproduzir o áudio de fundo:', error);
        });
      }
    };

    // Adiciona um evento de interação para garantir que o áudio seja reproduzido
    document.addEventListener('click', handleInteraction);

    // Limpeza do evento ao desmontar o componente
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src={backgroundAudio} type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
};

export default BackgroundMusic;
