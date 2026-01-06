import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Send, User, Sparkles, Crown, Loader2, RotateCcw } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: `Hello! 👋 I'm your **AI Study Mentor**. I can help you with:

📚 **Study Planning** - Create personalized study schedules
❓ **Doubt Solving** - Explain concepts from your subjects
📝 **Exam Preparation** - Tips and strategies for better scores
🎯 **Quick Summaries** - Get key points of any topic

I'm trained on NCERT curriculum for Class ${profile?.school_class || "9-12"}. What would you like to learn today?`,
        timestamp: new Date(),
      }]);
    }
  }, [profile?.school_class, messages.length, setMessages]);

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
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: `Hello! 👋 I'm your **AI Study Mentor**. I can help you with:

📚 **Study Planning** - Create personalized study schedules
❓ **Doubt Solving** - Explain concepts from your subjects
📝 **Exam Preparation** - Tips and strategies for better scores
🎯 **Quick Summaries** - Get key points of any topic

I'm trained on NCERT curriculum for Class ${profile?.school_class || "9-12"}. What would you like to learn today?`,
      timestamp: new Date(),
    }]);
  };

  const renderMessage = (message: ChatMessage) => {
    const isAi = message.role === "assistant";
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
          <div className="flex items-center gap-2 mb-2">
            {isAi ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="text-xs font-medium">
              {isAi ? "AI Mentor" : "You"}
            </span>
          </div>
          <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
            {message.content}
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
            <p className="text-sm text-primary-foreground/80">Powered by AI - Ask me anything!</p>
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
            placeholder="Ask about any topic, concept, or get study help..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses are generated and may not always be accurate. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default AIMentor;
