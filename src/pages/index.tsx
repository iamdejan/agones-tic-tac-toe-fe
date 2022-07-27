import axios from 'axios';
import Router from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { useSocket } from '@/context/SocketContext';
import logger from '@/utils/logger';

export default function HomePage(): JSX.Element {
  const [disabled, setDisabled] = useState<boolean>(false);
  const { socket, setSocket } = useSocket();
  const [gameId, setGameId] = useState<string>();

  async function createAndJoinGame(): Promise<void> {
    setDisabled(true);

    const generatedGameId = await createGame();
    joinGame(generatedGameId);

    setGameId(generatedGameId);
  }

  async function createGame(): Promise<string> {
    const serverUrl: string = await createGameServer();

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BE_DB_BASE_URL}/games`, {
        serverUrl,
      });
      const generatedGameId = data['gameId'] as string;
      return generatedGameId;
    } catch (e) {
      logger.error(e);
      return '';
    }
  }

  async function createGameServer(): Promise<string> {
    const useAgones: boolean = process.env.NEXT_PUBLIC_USE_AGONES === 'true';
    if (useAgones) {
      // TODO: use Agones in prod or use local game server, depends on env var
      return '';
    }

    const host = '34.101.231.69';
    const port = 7645;
    return `${host}:${port}`;
  }

  async function joinGame(gameId: string): Promise<void> {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BE_DB_BASE_URL}/games/${gameId}`);
    const serverUrl = data['serverUrl'] as string;

    const socket: Socket = io(serverUrl, {
      transports: ['websocket'],
    });
    setSocket(socket);
  }

  async function handleJoinGame(event: React.FormEvent<unknown>): Promise<void> {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      gameId: { value: string };
    };
    const submittedGameId = target.gameId.value;
    await joinGame(submittedGameId);
    setGameId(submittedGameId);
  }

  useEffect(() => {
    if (socket && gameId) {
      logger.info('emitting ON_PLAYER_JOINED and redirecting...');

      socket.emit('ON_PLAYER_JOINED', {});
      Router.push(`/games/${gameId}/loading`);
    }
  }, [socket, gameId]);

  return (
    <main>
      <div className='layout flex min-h-screen flex-col items-center justify-center'>
        <div className='mb-4'>
          <h1>Welcome to Agones Tic-Tac-Toe!</h1>
        </div>

        <div className='justify-center'>
          <button
            disabled={disabled}
            className='mx-2 rounded border-2 bg-red-600 py-2 px-4 text-center font-bold text-white'
            onClick={createAndJoinGame}
          >
            {!disabled && 'Create a game'}
            {disabled && 'Loading...'}
          </button>
        </div>
        <div className='mt-2 text-center'>or</div>
        <div className='mt-2 justify-center'>
          <form onSubmit={handleJoinGame}>
            <input id='gameId' type='text' className='w-96' placeholder='Game ID' required />
            <button
              type='submit'
              className='mx-2 rounded border-2 bg-red-600 py-2 px-4 text-center font-bold text-white'
            >
              Join a game
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
