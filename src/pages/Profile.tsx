import React, { useEffect, useState } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveProfileCard from '@/components/InteractiveProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return count.toString();
};

const Profile = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <AnimatedBackground />

      <div className="relative z-10">
        <InteractiveProfileCard />
      </div>

      {/* View Counter */}
      <div className="mt-12 flex items-center gap-2 text-white/60 z-10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{isLoading ? "..." : viewCount !== null ? formatViewCount(viewCount) : "..."}</span>
      </div>
    </div>
  );
};

export default Profile;
