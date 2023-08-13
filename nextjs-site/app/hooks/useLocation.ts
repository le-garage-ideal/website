import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

export const useLocation = () => {
  const { asPath, locale, query } = useRouter();
  const isClient = useIsClient();
  const [location, setLocation] = useState<string>();
  useEffect(() => {
    if (isClient) {
      let queryParams = "";
      let separator = "?";
      for (const key in query) {
        queryParams += `${key}=${query[key]}`;
        separator = "&";
      }
      setLocation(`${window.location.origin}/${locale}${asPath}${queryParams}`)
    }
  }, [isClient, asPath, locale, query])
  return location;
};
