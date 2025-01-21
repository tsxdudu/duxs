import React from 'react';
import { cn } from '@/lib/utils';

interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SocialLink = ({ href, children, className }: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/50 hover:bg-secondary/70 transition-all duration-300 text-white",
        className
      )}
    >
      {children}
    </a>
  );
};

export default SocialLink;