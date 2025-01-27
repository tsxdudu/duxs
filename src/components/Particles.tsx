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
            value: "transparent",
          },
        },
        fpsLimit: 60, // Menor FPS para reduzir o desempenho e diminuir a velocidade das partículas
        particles: {
          color: {
            value: "#ffffff", // Partículas brancas
          },
          links: {
            enable: false, // Desabilita as linhas de conexão
          },
          move: {
            enable: true,
            speed: 0.5, // Velocidade das partículas reduzida
            direction: "random", // Direção aleatória para um movimento mais fluido
            outModes: {
              default: "out", // Partículas saem de forma consistente
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 50, // Reduz o número de partículas para dar um efeito mais suave
          },
          opacity: {
            value: 0.5, // Opacidade das partículas
            animation: {
              enable: true,
              speed: 0.5, // Velocidade da animação de opacidade mais lenta
              minimumValue: 0.3, // Valor mínimo de opacidade
            },
          },
          shape: {
            type: "circle", // Forma das partículas
          },
          size: {
            value: 8, // Tamanho das partículas ajustado
            animation: {
              enable: true,
              speed: 1, // Velocidade da animação do tamanho das partículas
              minimumValue: 5, // Valor mínimo de tamanho
            },
          },
        },
        detectRetina: true,
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
      }}
    />
  );
};

export default Particles;
