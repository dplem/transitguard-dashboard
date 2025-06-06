
import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getChatbotResponse } from '@/services/chatbotService';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Chicago Transit Safety Assistant. How can I help you today? You can ask me about transit safety, crime statistics, station information, or safety alerts.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await getChatbotResponse(currentInput);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "I'm currently experiencing connectivity issues. Please try again later or contact CTA customer service for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionButtons = [
    "What are the stations near me?",
    "What are the total number of crimes today?",
    "What are the total number of traffic accidents today?",
    "What is the safest line in the last 7 days?"
  ];

  const handleSuggestionClick = async (text: string) => {
    const userMessage = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await getChatbotResponse(text);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "I'm currently experiencing connectivity issues. Please try again later or contact CTA customer service for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg bg-transit-red hover:bg-red-700 text-white h-14 w-14 flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-transit-blue">
              <Bot className="h-5 w-5" />
              Chicago Transit Safety Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-[350px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-1">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-transit-red text-white' 
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-transit-blue animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-transit-blue animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-transit-blue animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Suggestion buttons */}
              {messages.length <= 2 && !isLoading && (
                <div className="flex flex-col gap-2 mt-4">
                  <p className="text-sm text-gray-600 mb-2">Try these example questions:</p>
                  {suggestionButtons.map((text, i) => (
                    <Button 
                      key={i}
                      onClick={() => handleSuggestionClick(text)}
                      variant="outline"
                      className="text-left justify-start text-sm border-transit-blue text-transit-blue hover:bg-transit-blue hover:text-white"
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask about transit safety..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} size="icon" disabled={isLoading} className="bg-transit-blue hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
