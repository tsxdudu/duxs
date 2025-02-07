
import React, { useEffect, useState } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';
import Particles from '@/components/Particles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileBadges from '@/components/profile/ProfileBadges';
import SocialLinks from '@/components/profile/SocialLinks';
import AnimeGrid from '@/components/profile/AnimeGrid';
import ViewCounter from '@/components/profile/ViewCounter';

const Profile = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const { data: viewData, error: fetchError } = await supabase
          .from('profile_views')
          .select('view_count')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching view count:', fetchError);
          toast.error('Failed to load view count');
          setIsLoading(false);
          return;
        }

        setViewCount(viewData.view_count);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load view count');
        setIsLoading(false);
      }
    };

    fetchViewCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('profile_views_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_views'
        },
        (payload: any) => {
          if (payload.new?.view_count) {
            setViewCount(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <BackgroundMusic />
      <Particles />

      <div className="relative flex flex-col items-center w-full max-w-4xl px-4 z-10">
        <ProfileHeader />
        <ProfileBadges />

        <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
          <SocialLinks />

          <a
            href="https://open.spotify.com/user/31jau7m672eiyksjzvall2knoh3m?si=JqY6YUoZT-u0K-hdb1cpAg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-lg bg-[#1DB954]/20 hover:bg-[#1DB954]/40"
          >
            <img src="/spotify.png" alt="Spotify" className="w-7 h-7" />
            <span className="text-white text-base font-medium">Spotify</span>
          </a>

          <button
            onClick={() => setActiveTab('animes')}
            className="flex items-center gap-3 px-6 py-3 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/40 w-full justify-center transition-all duration-300"
          >
            <span className="text-[#D6BCFA] text-base font-medium">Animes</span>
          </button>
        </div>

        <ViewCounter viewCount={viewCount} isLoading={isLoading} />

        {activeTab === 'animes' && (
          <div className="mt-8">
            <AnimeGrid />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
