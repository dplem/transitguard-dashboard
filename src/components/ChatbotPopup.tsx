
import { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatbotPopup = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi there! How can I help you with Chicago transit information?' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // This is just a placeholder response - you'll replace this with real AI integration later
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "This is a placeholder response. Connect your real AI chatbot here in the future."
      }]);
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg bg-transit-blue hover:bg-transit-blue/90 z-50"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[380px] p-0 rounded-t-lg border border-gray-200 shadow-xl" side="bottom">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-transit-blue">
            <Bot className="h-5 w-5" />
            Transit Assistant
          </SheetTitle>
        </SheetHeader>
        
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
                        ? 'bg-transit-blue text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4 flex items-center space-x-2">
            <Input
              placeholder="Ask about transit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatbotPopup;
