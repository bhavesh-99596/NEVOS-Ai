import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage, MessageSender } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { LogoIcon } from './icons/LogoIcon';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: MessageSender.Bot, text: "Hello! I'm the NEVOS AI assistant. How can I help you with your skin health questions today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: MessageSender.User, text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatbotResponse(currentInput);
      const botMessage: ChatMessage = { sender: MessageSender.Bot, text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: MessageSender.Bot, text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={`fixed bottom-0 right-0 m-6 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          aria-label="Open chat"
        >
          <ChatIcon className="w-8 h-8" />
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 m-6 mb-24 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <header className="bg-brand-primary text-white p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="font-bold font-serif text-lg">NEVOS Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="hover:bg-brand-primary-dark/50 p-1 rounded-full" aria-label="Close chat">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 bg-brand-background/50 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === MessageSender.Bot && (
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <LogoIcon className="w-8 h-8" />
                </div>
              )}
              <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === MessageSender.User ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-subtle text-brand-text rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <LogoIcon className="w-8 h-8" />
                </div>
                <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-brand-subtle text-brand-text rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-white rounded-b-lg">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ''}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-primary-dark disabled:bg-gray-300"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;