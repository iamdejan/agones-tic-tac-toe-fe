import * as React from 'react';

export default function HomePage() {
  return (
    <main>
      <div className='layout flex min-h-screen flex-col justify-center text-center'>
        {[0, 1, 2].map((row) => (
          <div key={row} className='my-3'>
            {[0, 1, 2].map((col) => (
              <button
                key={row + '|' + col}
                className='mx-3'
                id={row + '|' + col}
                onClick={(e) => {
                  alert(e.currentTarget.id);
                }}
              >
                Test {row} {col}
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
