"use client";

import { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
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
      botMessage: "We focus on 'Environmental Conservation' through tree planting drives and waste management education. You can see more on our Programs page.",
      redirect: 'programs'
    },
    'programs-women': {
      botMessage: "Yes, our 'Women Empowerment' program provides skill development and entrepreneurship support. We can show you this and other programs on our Programs page.",
      redirect: 'programs'
    },
    'programs-impact': {
      botMessage: "We are proud to have impacted over 10,000 lives. You can explore our impact stories and project updates on our website.",
      redirect: 'programs'
    },
    'volunteering-how': {
      botMessage: "Thank you for your interest! We welcome passionate individuals to join us. We can take you to the 'Get Involved' page where you can find out more.",
      redirect: 'get-involved'
    },
    'volunteering-types': {
      botMessage: "We have opportunities in various areas, such as education, healthcare, and environmental projects. For a full list and to apply, we can direct you to our 'Get Involved' page.",
      redirect: 'get-involved'
    },
    'contact-how': {
      botMessage: "You can contact us via phone, email, or by visiting our office. We can take you to our 'Contact Us' page for all the details.",
      redirect: 'contact'
    },
    'contact-email': {
      botMessage: "Our official email is seerbharat@gmail.com. You can also find this and other contact methods on our 'Contact Us' page.",
      redirect: 'contact'
    },
    'contact-phone': {
      botMessage: "You can reach us at +91 95116 81037. We're happy to answer any questions you have.",
      redirect: 'contact'
    },
    'contact-newsletter': {
      botMessage: "Yes, you can stay updated by subscribing to our newsletter. We can take you to the 'News' section to sign up.",
      redirect: 'news'
    },
    'talk-to-human': {
      botMessage: "Please type your query below, and we will get back to you as soon as possible. After you send your message, we'll redirect you to our 'Contact Us' page for more options.",
      input: true
    },
    'close-chat': {
      botMessage: "Goodbye! Feel free to open the chat again if you need anything else.",
      close: true
    },
    'mainMenu': {
      botMessage: "How can I assist you today? Please select an option below:",
      options: [
        { text: "General Questions", value: "general" },
        { text: "Programs & Projects", value: "programs" },
        { text: "Volunteering", value: "volunteering" },
        { text: "Contact Information", value: "contact" },
        { text: "Talk to a human", value: "talk-to-human" },
        { text: "Close Chat", value: "close-chat" } 
      ]
    }
  };

  // Utility function to display a temporary message
  const showMessage = (text) => {
    if (messageBoxRef.current) {
      messageBoxRef.current.textContent = text;
      messageBoxRef.current.classList.remove('hidden');
      setTimeout(() => {
        if (messageBoxRef.current) {
          messageBoxRef.current.classList.add('hidden');
        }
      }, 3000); // Hide after 3 seconds
    }
  };

  // Utility function to close the chatbot window
  const closeChatbot = () => {
    setIsOpen(false);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start chat when the chatbot is opened
  const startChat = () => {
    setMessages([]);
    setCurrentSection('initial');
    setShowInput(false);
    
    // Add welcome messages
    const welcomeMessage = {
      id: 1,
      text: "Namaste! I'm your digital assistant for Seer Bharat. I'm here to help with any queries or difficulties you may have.",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Add second message after a delay
    setTimeout(() => {
      const secondMessage = {
        id: 2,
        text: "How can I assist you today? Please select an option below:",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, secondMessage]);
    }, 1500);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    if (!isOpen) {
      setIsOpen(true);
      startChat();
    } else {
      closeChatbot();
    }
  };

  // Handle user choice and advance the conversation
  const handleUserChoice = (choiceValue, choiceText) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: choiceText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    const nextStep = chatData[choiceValue];
    
    // If a close action is defined, handle it
    if (nextStep.close) {
      const botMessage = {
        id: messages.length + 2,
        text: nextStep.botMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setTimeout(closeChatbot, 1500);
    }
    // If a redirect is defined, handle it
    else if (nextStep.redirect) {
      const botMessage = {
        id: messages.length + 2,
        text: nextStep.botMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      setTimeout(() => {
        showMessage("Redirecting you to the relevant page...");
        window.open(websiteUrls[nextStep.redirect], '_blank');
        closeChatbot();
      }, 1000);
    }
    // If a text input is required, show it and hide options
    else if (nextStep.input) {
      const botMessage = {
        id: messages.length + 2,
        text: nextStep.botMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setShowInput(true);
      setCurrentSection(choiceValue);
    } else {
      // Otherwise, display the bot's response and new options
      const botMessage = {
        id: messages.length + 2,
        text: nextStep.botMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setCurrentSection(choiceValue);
    }
  };

  // Handle user input submission
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    
    // Add bot response
    const botMessage = {
      id: messages.length + 2,
      text: "Thank you for your query. We have received your message and will get back to you shortly. You can also reach out to us directly on the contact page.",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
    
    setTimeout(() => {
      window.open(websiteUrls.contact, '_blank');
      closeChatbot();
    }, 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Message box for notifications */}
      <div id="message-box" ref={messageBoxRef} className="bg-green-50 p-3 rounded-lg shadow-lg mb-4 hidden animate-fadeIn text-green-800 border border-green-200">
        <i className="ph ph-arrow-circle-right mr-2"></i>Redirecting you to the relevant page...
      </div>
      
      {/* Chatbot toggle button */}
      <button
        id="chatbot-toggle"
        onClick={toggleChatbot}
        className="flex items-center justify-center w-16 h-16 rounded-full seerbharat-bg-primary text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110 animate-pulse-slow button-hover-effect"
        aria-label="Toggle chatbot"
      >
        <i className="ph ph-chat-circle-dots text-2xl"></i>
      </button>
      
      {/* Chatbot window */}
      <div
        id="chatbot-container"
        className={`mt-4 w-80 sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'scale-0 hidden'
        }`}
        style={{ height: isOpen ? '500px' : '0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
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
            id="chatbot-close"
            onClick={closeChatbot}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            aria-label="Close chatbot"
          >
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>
        
        {/* Chatbot messages */}
        <div id="chatbot-messages" className="flex-1 p-4 overflow-y-auto chatbot-messages-container bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chatbot options */}
        <div id="chatbot-options" className={`p-4 border-t bg-white ${showInput ? 'hidden' : ''}`}>
          <div className="grid grid-cols-1 gap-2">
            {chatData[currentSection]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleUserChoice(option.value, option.text)}
                className="p-3 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-800 transition-all duration-300 button-hover-effect text-left flex items-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <i className="ph ph-caret-right mr-2 text-emerald-500"></i>
                {option.text}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chatbot input */}
        <div id="chatbot-input" className={`p-4 border-t bg-white flex ${!showInput ? 'hidden' : ''}`}>
          <input
            id="user-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            id="send-button"
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-r-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            aria-label="Send message"
          >
            <i className="ph ph-paper-plane-tilt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;