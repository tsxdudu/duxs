import React, { useEffect, useRef } from 'react';
import backgroundAudio from './background-audio.mp3'; // Use um arquivo de áudio

interface BackgroundMusicProps {}

const BackgroundMusic = ({}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Define o volume inicial
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error('Erro ao reproduzir o áudio de fundo:', error);
        }
      };
      playAudio();
    }
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src={backgroundAudio} type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
};

export default BackgroundMusic;
