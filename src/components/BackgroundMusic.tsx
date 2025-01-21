import React, { useEffect, useRef } from 'react';
import backgroundMedia from './background-video.mp4'; // Importe o arquivo diretamente

interface BackgroundMusicProps {}

const BackgroundMusic = ({}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Ajusta o volume inicial
    }
  }, []);

  return (
    <audio ref={audioRef} autoPlay loop className="hidden">
      <source src={backgroundMedia} type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
};

export default BackgroundMusic;
