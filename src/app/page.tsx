'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [previousStatus, setPreviousStatus] = useState('');

  // successfull admin login
  useEffect(() => {
    if (previousStatus === 'loading' && status === 'authenticated' && session?.user?.isAdmin) {
      setShowLoginSuccess(true);
      
      // Send email notification 
      fetch('/api/auth/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          action: 'admin_login'
        }),
      }).catch(error => console.error('Failed to send login notification:', error));
      
      // hide pop up after 3 sec
      setTimeout(() => {
        setShowLoginSuccess(false);
      }, 3000);
    }
    
    setPreviousStatus(status);
  }, [status, session, previousStatus]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Admin Login Success Popup */}
      {showLoginSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-pulse">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-4">Admin Login Successful!</h3>
              <div className="h-1 w-16 bg-green-500 mx-auto my-3 rounded-full"></div>
              <p className="text-md text-gray-600 mt-3">
                Welcome back, <span className="font-semibold text-green-600">{session?.user?.name || 'Admin'}</span>! 
                <br />You now have access to all administrative features.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center px-6 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setShowLoginSuccess(false)}
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to SeerBharat Learning Management System</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <Link 
          href="/lms" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
        >
          Browse Learning Materials
        </Link>
        
        {session?.user?.isAdmin ? (
          <Link 
            href="/admin" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            Admin Dashboard
          </Link>
        ) : (
          <button 
            onClick={() => signIn('google')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
}
