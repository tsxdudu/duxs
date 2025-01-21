import React from 'react';
import { useNavigate } from 'react-router-dom';

const Click = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <button
        onClick={() => navigate('/profile')}
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