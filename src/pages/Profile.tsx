import React, { useEffect, useState } from 'react';
import { Instagram, Music2, Star } from 'lucide-react';
import BackgroundMusic from '@/components/BackgroundMusic';
import SocialLink from '@/components/SocialLink';
import Particles from '@/components/Particles';

const Profile = () => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    try {
      // Get the current timestamp
      const now = new Date().getTime();
      
      // Check if this user has viewed the profile before
      const lastVisit = localStorage.getItem('lastProfileVisit');
      const storedViews = localStorage.getItem('profileViews');
      const viewsCount = storedViews ? parseInt(storedViews) : 0;
      
      console.log('Last visit:', lastVisit);
      console.log('Current views:', viewsCount);
      
      // If no visit recorded or last visit was more than 1 hour ago
      if (!lastVisit || (now - parseInt(lastVisit)) > 3600000) {
        // Update the view count
        const newCount = viewsCount + 1;
        console.log('Incrementing views to:', newCount);
        
        localStorage.setItem('profileViews', newCount.toString());
        localStorage.setItem('lastProfileVisit', now.toString());
        setViewCount(newCount);
      } else {
        // Just display the current count without incrementing
        console.log('Using existing view count:', viewsCount);
        setViewCount(viewsCount);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
      // If there's an error, at least show 1 view
      setViewCount(1);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 relative overflow-hidden bg-gradient-to-br from-[#1A1F2C] via-[#6E59A5] to-[#9b87f5]">
      <Particles />
      <BackgroundMusic url="/your-background-music.mp3" />
      
      {/* Profile Image */}
      <div className="relative flex flex-col items-center z-10">
        <img
          src="/lovable-uploads/570f3fad-7518-4190-847c-56a60e9d483c.png"
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-white/20 object-cover"
        />
        <Star className="text-white mt-4 animate-float" size={24} />
      </div>

      {/* Bio */}
      <p className="mt-8 mb-6 text-center max-w-md px-4 text-lg text-white z-10">
        Behind the scenes of cyber darkness, my code is the shadow that strikes fear and respect.💻
      </p>

      {/* Tags */}
      <div className="flex gap-4 mb-8 z-10">
        <span className="px-4 py-1 rounded-full bg-[#7E69AB]/50 text-white text-sm">
          💻 Programador
        </span>
        <span className="px-4 py-1 rounded-full bg-[#7E69AB]/50 text-white text-sm">
          🔒 Cybersecurity
        </span>
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-4 w-full max-w-md px-4 z-10">
        <SocialLink href="https://www.instagram.com/tsx.duxs">
          <Instagram className="w-5 h-5" />
          <span>Instagram</span>
        </SocialLink>
        
        <SocialLink href="https://tiktok.com/@tsx.duxs">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span>TikTok</span>
        </SocialLink>

        <SocialLink href="https://discord.gg/FAqwXpBv>" className="!bg-[#5865F2]/20 hover:!bg-[#5865F2]/40">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </SocialLink>

        <SocialLink href="https://open.spotify.com/user/31jau7m672eiyksjzvall2knoh3m?si=tyVuyIvpSS6qTdQjiWAkDA" className="!bg-[#1DB954]/20 hover:!bg-[#1DB954]/40">
          <Music2 className="w-5 h-5" />
          <span>Spotify</span>
        </SocialLink>
      </div>

      {/* View Counter */}
      <div className="mt-12 flex items-center gap-2 text-white/60 z-10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{viewCount}</span>
      </div>
    </div>
  );
};

export default Profile