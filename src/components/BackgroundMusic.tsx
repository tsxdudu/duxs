import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false); // Estado para controlar se a música foi carregada

  // Persistir estado do áudio no localStorage
  useEffect(() => {
    const storedMuteStatus = localStorage.getItem('audioMuted');
    if (storedMuteStatus) {
      setIsMuted(JSON.parse(storedMuteStatus));
    }
  }, []);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        setIsAudioLoaded(true); // Marca que a música foi carregada
      } catch (error) {
        console.error('Erro ao reproduzir o áudio:', error);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
      localStorage.setItem('audioMuted', JSON.stringify(audio.muted)); // Persistir estado do áudio
    }
  };

  // O áudio só começa a tocar após o primeiro clique
  useEffect(() => {
    if (!isAudioLoaded) {
      handlePlay(); // Iniciar o áudio ao carregar o componente
    }
  }, [isAudioLoaded]);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/background-audio.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      <button
        onClick={() => {
          handlePlay(); // Garantir que a música comece ao interagir
          toggleMute();
        }}
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
