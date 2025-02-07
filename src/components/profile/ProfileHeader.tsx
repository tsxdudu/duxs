
import React from 'react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ProfileHeader = () => {
  return (
    <>
      <img
        src="/491e98a2c3e81f3efb34db8f9e4c62a8.gif"
        alt="Profile"
        onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
        className="w-32 h-32 rounded-full border-2 border-white/20 object-cover"
      />
      
      <div className="relative flex items-center justify-center mt-2">
        <span 
          className="text-2xl text-white animate-pulse"
          style={{
            filter: 'drop-shadow(0 0 10px #8B5CF6) drop-shadow(0 0 20px #8B5CF6)',
          }}
        >
          ☆
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img 
                src="/verificado.png" 
                alt="Verificado" 
                className="w-3 h-3 absolute right-[-12px] top-1/2 transform -translate-y-1/2" 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Verificado</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="mt-8 mb-6 text-center max-w-md px-4 text-lg text-white">
        Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect. 💻
      </p>
    </>
  );
};

export default ProfileHeader;
