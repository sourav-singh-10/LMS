"use client";

import dynamic from 'next/dynamic';

// Dynamically import the Chatbot component with no SSR to avoid hydration issues
const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });

const ChatbotWrapper = () => {
  return <Chatbot />;
};

export default ChatbotWrapper;