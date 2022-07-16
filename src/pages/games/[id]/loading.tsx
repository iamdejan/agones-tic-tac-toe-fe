import { NextRouter, useRouter } from 'next/router';
import Router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import Spinner from '@/components/Spinner';

import { Player, useEvent } from '@/context/EventContext';
import { useSocket } from '@/context/SocketContext';
import logger from '@/utils/logger';

export default function LoadingPage(): JSX.Element {
  const router: NextRouter = useRouter();
  const { id: gameId } = router.query;

  const { socket } = useSocket();
  const { event, setEvent } = useEvent();
  useEffect(() => {
    if (!socket) {
      logger.error('socket is off');
    }

    socket?.on('GAME_STARTED', ({ player, character }: Player) => {
      logger.info('set event to GAME_STARTED');

      setEvent({ name: 'GAME_STARTED', payload: { player, character, row: -1, col: -1 } });
    });

    return () => {
      socket?.removeAllListeners('GAME_STARTED');
    };
  }, [socket, event, gameId, setEvent]);

  logger.info(event);

  if (event?.name === 'GAME_STARTED') {
    Router.push(`/games/${gameId}`);
  }

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
