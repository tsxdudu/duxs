
import React from 'react';

const animes = [
  {
    title: "Tokyo Ghoul",
    image: "https://images.unsplash.com/photo-1580477667929-3ef27c684b7a?auto=format&fit=crop&w=500",
    description: "Um estudante universitário se transforma em um ghoul após um encontro fatídico."
  },
  {
    title: "Darling in the Franxx",
    image: "https://images.unsplash.com/photo-1633957897986-70e83293f3ff?auto=format&fit=crop&w=500",
    description: "Em um futuro distópico, jovens pilotos lutam para proteger a humanidade."
  },
  {
    title: "Akame ga Kill",
    image: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&w=500",
    description: "Assassinos revolucionários lutam contra um império corrupto."
  },
  {
    title: "Cyberpunk: Edgerunners",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500",
    description: "Um jovem mercenário luta para sobreviver em uma cidade do futuro obcecada por tecnologia."
  },
  {
    title: "Plastic Memories",
    image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&w=500",
    description: "Uma história emocionante sobre androides e suas limitadas expectativas de vida."
  },
  {
    title: "86: Eighty-Six",
    image: "https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc?auto=format&fit=crop&w=500",
    description: "A história de discriminação e guerra entre humanos e os 86."
  },
  {
    title: "Takt Op. Destiny",
    image: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=format&fit=crop&w=500",
    description: "Músicos lutam contra monstros em uma América pós-apocalíptica."
  },
  {
    title: "Solo Leveling",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500",
    description: "Sung Jin-Woo se torna o único caçador que pode subir de nível."
  },
  {
    title: "Your Lie in April",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500",
    description: "Um pianista encontra inspiração em uma violinista de espírito livre."
  },
  {
    title: "Engage Kiss",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500",
    description: "Um caçador de demônios se envolve em um triângulo amoroso complicado."
  },
  {
    title: "Bunny Girl Senpai",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=500",
    description: "Sakuta ajuda garotas afetadas pela Síndrome da Adolescência."
  }
];

const AnimeGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {animes.map((anime) => (
        <div 
          key={anime.title}
          className="group relative overflow-hidden rounded-lg bg-[#1A1F2C] border border-[#6E59A5]/20 hover:border-[#6E59A5]/40 transition-all duration-300"
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-[#9b87f5] mb-1 line-clamp-1">{anime.title}</h3>
            <p className="text-xs text-[#7E69AB] line-clamp-2">{anime.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeGrid;
