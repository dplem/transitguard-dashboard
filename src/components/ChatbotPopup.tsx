
import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatbotResponse } from '@/services/chatbotService';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatbotPopup = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi there 👋' },
    { role: 'bot', content: 'How can I help you with Chicago Transit safety today?' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await getChatbotResponse(currentInput);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: response.message
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
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
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    
    try {
      const response = await getChatbotResponse(text);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: response.message
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I'm currently experiencing connectivity issues. Please try again later or contact CTA customer service for immediate assistance."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button 
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg bg-transit-red hover:bg-red-700 z-50"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {!isOpen && <span className="absolute top-0 right-0 block w-4 h-4 bg-transit-blue text-white text-xs rounded-full">1</span>}
      </Button>

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-white rounded-lg shadow-xl border z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b bg-transit-blue">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-transit-red rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium text-white">TransitGuard Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-blue-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col space-y-3">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user' 
                          ? 'bg-transit-red text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                      {message.role === 'bot' && index === 1 && (
                        <span className="block text-xs text-gray-500 mt-1">4:46 PM</span>
                      )}
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
              </div>
              
              {/* Suggestion buttons */}
              {messages.length <= 3 && !isLoading && (
                <div className="flex flex-col gap-2 mt-4">
                  <p className="text-sm text-gray-600 mb-2">Try these example questions:</p>
                  {suggestionButtons.map((text, i) => (
                    <Button 
                      key={i}
                      onClick={() => handleSuggestionClick(text)}
                      className="bg-transit-blue hover:bg-blue-700 text-white rounded-full justify-center py-2 w-auto self-end"
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {/* Input area */}
            <div className="border-t p-3 flex items-center">
              <Input
                placeholder="Ask about Chicago Transit safety..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="h-8 w-8 bg-transit-red hover:bg-red-700 rounded-full"
                disabled={isLoading}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;
