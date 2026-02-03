import React from 'react';

/**
 * Standalone LMS Button component for direct integration into seerbharat.org
 * This component provides a styled button that links to the LMS platform
 */
const LMSButtonForSeerbharat = ({ lmsUrl = 'https://lms.seerbharat.org' }) => {
  // Add styles when component mounts
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      
      .lms-button-container {
        font-family: 'Poppins', sans-serif;
      }
      
      .lms-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #FF6B35, #FF8C42);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 4px 6px rgba(255, 107, 53, 0.2);
        text-decoration: none;
      }
      
      .lms-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(255, 107, 53, 0.3);
        background: linear-gradient(135deg, #FF8C42, #FF6B35);
      }
      
      .lms-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(255, 107, 53, 0.2);
      }
      
      .lms-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div className="lms-button-container">
      <a href={lmsUrl} target="_blank" rel="noopener noreferrer" className="lms-button">
        <svg 
          className="lms-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="white"
          />
          <path 
            d="M4.75 14L12 18.25L19.25 14" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M4.75 9V14" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M19.25 9V14" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Access Learning Portal
      </a>
    </div>
  );
};

export default LMSButtonForSeerbharat;