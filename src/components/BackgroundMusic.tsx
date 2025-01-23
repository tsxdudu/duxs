import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);

  // Usar sessionStorage para persistir o estado da música apenas durante a sessão
  useEffect(() => {
    const storedMuteStatus = sessionStorage.getItem('audioMuted');
    if (storedMuteStatus) {
      setIsMuted(JSON.parse(storedMuteStatus));
    }

    const audio = audioRef.current;

    if (audio && !hasPlayed) {
      audio.volume = 0.25;
      
      
      const playAudio = async () => {
        try {
          // Tentativa de reprodução, após a interação do usuário
          await audio.play();
          setHasPlayed(true); // Marca que a música tocou
        } catch (error) {
          console.error('Erro ao reproduzir o áudio:', error);
        }
      };

      playAudio();
    }
  }, [hasPlayed]);

  // Função para alternar o estado de mudo
  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted; // Alterna o estado de mudo
      setIsMuted(audio.muted);
      sessionStorage.setItem('audioMuted', JSON.stringify(audio.muted)); // Persistir mute
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/background-audio.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Botão para alternar o mute */}
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
