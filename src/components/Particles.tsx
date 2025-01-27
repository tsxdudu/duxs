import React, { useCallback } from "react";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import ReactParticles from "react-particles";

const Particles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <ReactParticles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent", // Fundo transparente
          },
        },
        fpsLimit: 60, // Limite de FPS para um desempenho estável
        particles: {
          color: {
            value: "#ffffff", // Cor branca para as partículas
          },
          links: {
            enable: true, // Habilitar linhas de conexão
            color: "#ffffff", // Cor das linhas
            distance: 150, // Distância de conexão entre partículas
            opacity: 0.5, // Opacidade das linhas de conexão
            width: 1, // Largura das linhas de conexão
          },
          move: {
            enable: true,
            speed: 1, // Velocidade das partículas
            direction: "random", // Movimento aleatório das partículas
            outModes: {
              default: "out", // Quando a partícula sai, ela desaparece
            },
            random: true, // Movimentos aleatórios das partículas
            straight: false, // Não se movem em linha reta
          },
          number: {
            density: {
              enable: true,
              area: 800, // Densidade das partículas na área
            },
            value: 150, // Número de partículas
          },
          opacity: {
            value: 0.5, // Opacidade das partículas
          },
          shape: {
            type: "circle", // Forma circular das partículas
          },
          size: {
            value: { min: 3, max: 6 }, // Tamanho das partículas
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: false, // Desabilita a interação ao passar o mouse
            },
            onclick: {
              enable: false, // Desabilita a interação ao clicar
            },
          },
        },
        detectRetina: true, // Detecta retina para melhor visualização em telas de alta definição
      }}
    />
  );
};

export default Particles;
