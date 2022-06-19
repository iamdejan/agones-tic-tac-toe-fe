import axios from 'axios';
import * as React from 'react';

export default function HomePage() {
  const [disabled, setDisabled] = React.useState<boolean>(false);

  async function createAndJoinGame() {
    setDisabled(true);

    const gameId = await createGame();
    joinGame(gameId);
  }

  async function createGame(): Promise<string> {
    const serverUrl = createGameServer();

    // TODO: use env var to store base URL of agones-tic-tac-toe-be-db
    const { data } = await axios.post('localhost:3002/games', { serverUrl });
    const gameId = data['gameId'];

    return gameId;
  }

  async function createGameServer(): Promise<string> {
    // TODO: use Agones in prod or use local game server, depends on env var
    return 'localhost:3001';
  }

  async function joinGame(gameId: string) {
    // TODO dejan:
    //  1) get server url
    //  2) connect to server url
  }

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
