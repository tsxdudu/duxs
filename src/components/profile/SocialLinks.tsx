
import React from 'react';
import SocialLink from '@/components/SocialLink';

const SocialLinks = () => {
  return (
    <div className="flex gap-4 justify-center">
      <SocialLink
        href="https://instagram.com/tsx.duxs"
        className="!px-3 transition-transform transform hover:scale-110 duration-300"
      >
        <img src="/instagram.png" alt="Instagram" className="w-5 h-5" />
      </SocialLink>
      <SocialLink
        href="https://tiktok.com/@tsx.duxs"
        className="!px-3 transition-transform transform hover:scale-110 duration-300"
      >
        <img src="/tik-tok.png" alt="TikTok" className="w-5 h-5" />
      </SocialLink>
      <SocialLink
        href="https://discord.gg/vKYK4Zxp"
        className="!px-3 !bg-[#5865F2]/20 hover:!bg-[#5865F2]/40 transition-transform transform hover:scale-110 duration-300"
      >
        <img src="/discordia.png" alt="Discord" className="w-5 h-5" />
      </SocialLink>
    </div>
  );
};

export default SocialLinks;
