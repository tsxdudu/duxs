
import React from 'react';

const animes = [
  {
    title: "Tokyo Ghoul",
    image: "https://m.media-amazon.com/images/M/MV5BNmJkZjUyYjItNjM1MC00YTU1LTgwNjMtMDA4YjdlYzc4MWQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Um estudante universitário se transforma em um ghoul após um encontro fatídico."
  },
  {
    title: "Darling in the Franxx",
    image: "https://upload.wikimedia.org/wikipedia/pt/e/eb/Darling_in_the_Franxx_Poster.jpg",
    description: "Em um futuro distópico, jovens pilotos lutam para proteger a humanidade."
  },
  {
    title: "Akame ga Kill",
    image: "https://m.media-amazon.com/images/M/MV5BYTQyZGQzMmUtNjcwMy00ZThiLWFmMzMtOTA0NTI3OWE0MTU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Assassinos revolucionários lutam contra um império corrupto."
  },
  {
    title: "Cyberpunk: Edgerunners",
    image: "https://m.media-amazon.com/images/M/MV5BM2JkMzM2ZmYtNWU4MS00MjZhLWFhZWUtYWFjYTJkN2RhZDliXkEyXkFqcGc@._V1_.jpg",
    description: "Um jovem mercenário luta para sobreviver em uma cidade do futuro obcecada por tecnologia."
  },
  {
    title: "Plastic Memories",
    image: "https://m.media-amazon.com/images/M/MV5BZmM1Yjc3MjItMjk4NC00NmEwLWIyOWYtMmM4ODU5NDM0MDZmXkEyXkFqcGc@._V1_.jpg",
    description: "Uma história emocionante sobre androides e suas limitadas expectativas de vida."
  },
  {
    title: "86: Eighty-Six",
    image: "https://static.wikia.nocookie.net/dublagem/images/5/50/86_Eighty_Six.jpg/revision/latest?cb=20210527041709&path-prefix=pt-br",
    description: "A história de discriminação e guerra entre humanos e os 86."
  },
  {
    title: "Takt Op. Destiny",
    image: "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/ad236ba09a9b3928db976342ae49805f.jpe",
    description: "Músicos lutam contra monstros em uma América pós-apocalíptica."
  },
  {
    title: "Solo Leveling",
    image: "https://uploads.jovemnerd.com.br/wp-content/uploads/2023/09/f5pzp_3xsaav9in__m300201-760x1074.jpg",
    description: "Sung Jin-Woo se torna o único caçador que pode subir de nível."
  },
  {
    title: "Your Lie in April",
    image: "https://m.media-amazon.com/images/M/MV5BZGMyYmFmNzgtMWQ4NS00MWE2LTg4YmEtZGY1MTBiODE0YmE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Um pianista encontra inspiração em uma violinista de espírito livre."
  },
  {
    title: "Engage Kiss",
    image: "https://m.media-amazon.com/images/M/MV5BODM2ZWRhNDktNmI1MC00NWM2LWE4NDYtYmY3ZTQwMDFlZTlkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Um caçador de demônios se envolve em um triângulo amoroso complicado."
  },
  {
    title: "Bunny Girl Senpai",
    image: "https://static.wikia.nocookie.net/fandubpediabrasil/images/4/40/Bunny_Girl.jpg/revision/latest?cb=20211129191117&path-prefix=pt-br",
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
