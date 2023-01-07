import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useLocation = () => {
  const { asPath, locale } = useRouter();
  const hasWindow = typeof window !== 'undefined';
  const [location, setLocation] = useState<string>();
  useEffect(() => {
    if (hasWindow) {
      setLocation(`${window.location.origin}/${locale}/${asPath}`)
    }
  }, [hasWindow, asPath, locale])
  return location;
};
