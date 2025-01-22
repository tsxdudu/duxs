import React from 'react';
import { useNavigate } from 'react-router-dom';

const Click = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Get current views
    const storedViews = localStorage.getItem('profileViews');
    const currentViews = storedViews ? parseInt(storedViews) : 5688; // Start with 5688 if no views yet
    
    // Update views
    localStorage.setItem('profileViews', (currentViews + 1).toString());
    localStorage.setItem('lastProfileVisit', new Date().getTime().toString());
    
    // Navigate to profile
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <button
        onClick={handleClick}
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