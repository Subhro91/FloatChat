import { useState, useRef, useEffect } from "react";
import { PlusSquare, Send, Bot, Loader2, LogOut, Trash2, MessageSquare, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import model from "@/lib/gemini";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, setDoc, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMobile from "@/hooks/use-mobile";
import ChatHistoryPanel from "@/components/dashboard/ChatHistoryPanel";
import ChatPanel from "@/components/dashboard/ChatPanel";
import VisualizationPanel from "@/components/dashboard/VisualizationPanel";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualization?: Visualization;
}

export interface Visualization {
  is_valid_query: boolean; // Add this new property
  summary: string;
  mapPoints?: Array<{ lat: number; lng: number; id: string; temp?: number }>;
  chartData?: {
    labels: string[];
    xAxisLabel?: string; // Optional X-axis label
    yAxisLabel?: string; // Optional Y-axis label
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visualizations, setVisualizations] = useState<Visualization | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileTab, setMobileTab] = useState('chat'); // Add state for mobile tabs
  const isMobile = useMobile();

  const exampleQueries = [
    "Show me temperature profiles from the North Atlantic",
    "What's the salinity trend in the Southern Ocean?", 
    "Find float data near the Gulf Stream",
    "Compare temperatures between 2020 and 2023"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "chats"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: ChatHistory[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || `Chat ${doc.id}`,
        lastMessage: doc.data().lastMessage || "No messages yet",
      }));
      setChatHistory(history);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeChatId || !user) {
      setMessages([]);
      setVisualizations(null);
      return;
    };
    const q = query(
      collection(db, "users", user.uid, "chats", activeChatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
    return {
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          visualization: data.visualization,
        };
      });
      setMessages(loadedMessages);

      // Restore the latest visualization from the chat history
      const lastVizMessage = [...loadedMessages].reverse().find(msg => msg.visualization);
      if (lastVizMessage) {
        setVisualizations(lastVizMessage.visualization);
      } else {
        setVisualizations(null);
      }
    });
    return () => unsubscribe();
  }, [activeChatId, user]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setVisualizations(null);
    setInputValue("");
    if (isMobile) setMobileTab('chat'); // Switch to chat tab on mobile
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setVisualizations(null);
    if (isMobile) setMobileTab('chat'); // Switch to chat tab on mobile
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const chatDocRef = doc(db, "users", user.uid, "chats", chatId);
      const messagesQuery = query(collection(chatDocRef, "messages"));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const batch = writeBatch(db);
      messagesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await deleteDoc(chatDocRef);

      if (activeChatId === chatId) {
        handleNewChat();
      }
      
      toast({
        title: "Chat Deleted",
        description: "The conversation has been permanently removed.",
      });

    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        title: "Error Deleting Chat",
        description: "There was an issue deleting the conversation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading || !user) return;

    setIsLoading(true);
    setInputValue("");
    
    let currentChatId = activeChatId;

    try {
      if (!currentChatId) {
        const newChatRef = await addDoc(collection(db, "users", user.uid, "chats"), {
          title: query, // Use the full query as the title
          timestamp: serverTimestamp(),
        });
        currentChatId = newChatRef.id;
        setActiveChatId(currentChatId);
      }

      const userMessage = { role: 'user', content: query, timestamp: serverTimestamp() };
      await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), userMessage);
      
      const systemPrompt = `You are FloatChat, an AI assistant for oceanographers. Your task is to analyze user queries and respond in one of two ways, using a strict JSON format.

1.  **If the query is relevant** to oceanography, marine science, ARGO floats, or related topics, respond with the full data structure.
    - Set "is_valid_query" to true.
    - Provide a "summary", "mapPoints", and "chartData".

    Example relevant query JSON response:
    {
      "is_valid_query": true,
      "summary": "Analysis of ARGO float data reveals...",
      "mapPoints": [{"lat": 34.5, "lng": -45.2, "id": "float-1", "temp": 18.5}],
      "chartData": {
        "labels": ["0m", "500m", "1000m"],
        "xAxisLabel": "Depth (m)",
        "yAxisLabel": "Salinity (PSU)",
        "datasets": [{
          "label": "Salinity Profile",
          "data": [35.2, 34.8, 34.5]
        }]
      }
    }

2.  **If the query is irrelevant**, nonsensical, gibberish, or off-topic, respond with a simplified structure.
    - Set "is_valid_query" to false.
    - Provide a polite "summary" explaining your purpose.
    - Omit "mapPoints" and "chartData".

    Example irrelevant query JSON response:
    {
      "is_valid_query": false,
      "summary": "Sorry, I can only answer questions regarding oceanographic data."
    }

User's Query: "${query}"

Now, generate the appropriate JSON response.`;

      const chat = model.startChat();
      const result = await chat.sendMessage(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonString = text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text;
        const data: Visualization = JSON.parse(jsonString);

        if (data.is_valid_query && data.chartData) {
          // Ensure chart colors are always applied
          data.chartData.datasets = data.chartData.datasets.map(dataset => ({
            ...dataset,
            borderColor: dataset.borderColor || 'hsl(217 91% 60%)',
            backgroundColor: dataset.backgroundColor || 'hsl(217 91% 60% / 0.1)',
          }));
      setVisualizations(data);
          const aiMessage = { role: 'assistant', content: data.summary, timestamp: serverTimestamp(), visualization: data };
          await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), aiMessage);
          await setDoc(doc(db, "users", user.uid, "chats", currentChatId), { lastMessage: data.summary }, { merge: true });
        } else {
          setVisualizations(null);
          const aiMessage = { role: 'assistant', content: data.summary, timestamp: serverTimestamp() };
          await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), aiMessage);
          await setDoc(doc(db, "users", user.uid, "chats", currentChatId), { lastMessage: data.summary }, { merge: true });
        }
      } catch (parseError) {
        console.error("Could not parse AI response, treating as invalid query:", parseError);
        setVisualizations(null);
        const aiMessage = { role: 'assistant', content: "Sorry, I can only answer questions regarding oceanographic data.", timestamp: serverTimestamp() };
        await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), aiMessage);
        await setDoc(doc(db, "users", user.uid, "chats", currentChatId), { lastMessage: "Invalid query" }, { merge: true });
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (currentChatId) {
        const errorMessage = { role: 'assistant', content: "Sorry, an unexpected error occurred. Please try again.", timestamp: serverTimestamp() };
        await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (query: string) => {
    setInputValue(query);
    handleSubmit(query);
  };

  const saveMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!user) return null;
    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newChatRef = await addDoc(collection(db, "users", user.uid, "chats"), {
        title: message.content.substring(0, 30), // Use first 30 chars as title
        timestamp: serverTimestamp(),
        lastMessage: message.content,
      });
      currentChatId = newChatRef.id;
      setActiveChatId(currentChatId);
    }
    
    if (currentChatId) {
      await addDoc(collection(db, "users", user.uid, "chats", currentChatId, "messages"), {
        ...message,
        timestamp: serverTimestamp(),
      });
       await setDoc(doc(db, "users", user.uid, "chats", currentChatId), { 
        lastMessage: message.content,
        timestamp: serverTimestamp(),
      }, { merge: true });
    }
    return currentChatId;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const props = {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
    handleExampleClick,
    messagesEndRef,
    exampleQueries,
    chatHistory,
    activeChatId,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    visualizations,
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-background gradient-background">
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="h-full flex flex-col">
          <TabsContent value="history" className="flex-1 overflow-y-auto bg-card/20"><ChatHistoryPanel {...props} /></TabsContent>
          <TabsContent value="chat" className="flex-1 overflow-y-auto bg-card/30"><ChatPanel {...props} /></TabsContent>
          <TabsContent value="viz" className="flex-1 overflow-y-auto"><VisualizationPanel {...props} /></TabsContent>
          <TabsList className="grid w-full grid-cols-3 rounded-none">
            <TabsTrigger value="history"><MessageSquare className="w-5 h-5" /></TabsTrigger>
            <TabsTrigger value="chat"><Send className="w-5 h-5" /></TabsTrigger>
            <TabsTrigger value="viz"><BarChart2 className="w-5 h-5" /></TabsTrigger>
          </TabsList>
        </Tabs>
        </div>
    );
  }

  return (
    <div className="h-screen bg-background flex gradient-background">
      <div className="w-[25%] max-w-xs border-r border-border flex flex-col bg-card/20"><ChatHistoryPanel {...props} /></div>
      <div className="w-[40%] border-r border-border flex flex-col bg-card/30"><ChatPanel {...props} /></div>
      <div className="flex-1"><VisualizationPanel {...props} /></div>
    </div>
  );
};

export default Dashboard;