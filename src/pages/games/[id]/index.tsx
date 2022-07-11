import * as React from 'react';
import { useEffect, useState } from 'react';

import { useSocket } from '@/context/SocketContext';
import logger from '@/utils/logger';

interface Player {
  player: string;
  character: string;
}

interface Move {
  row: number;
  col: number;
  character: string;
}

export default function GamePage(): JSX.Element {
  const { socket } = useSocket();
  const [draw, setDraw] = useState<boolean>();
  const [winner, setWinner] = useState<Player>();
  const [isMyTurn, setMyTurn] = useState<boolean>();
  const [board, setBoard] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  function isFilled(row: number, col: number): boolean {
    return board[row][col] !== '';
  }

  useEffect(() => {
    if (!socket) {
      logger.error('socket is off');
    }

    socket?.on('PLAYER_WINS', ({ player, character }: Player) => {
      setWinner({ player, character });
    });

    socket?.on('DRAW', () => {
      setDraw(true);
    });

    socket?.on('MOVE_COMPLETED', ({ row, col, character }: Move) => {
      const newBoard = board;
      newBoard[row][col] = character;
      setBoard(newBoard);
    });

    socket?.on('PLAYER_TURN', ({ player, character }: Player) => {
      setMyTurn(player === socket.id);
    });

    return () => {
      socket?.off('PLAYER_WINS');
      socket?.off('DRAW');
      socket?.off('MOVE_COMPLETED');
    };
  }, [socket, draw, winner, board, isMyTurn]);

  return (
    <main>
      {!draw && winner && (
        <div className='min-h-screen flex-col items-center justify-center'>
          <h2>
            Player {winner.player} (character {winner.character}) WINS!
          </h2>
        </div>
      )}
      {draw && (
        <div className='min-h-screen flex-col items-center justify-center'>
          <h2>Game ends in DRAW!</h2>
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
                  onClick={(e): void => {
                    alert(e.currentTarget.id);
                  }}
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
