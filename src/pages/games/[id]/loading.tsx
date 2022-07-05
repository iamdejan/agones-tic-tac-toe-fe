import { NextRouter, useRouter } from 'next/router';
import Router from 'next/router';
import * as React from 'react';

import Spinner from '@/components/Spinner';
import { useSocket } from '@/context/SocketContext';

export default function LoadingPage() {
  const router: NextRouter = useRouter();
  const { id: gameId } = router.query;

  const { socket } = useSocket();
  const [event, setEvent] = React.useState<string>();
  React.useEffect(() => {
    if (event === 'GAME_STARTED') {
      Router.push(`/games/${gameId}`);
    }

    if (!socket) {
      console.log('socket is off');
    }

    socket?.on('GAME_STARTED', () => {
      setEvent('GAME_STARTED');
    });

    return () => {
      socket?.off('GAME_STARTED');
    };
  }, [socket, event]);

  return (
    <main>
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <div className='mb-6'>
          <h4>Game ID: {gameId}</h4>
        </div>
        <div className='mb-6'>
          <h2>Waiting for your opponent to join...</h2>
        </div>
        <div>
          <Spinner />
        </div>
      </div>
    </main>
  );
}
