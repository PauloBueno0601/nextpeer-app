'use client';

import React from 'react';

interface ElloAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ElloAvatar({ className = '', size = 'md' }: ElloAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cabeça do Ello - formato de moeda */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#gradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        
        {/* Olhos */}
        <circle cx="40" cy="40" r="6" fill="hsl(var(--foreground))" />
        <circle cx="60" cy="40" r="6" fill="hsl(var(--foreground))" />
        
        {/* Pupilas */}
        <circle cx="40" cy="40" r="3" fill="hsl(var(--primary))" />
        <circle cx="60" cy="40" r="3" fill="hsl(var(--primary))" />
        
        {/* Brilho nos olhos */}
        <circle cx="42" cy="38" r="1" fill="white" />
        <circle cx="62" cy="38" r="1" fill="white" />
        
        {/* Sorriso */}
        <path
          d="M 35 60 Q 50 75 65 60"
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Símbolo de cifrão estilizado */}
        <path
          d="M 50 25 L 50 75 M 45 30 L 55 30 M 45 70 L 55 70"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
