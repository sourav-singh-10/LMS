"use client";

import React from 'react';
import Link from 'next/link';

/**
 * LMSIntegration - A component that provides a button to access the LMS from seerbharat.org
 * This component can be embedded into seerbharat.org to provide access to the LMS
 */
const LMSIntegration = ({ lmsUrl = process.env.NEXT_PUBLIC_LMS_URL || "https://lms.seerbharat.org" }) => {
  return (
    <div className="lms-integration-container">
      <Link 
        href={lmsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="lms-button"
      >
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E89] to-[#003057] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-medium">Learning Portal</span>
        </div>
      </Link>
      
      <style jsx>{`
        .lms-integration-container {
          display: inline-block;
        }
        .lms-button {
          text-decoration: none;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default LMSIntegration;