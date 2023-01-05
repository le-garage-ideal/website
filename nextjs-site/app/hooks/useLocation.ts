import { useRouter } from "next/router";

export const useLocation = () => {
  const { asPath, locale } = useRouter();
  return `${window.location.origin}/${locale}/${asPath}`;
};
