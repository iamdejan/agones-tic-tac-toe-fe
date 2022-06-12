import * as React from 'react';

export default function HomePage() {
  return (
    <main>
      <div className='layout flex min-h-screen flex-col items-center justify-center'>
        <div className='mb-4'>
          <h1>Welcome to Agones Tic-Tac-Toe!</h1>
        </div>

        <div className='justify-center'>
          <button className='mx-2 border-2 px-2 text-center'>Create a game</button>
        </div>
        <div className='mt-2 text-center'>or</div>
        <div className='mt-2 justify-center'>
          <input type='text' className='w-24' placeholder='Game ID' />
          <button className='mx-2 border-2 px-2'>Join a game</button>
        </div>
      </div>
    </main>
  );
}
