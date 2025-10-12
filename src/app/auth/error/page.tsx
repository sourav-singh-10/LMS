'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Authorization Denied</h1>
        <p className="text-xl mb-4">Only admin emails are allowed!</p>
        <p className="mb-4">Please login with an admin email.</p>
        <p className="text-sm">Redirecting to home page...</p>
      </div>
    </div>
  );
}