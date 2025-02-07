
import React from 'react';

const ProfileBadges = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
        <img src="/programador.png" alt="Programador Logo" className="w-5 h-5" />
        Programador
      </span>
      <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] text-sm">
        <img src="/ciber-seguranca.png" alt="Cybersecurity Logo" className="w-5 h-5" />
        Cybersecurity
      </span>
    </div>
  );
};

export default ProfileBadges;
