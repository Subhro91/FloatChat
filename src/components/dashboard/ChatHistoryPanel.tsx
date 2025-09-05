import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusSquare, Trash2 } from "lucide-react";
import { ChatHistory } from "@/pages/Dashboard"; // Assuming types are exported from Dashboard
import useMobile from "@/hooks/use-mobile";

interface ChatHistoryPanelProps {
  chatHistory: ChatHistory[];
  activeChatId: string | null;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleDeleteChat: (e: React.MouseEvent, id: string) => void;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  chatHistory,
  activeChatId,
  handleNewChat,
  handleSelectChat,
  handleDeleteChat,
}) => {
  const isMobile = useMobile();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Button variant="outline" size="sm" onClick={handleNewChat} className="w-full">
          <PlusSquare className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chatHistory.map(chat => (
            <div
              key={chat.id}
              className={`group flex w-full cursor-pointer items-center justify-between rounded-md p-3 text-left h-auto transition-colors ${
                activeChatId === chat.id ? 'bg-secondary' : 'hover:bg-muted'
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <p className="flex-1 mr-2 text-sm font-semibold break-words">{chat.title}</p>
              <Trash2 
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-opacity ${
                  isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => handleDeleteChat(e, chat.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistoryPanel;
