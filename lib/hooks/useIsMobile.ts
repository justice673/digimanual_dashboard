'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

/**
 * Hook to detect mobile screens that avoids hydration mismatches
 * by only setting the value after mount on the client
 */
export function useIsMobile() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(matches);
  }, [matches]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? isMobile : false;
}

/**
 * Hook to detect tablet/mobile screens (md breakpoint)
 */
export function useIsTabletOrMobile() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(matches);
  }, [matches]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? isMobile : false;
}

