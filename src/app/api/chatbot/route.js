import { NextResponse } from 'next/server';

// Simple in-memory database of predefined responses
const chatbotResponses = {
  'course information': 'We offer a variety of courses in programming, design, business, and more. Check out our catalog for the full list.',
  'technical support': 'For technical issues, please provide details about your problem. Our team will help you resolve it as soon as possible.',
  'account help': 'I can help with account-related questions like password resets, profile updates, and subscription management.',
  'default': 'Thank you for your message. How else can I assist you with your learning journey?'
};

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    // Simple keyword matching for responses
    let response = chatbotResponses.default;
    
    // Convert message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase();
    
    // Check for keywords in the message
    Object.keys(chatbotResponses).forEach(key => {
      if (lowerMessage.includes(key)) {
        response = chatbotResponses[key];
      }
    });
    
    // Add a small delay to simulate processing (optional)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}