import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  url: string;
}

const BackgroundMusic = ({ url }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
    }
  }, []);

  return (
    <audio ref={audioRef} autoPlay loop className="hidden">
      <source src={url} type="audio/mpeg" />
    </audio>
  );
};

export default BackgroundMusic;