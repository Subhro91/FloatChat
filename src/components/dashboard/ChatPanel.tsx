import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Message } from "@/pages/Dashboard"; // Assuming types are exported from Dashboard

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (query: string) => void;
  handleExampleClick: (query: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  exampleQueries: string[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  inputValue,
  setInputValue,
  handleSubmit,
  handleExampleClick,
  messagesEndRef,
  exampleQueries,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate('/')} className="text-xl font-bold text-primary transition-colors hover:text-primary/80 cursor-pointer">
            FloatChat
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground mb-6">
              <Bot className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p>Ask me about oceanographic data</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Example queries:</p>
              {exampleQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left h-auto p-3 border-border hover:bg-muted/50 whitespace-normal"
                  onClick={() => handleExampleClick(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Analyzing oceanographic data...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(inputValue); }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about ocean data..."
            disabled={isLoading}
            className="bg-input border-border"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="glow-on-hover"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
