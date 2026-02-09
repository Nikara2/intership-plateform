'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Créer et injecter le link pour les polices
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.fontshare.com/v2/css?f[]=general-sans@700,600,500,400&f[]=satoshi@400,500,700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
