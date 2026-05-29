'use client';

import { useState, useEffect } from 'react';

export function useViewport() {
  const [width, setWidth] = useState(375); // safe SSR default (mobile)

  useEffect(() => {
    setWidth(window.innerWidth);
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return { w: width, mobile: width < 640, tablet: width < 1024 };
}
