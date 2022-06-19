import * as React from 'react';

export default function HomePage() {
  function createAndJoinGame() {
    const gameId = createGame();
    joinGame(gameId);
  }

  function createGame(): string {
    const serverUrl = createGameServer();

    // TODO dejan: call agones-tic-tac-toe-be-db
    const gameId = '';

    return gameId;
  }

  function createGameServer(): string {
    // TODO: provision Agones in prod or localhost, depends on env var
    return 'localhost:3001';
  }

  function joinGame(gameId: string) {
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
          <button className='mx-2 border-2 px-2 text-center' onClick={createAndJoinGame}>
            Create a game
          </button>
        </div>
        <div className='mt-2 text-center'>or</div>
        <div className='mt-2 justify-center'>
          <input type='tel' className='w-24' placeholder='Game ID' />
          <button className='mx-2 border-2 px-2'>Join a game</button>
        </div>
      </div>
    </main>
  );
}
