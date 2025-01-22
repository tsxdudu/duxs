import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Persistir estado do áudio no localStorage
  useEffect(() => {
    const storedMuteStatus = localStorage.getItem('audioMuted');
    if (storedMuteStatus) {
      setIsMuted(JSON.parse(storedMuteStatus));
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Definir o volume inicial
      if (!audio.paused) {
        audio.play().catch((error) => {
          console.error('Erro ao reproduzir o áudio:', error);
        });
      }
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
      localStorage.setItem('audioMuted', JSON.stringify(audio.muted)); // Persistir estado do áudio
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/background-audio.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;
