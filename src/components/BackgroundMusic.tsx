import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {}

const BackgroundMusic = ({}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handleInteraction = () => {
      if (audio) {
        audio.volume = 0.3; // Ajusta o volume inicial
        audio
          .play()
          .then(() => {
            console.log('Áudio reproduzido com sucesso.');
          })
          .catch((error) => {
            console.error('Erro ao reproduzir o áudio de fundo:', error);
          });
      }
    };

    // Adiciona o evento de interação para garantir que o áudio seja reproduzido
    document.addEventListener('click', handleInteraction);

    // Remove o evento ao desmontar o componente
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src="/src/background-audio.mp3" type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
};

export default BackgroundMusic;
