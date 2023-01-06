import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from '../app/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
