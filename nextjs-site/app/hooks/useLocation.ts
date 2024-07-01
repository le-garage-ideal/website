'use client';
import { useEffect, useState } from "react";

export const useLocation = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    // Check if the code is running on the client side
    if (process) {
      // Access the current page URL using window.location
      setCurrentUrl(window.location.href);
    }
  }, []);
  return { location: currentUrl };
};
