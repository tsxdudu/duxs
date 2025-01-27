import { useCallback } from "react";
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
            value: "transparent", // Garantir que o fundo é transparente
          },
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 400, // Número de partículas
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: "#ffffff", // Cor das partículas (brancas)
          },
          shape: {
            type: "circle", // Forma das partículas
          },
          opacity: {
            value: 0.5, // Opacidade das partículas
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 10, // Tamanho das partículas
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: false, // Desabilitar as linhas de conexão
            distance: 500,
            color: "#ffffff", // Cor das linhas (brancas)
            opacity: 0.4,
            width: 2,
          },
          move: {
            enable: true,
            speed: 1, // Diminui a velocidade das partículas
            direction: "bottom",
            random: false,
            straight: false,
            out_mode: "out", // As partículas saem da tela
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas", // Detectar interações apenas no canvas
          events: {
            onhover: {
              enable: true,
              mode: "bubble",
            },
            onclick: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 0.5,
              },
            },
            bubble: {
              distance: 400,
              size: 4,
              duration: 0.3,
              opacity: 1,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default Particles;
