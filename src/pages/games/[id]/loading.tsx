import { NextRouter, useRouter } from 'next/router';
import * as React from 'react';

import Spinner from '@/components/Spinner';

export default function LoadingPage() {
  const router: NextRouter = useRouter();
  const { id } = router.query;

  return (
    <main>
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <div className='mb-6'>
          <h4>Game ID: {id}</h4>
        </div>
        <div className='mb-6'>
          <h2>Waiting for your opponent to join...</h2>
        </div>
        <div>
          <Spinner />
        </div>
      </div>
    </main>
  );
}
