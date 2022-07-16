import * as React from 'react';
import { useEffect, useState } from 'react';

import { Move, Player, Point, useEvent } from '@/context/EventContext';
import { useSocket } from '@/context/SocketContext';
import logger from '@/utils/logger';

export default function GamePage(): JSX.Element {
  const { socket } = useSocket();
  const { event, setEvent } = useEvent();
  const [draw, setDraw] = useState<boolean>();
  const [winner, setWinner] = useState<Player>();
  const [isMyTurn, setMyTurn] = useState<boolean>(false);
  const [board, setBoard] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  function isFilled(row: number, col: number): boolean {
    return board[row][col] !== '';
  }

  function getPoint(id: string): Point {
    const split: string[] = id.split('|');
    const row = Number.parseInt(split[0]);
    const col = Number.parseInt(split[1]);
    return { row, col };
  }

  function handleMove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const point: Point = getPoint(e.currentTarget.id);

    socket?.emit('ON_PLAYER_MOVED', { row: point.row, col: point.col });
  }

  useEffect(() => {
    logger.info(`is my turn? ${isMyTurn}`);

    if (event?.name === 'PLAYER_WINS') {
      setWinner({ player: event.payload!.player, character: event.payload!.character });
    } else if (event?.name === 'DRAW') {
      setDraw(true);
    } else if (event?.name === 'MOVE_COMPLETED') {
      const row = event?.payload!.row;
      const col = event?.payload!.col;
      const newBoard = board;
      newBoard[row][col] = event?.payload!.character;
      setBoard(newBoard);
    } else if (event?.name === 'GAME_STARTED' || event?.name === 'PLAYER_TURN') {
      const player = event?.payload!.player;
      logger.info(`supposed player's turn = ${player}`);
      logger.info(`local player = ${socket?.id}`);
      setMyTurn(player === socket?.id);
    }

    if (!socket) {
      logger.error('socket is off');
    } else {
      logger.info(`socket id = ${socket.id}`);
    }

    socket?.on('PLAYER_WINS', ({ player, character }: Player) => {
      logger.info('set event to PLAYER_WINS');

      setEvent({ name: 'PLAYER_WINS', payload: { player, character, row: -1, col: -1 } });
    });

    socket?.on('DRAW', () => {
      logger.info('set event to DRAW');

      setEvent({ name: 'DRAW', payload: undefined });
    });

    socket?.on('MOVE_COMPLETED', ({ row, col, character }: Move) => {
      logger.info('set event to MOVE_COMPLETED');

      setEvent({ name: 'MOVE_COMPLETED', payload: { row, col, character, player: '' } });
    });

    socket?.on('PLAYER_TURN', ({ player, character }: Player) => {
      logger.info('set event to PLAYER_TURN');

      setEvent({ name: 'PLAYER_TURN', payload: { player, character, row: -1, col: -1 } });
    });

    return () => {
      socket?.off('PLAYER_WINS');
      socket?.off('DRAW');
      socket?.off('MOVE_COMPLETED');
      socket?.off('PLAYER_TURN');
    };
  }, [socket, event, isMyTurn, board, setEvent]);

  return (
    <main>
      {!draw && winner && (
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <div>
            <h2>
              Player {winner.player} (character {winner.character}) WINS!
            </h2>
          </div>
        </div>
      )}
      {draw && (
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <div>
            <h2>Game ends in DRAW!</h2>
          </div>
        </div>
      )}
      {!draw && !winner && (
        <div className='layout flex min-h-screen flex-col justify-center text-center'>
          {[0, 1, 2].map((row) => (
            <div key={row} className='flex flex-row justify-center'>
              {[0, 1, 2].map((col) => (
                <button
                  key={row + '|' + col}
                  className='h-20 w-20 items-center justify-center border-2 border-solid text-center'
                  id={row + '|' + col}
                  disabled={!isMyTurn || isFilled(row, col)}
                  onClick={handleMove}
                >
                  <h3 className='text-xl'>{board[row][col]}</h3>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
