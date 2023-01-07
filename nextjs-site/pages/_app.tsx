import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { FullLayout } from '../app/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
