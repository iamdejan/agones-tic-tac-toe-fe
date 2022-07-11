import { NextRouter, useRouter } from 'next/router';
import Router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import Spinner from '@/components/Spinner';

import { useSocket } from '@/context/SocketContext';
import logger from '@/utils/logger';

export default function LoadingPage(): JSX.Element {
  const router: NextRouter = useRouter();
  const { id: gameId } = router.query;

  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      logger.error('socket is off');
    }

    socket?.on('GAME_STARTED', () => {
      Router.push(`/games/${gameId}`);
    });

    return () => {
      socket?.off('GAME_STARTED');
    };
  }, [socket, gameId]);

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
