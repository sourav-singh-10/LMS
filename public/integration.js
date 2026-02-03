/**
 * SeerBharat LMS Integration Script
 * 
 * This script allows for easy integration of the SeerBharat LMS components
 * into the seerbharat.org website.
 * 
 * Usage:
 * 1. Add this script to your website:
 *    <script src="https://lms.seerbharat.org/integration.js"></script>
 * 
 * 2. Add the LMS button to your website:
 *    <div id="seerbharat-lms-button"></div>
 * 
 * 3. Add the chatbot to your website:
 *    <div id="seerbharat-chatbot"></div>
 */

(function() {
  // Configuration
  const LMS_URL = window.SEERBHARAT_LMS_URL || 'https://lms.seerbharat.org';
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize LMS Button
    initLMSButton();
    
    // Initialize Chatbot
    initChatbot();
  });
  
  // Initialize LMS Button
  function initLMSButton() {
    const lmsButtonContainer = document.getElementById('seerbharat-lms-button');
    if (!lmsButtonContainer) return;
    
    const button = document.createElement('a');
    button.href = LMS_URL;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.className = 'seerbharat-lms-button';
    button.innerHTML = `
      <div class="seerbharat-lms-button-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>Learning Portal</span>
      </div>
    `;
    
    lmsButtonContainer.appendChild(button);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .seerbharat-lms-button {
        text-decoration: none;
        display: inline-block;
      }
      .seerbharat-lms-button-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #004E89, #003057);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
      }
      .seerbharat-lms-button-inner:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize Chatbot
  function initChatbot() {
    const chatbotContainer = document.getElementById('seerbharat-chatbot');
    if (!chatbotContainer) return;
    
    // Create iframe to load the chatbot
    const iframe = document.createElement('iframe');
    iframe.src = `${LMS_URL}/chatbot-embed`;
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    chatbotContainer.appendChild(iframe);
  }
})();