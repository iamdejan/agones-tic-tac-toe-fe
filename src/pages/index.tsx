import { nanoid } from 'nanoid';
import * as React from 'react';

import GameSchema from '@/models/GameSchema';

import Game from '@/types/Game';
import MongoUtility from '@/utilities/MongoUtility';

function createGameServer(): string {
  // TODO: provision Agones in prod or localhost, depends on env var
  return 'localhost:3001';
}

function createGame(): string {
  const serverUrl = createGameServer();
  const gameId = nanoid();

  const game: Game = { id: gameId, players: [], serverUrl };
  GameSchema.build(game).save();

  return gameId;
}

function joinGame(gameId: string) {
  GameSchema.findOne({
    id: gameId,
  }).then((game) => {
    if (!game) {
      return;
    }

    // TODO dejan: connect socket-io to game server
    const socketId = '';
    // TODO dejan: join
    GameSchema.updateOne({ gameId }, { players: [...game.players, socketId] });
  });
}

function createAndJoinGame() {
  const gameId = createGame();
  joinGame(gameId);
}

export default function HomePage() {
  React.useEffect(() => {
    MongoUtility.connectToDatabase();
  }, []);

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
