import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Send, User, Crown, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";

interface AIMentorProps {
  profile: any;
}

const AIMentor = ({ profile }: AIMentorProps) => {
  const { messages, isLoading, sendMessage, clearMessages, setMessages } = useAIChat({
    onError: (error) => toast.error(error),
  });
  const [input, setInput] = useState("");
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch weak topics from performance data
  useEffect(() => {
    const fetchWeakTopics = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Fetch performance logs
        const { data: logs } = await supabase
          .from("performance_logs")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("performance_level", "weak")
          .order("created_at", { ascending: false })
          .limit(10);

        if (logs && logs.length > 0) {
          const topics = [...new Set(logs.map(log => log.topic_name))];
          setWeakTopics(topics.filter(Boolean) as string[]);
        }
      } catch (error) {
        console.error("Error fetching weak topics:", error);
      }
    };

    fetchWeakTopics();
  }, [profile]);

  // Set welcome message on mount with performance context
  useEffect(() => {
    if (messages.length === 0) {
      let welcomeMessage = `Hello! I'm your **AI Study Mentor**. I can help you with:

    1. **Study Planning** - Create personalized study schedules
    2. **Doubt Solving** - Explain concepts from your subjects
    3. **Exam Preparation** - Tips and strategies for better scores
    4. **Quick Summaries** - Get key points of any topic

I'm trained on NCERT curriculum for Class ${profile?.school_class || "9-12"}.`;

      // Add performance-aware guidance
      if (weakTopics.length > 0) {
        welcomeMessage += `\n\n**Based on your recent performance, I noticed you're struggling with:**\n`;
        weakTopics.slice(0, 3).forEach(topic => {
          welcomeMessage += `• ${topic}\n`;
        });
        welcomeMessage += `\nLet me help you master these topics!`;
      } else {
        welcomeMessage += `\n\nWhat would you like to learn today?`;
      }

      setMessages([{
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [profile?.school_class, weakTopics, messages.length, setMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput("");

    // Store user message in DB
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("chat_messages").insert({
        user_id: session.user.id,
        message: userInput,
        is_ai: false,
      });
    }

    await sendMessage(userInput);
  };

  const handleNewChat = () => {
    clearMessages();
    
    let welcomeMessage = `Hello! I'm your **AI Study Mentor**. I can help you with:

  1. **Study Planning** - Create personalized study schedules
  2. **Doubt Solving** - Explain concepts from your subjects
  3. **Exam Preparation** - Tips and strategies for better scores
  4. **Quick Summaries** - Get key points of any topic

I'm trained on NCERT curriculum for Class ${profile?.school_class || "9-12"}.`;

    // Add performance-aware guidance
    if (weakTopics.length > 0) {
      welcomeMessage += `\n\n**Based on your recent performance, I noticed you're struggling with:**\n`;
      weakTopics.slice(0, 3).forEach(topic => {
        welcomeMessage += `• ${topic}\n`;
      });
      welcomeMessage += `\nLet me help you master these topics!`;
    } else {
      welcomeMessage += `\n\nWhat would you like to learn today?`;
    }
    
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    }]);
  };

  const renderMessage = (message: ChatMessage) => {
    const isAi = message.role === "assistant";
    const content = message.content;

    const renderMarkdown = (text: string) => {
      const lines = text.split('\n');
      const elements: JSX.Element[] = [];
      let bulletListActive = false;
      let numberListActive = false;

      lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Skip empty lines (they create spacing)
        if (!trimmed) {
          if (bulletListActive || numberListActive) {
            bulletListActive = false;
            numberListActive = false;
          }
          return;
        }

        // Headers with bold text or numbered labels
        if (trimmed.match(/^(\d+\.|[A-Za-z].*\*\*)/)) {
          bulletListActive = false;
          numberListActive = false;
          
          const headerMatch = trimmed.match(/^(\d+\.)\s+\*\*(.*?)\*\*(.*)$/);
          if (headerMatch) {
            elements.push(
              <div key={index} className="mt-4 mb-2 font-semibold text-base">
                <span>{headerMatch[1]} </span>
                <span className="text-primary">{headerMatch[2]}</span>
                <span>{headerMatch[3]}</span>
              </div>
            );
          } else {
            elements.push(
              <p key={index} className="mt-3 mb-2 font-semibold text-base">{trimmed}</p>
            );
          }
          return;
        }

        // Bold sections: **Section Name:**
        if (trimmed.startsWith('**') && trimmed.includes(':**')) {
          bulletListActive = false;
          numberListActive = false;
          const match = trimmed.match(/\*\*(.*?)\*\*(.*)$/);
          if (match) {
            elements.push(
              <p key={index} className="mt-3 mb-1 font-semibold text-sm">
                <span className="text-primary">{match[1]}</span>
                <span>{match[2]}</span>
              </p>
            );
          }
          return;
        }

        // Numbered list items: 1. [text]
        if (trimmed.match(/^\d+\./)) {
          bulletListActive = false;
          if (!numberListActive) {
            numberListActive = true;
          }
          const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
          if (match) {
            elements.push(
              <li key={index} className="ml-4 mb-1 text-sm list-decimal">
                {match[2]}
              </li>
            );
          }
          return;
        }

        // Bullet points: - [text] or • [text]
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          numberListActive = false;
          if (!bulletListActive) {
            bulletListActive = true;
          }
          elements.push(
            <li key={index} className="ml-4 mb-1 text-sm list-disc">
              {trimmed.substring(2)}
            </li>
          );
          return;
        }

        // Regular paragraph with formatting
        bulletListActive = false;
        numberListActive = false;
        
        // Parse inline formatting: **bold**, _italic_, `code`
        const renderInline = (text: string) => {
          const parts: JSX.Element[] = [];
          let lastIndex = 0;
          
          // Match **bold**, _italic_, `code`
          const regex = /\*\*(.*?)\*\*|_(.*?)_|`(.*?)`/g;
          let match;
          
          while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
              parts.push(
                <span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
              );
            }
            
            if (match[1]) {
              parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
            } else if (match[2]) {
              parts.push(<em key={`italic-${match.index}`}>{match[2]}</em>);
            } else if (match[3]) {
              parts.push(
                <code key={`code-${match.index}`} className="bg-background px-1 rounded text-xs">
                  {match[3]}
                </code>
              );
            }
            
            lastIndex = regex.lastIndex;
          }
          
          if (lastIndex < text.length) {
            parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
          }
          
          return parts.length > 0 ? parts : text;
        };

        elements.push(
          <p key={index} className="mb-2 text-sm leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      });

      return elements;
    };

    return (
      <motion.div
        key={message.id}
        className={`flex ${isAi ? "justify-start" : "justify-end"}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className={`max-w-[85%] p-4 rounded-2xl ${
            isAi
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {isAi ? (
              <Brain className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="text-xs font-medium">
              {isAi ? "AI Mentor" : "You"}
            </span>
          </div>
          <div className="text-sm leading-relaxed space-y-1">
            {renderMarkdown(content)}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-[600px] flex flex-col rounded-2xl bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-foreground/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Study Mentor</h3>
            <p className="text-sm text-primary-foreground/80">Answer academic questions instantly</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleNewChat} className="text-primary-foreground hover:bg-primary-foreground/20">
              <RotateCcw className="w-4 h-4 mr-1" />
              New Chat
            </Button>
            {profile?.subscription_status !== "premium" && (
              <Button variant="hero-outline" size="sm">
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-secondary text-secondary-foreground p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Physics, Chemistry, Math, Biology, or any study topic..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          For study-related questions only. Refer to NCERT textbooks for final answers.
        </p>
      </div>
    </div>
  );
};

export default AIMentor;
