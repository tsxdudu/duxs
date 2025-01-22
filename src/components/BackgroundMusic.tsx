import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Ajustar o volume inicial a partir do localStorage para não ficar alto
  useEffect(() => {
    const storedMuteStatus = localStorage.getItem('audioMuted');
    if (storedMuteStatus) {
      setIsMuted(JSON.parse(storedMuteStatus));
    }

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Garantir que o volume esteja em 30% ao carregar
      // Tocar o áudio imediatamente após o primeiro clique
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error('Erro ao reproduzir o áudio:', error);
        }
      };
      playAudio();
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
