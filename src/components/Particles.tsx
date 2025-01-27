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
        fpsLimit: 60, // Limite de FPS para desempenho estável
        particles: {
          color: {
            value: "#ffffff", // Cor branca para as partículas
          },
          links: {
            enable: true, // Habilitar as linhas de conexão entre partículas
            color: "#ffffff", // Cor das linhas de conexão
            distance: 200, // Distância de conexão entre as partículas
            opacity: 0.3, // Opacidade das linhas de conexão
            width: 1, // Largura das linhas de conexão
          },
          move: {
            enable: true, // Habilita o movimento das partículas
            speed: 0.8, // Velocidade das partículas
            direction: "random", // Direção aleatória do movimento
            outModes: {
              default: "out", // Quando a partícula sai da tela, ela desaparece
            },
            random: true, // Movimento aleatório
            straight: false, // Movimento não é em linha reta
          },
          number: {
            density: {
              enable: true,
              area: 800, // Densidade das partículas na área
            },
            value: 200, // Número de partículas
          },
          opacity: {
            value: 0.6, // Opacidade das partículas
            animation: {
              enable: true, // Habilitar animação da opacidade
              speed: 1, // Velocidade da animação da opacidade
              opacity_min: 0.1, // Opacidade mínima das partículas
            },
          },
          shape: {
            type: "circle", // Forma das partículas
          },
          size: {
            value: { min: 3, max: 8 }, // Tamanho das partículas
            animation: {
              enable: true, // Animação do tamanho das partículas
              speed: 1, // Velocidade da animação de tamanho
              size_min: 1, // Tamanho mínimo das partículas
            },
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: false, // Desabilita interação ao passar o mouse
            },
            onclick: {
              enable: false, // Desabilita interação ao clicar
            },
          },
        },
        detectRetina: true, // Detecta retina para qualidade em telas de alta definição
      }}
    />
  );
};

export default Particles;
