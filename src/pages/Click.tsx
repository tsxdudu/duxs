import React from 'react';
import { useNavigate } from 'react-router-dom';

const Click = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Obter o contador de visualizações atual
    const storedViews = localStorage.getItem('profileViews');
    const currentViews = storedViews ? parseInt(storedViews) : 5688; // Começar com 5688 se não houver visualizações ainda

    // Atualizar visualizações
    localStorage.setItem('profileViews', (currentViews + 1).toString());
    localStorage.setItem('lastProfileVisit', new Date().getTime().toString());

    // Navegar para a página de perfil
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <button
        onClick={handleClick}  // Vincula o clique diretamente ao botão
        className="text-6xl font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
      >
        Click
        <span role="img" aria-label="shrug" className="text-4xl">
          🤷‍♂️
        </span>
      </button>
    </div>
  );
};

export default Click;
