import { AppProps } from 'next/app';

import '@/styles/globals.css';
import '@/styles/colors.css';

import SocketProvider from '@/context/SocketContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}

export default MyApp;
