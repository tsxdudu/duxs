import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/auth/AuthContext';

type Props = {
  customMusicUrl?: string;
};

const BackgroundMusic: React.FC<Props> = ({ customMusicUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [musicUrl, setMusicUrl] = useState<string>('/background-audio.mp3');
  const [audioError, setAudioError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Recupera o estado anterior do mute
    const storedMuteStatus = localStorage.getItem('audioMuted');
    if (storedMuteStatus) {
      setIsMuted(JSON.parse(storedMuteStatus));
    }

    // Função para carregar a URL da música
    const loadMusicUrl = async () => {
      console.log("Carregando URL da música...");

      // Se uma música personalizada foi passada como prop, use-a
      if (customMusicUrl) {
        console.log("Usando URL personalizada:", customMusicUrl);
        setMusicUrl(customMusicUrl);
        return;
      }

      // Caso contrário, tente buscar do banco de dados
      try {
        // Se não há usuário autenticado, use a música padrão
        if (!user) return;

        const { data, error } = await supabase
          .from('profile_settings')
          .select('music_url, music_file')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao carregar música personalizada:', error);
          return;
        }

        if (data) {
          // Dá prioridade ao arquivo de música se existir
          if (data.music_file) {
            console.log("Usando music_file do banco de dados:", data.music_file);
            setMusicUrl(data.music_file);
          } else if (data.music_url) {
            console.log("Usando music_url do banco de dados:", data.music_url);
            setMusicUrl(data.music_url);
          } else {
            console.log("Nenhuma música encontrada no banco de dados, usando padrão");
          }
        }
      } catch (error) {
        console.error('Erro ao buscar música do banco de dados:', error);
      }
    };

    loadMusicUrl();

    // Adiciona um listener para clique na página para iniciar o áudio
    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying) {
        playAudio();
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [customMusicUrl, user]);

  // Quando o URL da música muda, tenta reproduzir
  useEffect(() => {
    if (musicUrl && audioRef.current) {
      console.log("URL da música atualizado para:", musicUrl);
      audioRef.current.load();
      playAudio();
    }
  }, [musicUrl]);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.45;

      if (isMuted) {
        audio.muted = true;
      }

      console.log("Tentando reproduzir áudio...");
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Áudio reproduzindo com sucesso!");
            setIsPlaying(true);
            setAudioError(null);
          })
          .catch(error => {
            console.error("Erro ao iniciar reprodução de áudio:", error);
            setAudioError(error.message);

            // Muitos navegadores bloqueiam a reprodução automática,
            // então precisamos esperar interação do usuário
            if (error.name === 'NotAllowedError') {
              console.log("Reprodução automática bloqueada pelo navegador. Aguardando interação do usuário.");
            }
          });
      }
    } catch (error) {
      console.error("Erro ao configurar reprodução de áudio:", error);
      setAudioError(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      const newMutedState = !isMuted;
      audio.muted = newMutedState;
      setIsMuted(newMutedState);
      localStorage.setItem('audioMuted', JSON.stringify(newMutedState));

      // Se estiver desmutando e não estiver tocando, tenta iniciar a reprodução
      if (!newMutedState && !isPlaying) {
        playAudio();
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        onError={(e) => {
          console.error("Erro no elemento de áudio:", e);
          setAudioError("Erro ao carregar o arquivo de áudio");
        }}
      >
        <source src={musicUrl} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
        title={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>

      {audioError && (
        <div className="fixed bottom-4 right-4 bg-red-500/80 text-white p-2 rounded text-sm">
          Erro de áudio: {audioError}
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;