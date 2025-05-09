
import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
      content: "Hello! I'm your Chicago Transit Assistant. How can I help you today? You can ask me about transit schedules, safety information, or station details.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (in a real app, you'd call an API here)
    setTimeout(() => {
      let response;
      const userQuery = input.toLowerCase();
      
      if (userQuery.includes('safe') || userQuery.includes('danger') || userQuery.includes('incident')) {
        response = "Based on our data, most safety incidents occur during evening hours. The downtown Loop area has the lowest incident rate. Always stay aware of your surroundings and report any suspicious activity.";
      } else if (userQuery.includes('schedule') || userQuery.includes('time') || userQuery.includes('when')) {
        response = "Most CTA trains run every 10-15 minutes during peak hours (6am-9am and 3pm-6pm) and every 15-20 minutes during off-peak hours. Bus schedules vary by route.";
      } else if (userQuery.includes('fare') || userQuery.includes('cost') || userQuery.includes('price')) {
        response = "Standard CTA fare is $2.50 for trains and $2.25 for buses. Transfers are $0.25. Consider getting a Ventra card for easier payment.";
      } else {
        response = "Thank you for your question. For the most accurate and up-to-date information, I recommend checking the official CTA website or contacting their customer service.";
      }
      
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg bg-transit-blue text-white h-14 w-14 flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chicago Transit Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-[350px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-1">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-transit-blue text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask about transit info..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
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
