// src/app/pages/auth/error.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (!error) {
      router.replace('/signin');
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={() => router.push('/pages/signin')}
        className="mt-4 text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
      >
        Go to Sign In
      </button>
    </div>
  );
}
