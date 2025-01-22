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
            value: "transparent",
          },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#A78BFA", // Roxo mais claro para as partículas
          },
          links: {
            color: "#8B5CF6", // Roxo para as linhas de conexão
            distance: 150,
            enable: true,
            opacity: 0.6, // Ajuste a opacidade para torná-las um pouco mais visíveis
            width: 2, // Aumente a largura das linhas para um efeito mais marcado
          },
          move: {
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 3, // Aumente a velocidade das partículas para um movimento mais dinâmico
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100, // Aumente o número de partículas para mais densidade
          },
          opacity: {
            value: 0.7, // Aumente a opacidade para as partículas ficarem mais visíveis
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 8 }, // Aumente o tamanho das partículas
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default Particles;
