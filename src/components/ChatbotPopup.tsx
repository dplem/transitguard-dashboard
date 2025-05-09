
import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatbotPopup = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi there 👋' },
    { role: 'bot', content: 'How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // This is just a placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "This is a placeholder response. Connect your real AI chatbot here in the future."
      }]);
    }, 1000);
  };

  const suggestionButtons = [
    "What can this assistant do?",
    "Tell me about your offerings",
    "I have an issue"
  ];

  return (
    <>
      {/* Floating button */}
      <Button 
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg bg-pink-500 hover:bg-pink-600 z-50"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {!isOpen && <span className="absolute top-0 right-0 block w-4 h-4 bg-red-500 text-white text-xs rounded-full">1</span>}
      </Button>

      {/* Chat popup - using a custom Dialog component for more control */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-white rounded-lg shadow-xl border z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium">Virtual Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
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
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                      {message.role === 'bot' && index === 1 && (
                        <span className="block text-xs text-gray-500 mt-1">4:46 PM</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Suggestion buttons */}
              {messages.length <= 3 && (
                <div className="flex flex-col gap-2 mt-4">
                  {suggestionButtons.map((text, i) => (
                    <Button 
                      key={i}
                      onClick={() => {
                        setMessages(prev => [...prev, { role: 'user', content: text }]);
                        setTimeout(() => {
                          setMessages(prev => [...prev, { 
                            role: 'bot', 
                            content: `Response to "${text}" will appear here when connected to a real AI.`
                          }]);
                        }, 1000);
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white rounded-full justify-center py-2 w-auto self-end"
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
                placeholder="Write your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button onClick={handleSendMessage} size="icon" className="h-8 w-8 bg-pink-500 hover:bg-pink-600 rounded-full">
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
