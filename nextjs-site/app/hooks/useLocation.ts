import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

export const useLocation = () => {
  const { asPath, locale, query } = useRouter();
  const isClient = useIsClient();
  const [location, setLocation] = useState<string>();
  useEffect(() => {
    if (isClient && !location) {
      setLocation(`${window.location.origin}/${locale}${asPath}`)
    }
  }, [isClient, asPath, locale, query, location])
  return location;
};
