import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

export const useLocation = () => {
  const { asPath, locale } = useRouter();
  const isClient = useIsClient();
  const [location, setLocation] = useState<string>();
  useEffect(() => {
    if (isClient) {
      setLocation(`${window.location.origin}/${locale}/${asPath}`)
    }
  }, [isClient, asPath, locale])
  return location;
};
