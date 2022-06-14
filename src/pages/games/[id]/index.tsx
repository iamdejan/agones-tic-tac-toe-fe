import * as React from 'react';

export default function GamePage() {
  return (
    <main>
      <div className='layout flex min-h-screen flex-col justify-center text-center'>
        {[0, 1, 2].map((row) => (
          <div key={row} className='flex flex-row justify-center'>
            {[0, 1, 2].map((col) => (
              <button
                key={row + '|' + col}
                className='h-20 w-20 items-center justify-center border-2 border-solid text-center'
                id={row + '|' + col}
                onClick={(e) => {
                  alert(e.currentTarget.id);
                }}
              >
                <h3 className='text-xl'>XO</h3>
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
