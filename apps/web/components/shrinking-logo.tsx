'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function ShrinkingLogo() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Image
      src="/logo-name.png"
      alt="Weave Cash"
      width={147}
      height={80}
      priority
      className={`transition-all duration-300 ${isScrolled ? 'h-10 w-auto' : 'h-20 w-auto'}`}
    />
  );
}
