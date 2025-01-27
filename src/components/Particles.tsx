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
            value: "transparent", // Fundo transparente
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
              enable: true, // Habilitar animação de opacidade
              speed: 1, // Velocidade da animação
              opacity_min: 0.1, // Opacidade mínima das partículas
              sync: false,
            },
          },
          size: {
            value: 10, // Tamanho das partículas
            random: true,
            anim: {
              enable: true, // Habilitar animação de tamanho
              speed: 40, // Velocidade da animação do tamanho
              size_min: 0.1, // Tamanho mínimo das partículas
              sync: false,
            },
          },
          line_linked: {
            enable: false, // Desabilitar as linhas de conexão
          },
          move: {
            enable: true,
            speed: 1, // Velocidade das partículas
            direction: "bottom", // Movimento para baixo
            random: false,
            straight: false,
            out_mode: "out", // As partículas saem da tela
            bounce: false,
            attract: {
              enable: false, // Desabilitar atração
            },
          },
        },
        interactivity: {
          detect_on: "canvas", // Detectar interações apenas no canvas
          events: {
            onhover: {
              enable: false, // Desabilitar interação no hover
            },
            onclick: {
              enable: false, // Desabilitar interação no clique
            },
            resize: true, // Manter ajuste de tela
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default Particles;
