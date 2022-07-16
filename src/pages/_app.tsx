import { AppProps } from 'next/app';

import '@/styles/globals.css';
import '@/styles/colors.css';

import EventProvider from '@/context/EventContext';
import SocketProvider from '@/context/SocketContext';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SocketProvider>
      <EventProvider>
        <Component {...pageProps} />
      </EventProvider>
    </SocketProvider>
  );
}

export default MyApp;
