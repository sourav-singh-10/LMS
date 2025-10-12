'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          SeerBharat LMS
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link href="/lms" className="hover:text-blue-200">
            Learning Materials
          </Link>
          {session ? (
            <>
              {session.user.isAdmin && (
                <>
                  <Link href="/admin" className="hover:text-blue-200">
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/manage" className="hover:text-blue-200">
                    Manage Content
                  </Link>
                </>
              )}
              <button
                onClick={() => signOut()}
                className="hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="hover:text-blue-200"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}