import React, { useState, useEffect, useRef } from 'react';

/**
 * Standalone Chatbot component for direct integration into seerbharat.org
 * This component contains all necessary styling and functionality
 */
const ChatbotForSeerbharat = () => {
  // Add head section for external resources
  useEffect(() => {
    // Add Phosphor Icons script
    const phosphorScript = document.createElement('script');
    phosphorScript.src = 'https://unpkg.com/@phosphor-icons/web@2.1.1/dist/phosphor.js';
    phosphorScript.async = true;
    document.head.appendChild(phosphorScript);
    
    // Add Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    // Add custom styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      
      /* Apply font to chatbot */
      #chatbot-container, #chatbot-toggle, #message-box {
          font-family: 'Poppins', sans-serif;
      }
      
      /* Custom scrollbar styles */
      .chatbot-messages-container::-webkit-scrollbar {
          width: 8px;
      }
      .chatbot-messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
      }
      .chatbot-messages-container::-webkit-scrollbar-thumb {
          background-color: #FF6B35;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
      }

      /* Animation for fade-in effect */
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
      }
      
      /* Animation for pulse effect */
      @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
      }
      .animate-pulse-slow {
          animation: pulse 2s infinite ease-in-out;
      }
      
      /* Animation for slide-in effect */
      @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
      }
      .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
      }

      /* Subtle button hover effect */
      .button-hover-effect {
          transition: all 0.2s ease-in-out;
      }
      .button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      /* Message animation */
      .message-animation {
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
      }
      .message-animation.show {
          opacity: 1;
          transform: translateY(0);
      }
      
      /* SeerBharat theme colors */
      .seerbharat-primary {
          color: #FF6B35; /* Orange */
      }
      .seerbharat-secondary {
          color: #004E89; /* Deep Blue */
      }
      .seerbharat-accent {
          color: #FFBC42; /* Yellow */
      }
      .seerbharat-bg-primary {
          background-color: #FF6B35;
      }
      .seerbharat-bg-secondary {
          background-color: #004E89;
      }
      .seerbharat-bg-accent {
          background-color: #FFBC42;
      }
      .seerbharat-border-primary {
          border-color: #FF6B35;
      }
      .seerbharat-border-secondary {
          border-color: #004E89;
      }
      
      /* Enhanced chatbot styling */
      .chatbot-header {
          background: linear-gradient(135deg, #004E89, #003057);
          border-bottom: 3px solid #FF6B35;
      }
      .chatbot-footer {
          border-top: 2px solid rgba(0, 78, 137, 0.2);
      }
      .bot-message {
          background-color: #f8f8f8;
          border-left: 3px solid #004E89;
      }
      .user-message {
          background-color: #e6f3ff;
          border-right: 3px solid #FF6B35;
      }
      .option-button {
          border: 1px solid #004E89;
          transition: all 0.3s ease;
      }
      .option-button:hover {
          background-color: #FF6B35;
          color: white;
          border-color: #FF6B35;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up on unmount
      if (document.head.contains(phosphorScript)) {
        document.head.removeChild(phosphorScript);
      }
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink);
      }
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [currentSection, setCurrentSection] = useState('initial');
  const messagesEndRef = useRef(null);
  const messageBoxRef = useRef(null);

  // URL placeholders for redirection to seerbharat.org
  const websiteUrls = {
    'about': 'https://seerbharat.org/about',
    'programs': 'https://seerbharat.org/programs',
    'contact': 'https://seerbharat.org/contact',
    'get-involved': 'https://seerbharat.org/get-involved',
    'news': 'https://seerbharat.org/news'
  };

  // The core conversational logic
  const chatData = {
    'initial': {
      botMessage: "Namaste! I'm here to help you. How can I assist you today? Please select an option below:",
      options: [
        { text: "General Questions", value: "general" },
        { text: "Programs & Projects", value: "programs" },
        { text: "Volunteering", value: "volunteering" },
        { text: "Contact Information", value: "contact" },
        { text: "Talk to a human", value: "talk-to-human" },
        { text: "Close Chat", value: "close-chat" }
      ]
    },
    'general': {
      botMessage: "What would you like to know?",
      options: [
        { text: "What is Seer Bharat?", value: "general-what" },
        { text: "What is your vision?", value: "general-vision" },
        { text: "Where is your NGO based?", value: "general-location" },
        { text: "Back to Main Menu", value: "initial" }
      ]
    },
    'programs': {
      botMessage: "I can tell you about our work in these areas:",
      options: [
        { text: "General Projects", value: "programs-general" },
        { text: "Education", value: "programs-education" },
        { text: "Healthcare", value: "programs-healthcare" },
        { text: "Environmental work", value: "programs-environment" },
        { text: "Women Empowerment", value: "programs-women" },
        { text: "Impact so far", value: "programs-impact" },
        { text: "Back to Main Menu", value: "initial" }
      ]
    },
    'volunteering': {
      botMessage: "We're happy you're interested in volunteering!",
      options: [
        { text: "How can I volunteer?", value: "volunteering-how" },
        { text: "What types of opportunities?", value: "volunteering-types" },
        { text: "Back to Main Menu", value: "initial" }
      ]
    },
    'contact': {
      botMessage: "How would you like to get in touch?",
      options: [
        { text: "How can I get in touch?", value: "contact-how" },
        { text: "What is your email address?", value: "contact-email" },
        { text: "What is your phone number?", value: "contact-phone" },
        { text: "Can I subscribe to a newsletter?", value: "contact-newsletter" },
        { text: "Back to Main Menu", value: "initial" }
      ]
    },
    'general-what': {
      botMessage: "Seer Bharat is an NGO dedicated to creating sustainable change across India. Our mission is to empower communities through various programs.",
      options: [{ text: "Back to General Questions", value: "general" }]
    },
    'general-vision': {
      botMessage: "Our vision is to build a future where every Indian has access to quality education, healthcare, and economic opportunities while preserving our culture and environment.",
      options: [{ text: "Back to General Questions", value: "general" }]
    },
    'general-location': {
      botMessage: "Our office is located in Nagpur, Maharashtra. For our complete address and contact details, please visit our 'Contact Us' page.",
      redirect: 'contact'
    },
    'programs-general': {
      botMessage: "That's great! We can take you to our Programs page which showcases all our ongoing initiatives and projects.",
      redirect: 'programs'
    },
    'programs-education': {
      botMessage: "Our 'Education for All' program provides quality education to underprivileged children. To learn more, we can redirect you to the Programs page.",
      redirect: 'programs'
    },
    'programs-healthcare': {
      botMessage: "Our 'Healthcare Outreach' program brings essential healthcare services to remote communities. You can find more details on our Programs page.",
      redirect: 'programs'
    },
    'programs-environment': {
      botMessage: "Our 'Green India' initiative focuses on environmental conservation and sustainable practices. Visit our Programs page for more information.",
      redirect: 'programs'
    },
    'programs-women': {
      botMessage: "Our 'Women Empowerment' programs focus on education, skills development, and entrepreneurship for women. Learn more on our Programs page.",
      redirect: 'programs'
    },
    'programs-impact': {
      botMessage: "We've impacted over 10,000 lives through our various initiatives. For detailed impact reports, please visit our Programs page.",
      redirect: 'programs'
    },
    'volunteering-how': {
      botMessage: "You can volunteer with us by filling out the form on our 'Get Involved' page. We'll match your skills with appropriate opportunities.",
      redirect: 'get-involved'
    },
    'volunteering-types': {
      botMessage: "We offer various volunteering opportunities including teaching, healthcare assistance, administrative support, and event management. Visit our 'Get Involved' page to learn more.",
      redirect: 'get-involved'
    },
    'contact-how': {
      botMessage: "You can reach us through email, phone, or by visiting our office. All contact details are available on our Contact page.",
      redirect: 'contact'
    },
    'contact-email': {
      botMessage: "You can email us at info@seerbharat.org. We typically respond within 24-48 hours.",
      options: [{ text: "Back to Contact Options", value: "contact" }]
    },
    'contact-phone': {
      botMessage: "You can call us at +91-XXXXXXXXXX during our office hours (Monday to Friday, 9 AM to 5 PM IST).",
      options: [{ text: "Back to Contact Options", value: "contact" }]
    },
    'contact-newsletter': {
      botMessage: "Yes, you can subscribe to our newsletter on our website's homepage or Contact page to stay updated with our latest initiatives and events.",
      redirect: 'contact'
    },
    'talk-to-human': {
      botMessage: "I'll connect you with one of our team members. Please provide your email address and a brief message, and someone will get back to you within 24 hours.",
      showInput: true,
      inputPlaceholder: "Your email and message",
      inputHandler: "handleHumanRequest"
    },
    'close-chat': {
      botMessage: "Thank you for chatting with us. If you have more questions later, feel free to return. Have a great day!",
      closeChat: true
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when shown
  useEffect(() => {
    if (showInput && messageBoxRef.current) {
      messageBoxRef.current.focus();
    }
  }, [showInput]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleSectionChange('initial');
    }
  }, [isOpen, messages.length]);

  // Add animation to messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => ({ ...msg, show: true }))
      );
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSectionChange = (section) => {
    if (!chatData[section]) return;
    
    const sectionData = chatData[section];
    
    // Add bot message
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'bot', 
        text: sectionData.botMessage,
        show: false
      }
    ]);
    
    // Handle redirects
    if (sectionData.redirect && websiteUrls[sectionData.redirect]) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: `Redirecting you to our ${sectionData.redirect} page...`,
            show: false
          }
        ]);
        
        setTimeout(() => {
          window.open(websiteUrls[sectionData.redirect], '_blank');
        }, 1500);
      }, 1000);
    }
    
    // Handle input showing
    setShowInput(!!sectionData.showInput);
    
    // Handle chat closing
    if (sectionData.closeChat) {
      setTimeout(() => {
        setIsOpen(false);
        // Reset chat after closing
        setTimeout(() => {
          setMessages([]);
          setCurrentSection('initial');
          setShowInput(false);
        }, 500);
      }, 2000);
    }
    
    setCurrentSection(section);
  };

  const handleOptionClick = (option) => {
    // Add user message
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'user', 
        text: option.text,
        show: false
      }
    ]);
    
    // Change section after a short delay
    setTimeout(() => {
      handleSectionChange(option.value);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'user', 
        text: inputValue,
        show: false
      }
    ]);
    
    // Clear input
    setInputValue('');
    
    // Handle specific input handlers
    if (currentSection === 'talk-to-human') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: "Thank you! We've received your message and will get back to you soon. Is there anything else I can help you with?",
            show: false
          }
        ]);
        setShowInput(false);
        setCurrentSection('initial');
      }, 1000);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-for-seerbharat">
      {/* Chatbot toggle button */}
      <button 
        id="chatbot-toggle"
        onClick={toggleChatbot}
        className="flex items-center justify-center w-16 h-16 rounded-full seerbharat-bg-primary text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110 animate-pulse-slow button-hover-effect"
        aria-label="Toggle chatbot"
      >
        <i className="ph ph-chats-circle text-2xl"></i>
      </button>
      
      {/* Chatbot container */}
      {isOpen && (
        <div 
          id="chatbot-container"
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-40 animate-fadeIn border border-gray-200"
        >
          {/* Chatbot header */}
          <div className="flex items-center justify-between p-4 chatbot-header text-white rounded-t-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <i className="ph ph-robot seerbharat-secondary text-xl"></i>
              </div>
              <h3 className="font-semibold text-lg">Seer Bharat Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Close chatbot"
            >
              <i className="ph ph-x text-lg"></i>
            </button>
          </div>
          
          {/* Chatbot messages container */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-messages-container"
            ref={messagesEndRef}
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-animation ${message.show ? 'show' : ''}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.sender === 'user' 
                      ? 'user-message text-gray-800 rounded-br-none' 
                      : 'bot-message rounded-bl-none'
                  } ${message.isTyping ? 'animate-pulse' : 'animate-slideIn'}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chatbot footer with input */}
          <div className="p-4 chatbot-footer">
            {showInput ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ref={messageBoxRef}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 seerbharat-bg-primary text-white rounded-r-lg hover:opacity-90 transition-all"
                >
                  <i className="ph ph-paper-plane-right text-xl"></i>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentSection && chatData[currentSection]?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="px-3 py-2 option-button rounded-lg text-sm"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotForSeerbharat;