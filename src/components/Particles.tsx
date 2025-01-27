import { useCallback } from "react";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import ReactParticles from "react-particles";

const Particles = React.memo(() => {
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
        fpsLimit: 60, // Diminuir o limite de FPS para suavizar os movimentos
        particles: {
          number: {
            value: 150, // Aumentar um pouco o número de partículas
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
              speed: 0.5, // Velocidade da animação de opacidade (mais lenta)
              opacity_min: 0.1, // Opacidade mínima das partículas
              sync: false,
            },
          },
          size: {
            value: 8, // Tamanho das partículas (menor)
            random: true,
            anim: {
              enable: true, // Habilitar animação de tamanho
              speed: 10, // Velocidade da animação de tamanho (mais lenta)
              size_min: 0.1, // Tamanho mínimo das partículas
              sync: false,
            },
          },
          line_linked: {
            enable: false, // Desabilitar as linhas de conexão
          },
          move: {
            enable: true,
            speed: 0.5, // Velocidade das partículas (mais lenta)
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
});

export default Particles;
