import axios from 'axios';
import Router from 'next/router';
import * as React from 'react';
import { io, Socket } from 'socket.io-client';

import { useSocket } from '@/context/SocketContext';

export default function HomePage() {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const { socket, setSocket } = useSocket();
  const [gameId, setGameId] = React.useState<string>();

  async function createAndJoinGame() {
    setDisabled(true);

    const gameId = await createGame();
    joinGame(gameId);

    setDisabled(false);
    setGameId(gameId);
  }

  async function createGame(): Promise<string> {
    const serverUrl: string = await createGameServer();

    // TODO: use env var to store base URL of agones-tic-tac-toe-be-db
    try {
      const { data } = await axios.post('http://localhost:3002/games', { serverUrl });
      const gameId = data['gameId'];
      return gameId;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  async function createGameServer(): Promise<string> {
    // TODO: use Agones in prod or use local game server, depends on env var
    return 'localhost:4000';
  }

  async function joinGame(gameId: string) {
    const { data } = await axios.post(`http://localhost:3002/games/${gameId}`);
    const serverUrl = data['serverUrl'] as string;

    const socket: Socket = io(serverUrl, {
      transports: ['websocket'],
    });
    socket.emit('ON_PLAYER_JOINED', {});
    setSocket(socket);
  }

  React.useEffect(() => {
    if (socket && gameId) {
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
          <input type='tel' className='w-24' placeholder='Game ID' />
          <button className='mx-2 rounded border-2 bg-red-600 py-2 px-4 text-center font-bold text-white'>
            Join a game
          </button>
        </div>
      </div>
    </main>
  );
}
