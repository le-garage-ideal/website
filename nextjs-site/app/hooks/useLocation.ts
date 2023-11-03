import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

export const useLocation = () => {
  const { asPath, locale, query } = useRouter();
  const isClient = useIsClient();
  const [location, setLocation] = useState<string>();
  useEffect(() => {
    if (isClient) {
      const newLocation = `${window.location.origin}/${locale}${asPath}`;
      setLocation(newLocation);
    }
  }, [isClient, asPath, locale, query, location])
  return {location};
};
