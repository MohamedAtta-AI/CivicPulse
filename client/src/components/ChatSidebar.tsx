import { useState, useLayoutEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatSidebar = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: language === "nl" 
        ? "Hallo! Ik ben je AI-assistent. Stel me vragen over de data op het dashboard."
        : "Hello! I'm your AI assistant. Ask me questions about the dashboard data."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          // Find the Radix ScrollArea viewport element
          // The viewport is typically the first child div
          let viewport = scrollAreaRef.current.firstElementChild as HTMLElement;
          
          // If that doesn't work, try finding by data attribute
          if (!viewport || viewport.scrollHeight === 0) {
            viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
          }
          
          // Try finding any scrollable div
          if (!viewport || viewport.scrollHeight === 0) {
            const allDivs = scrollAreaRef.current.querySelectorAll('div');
            for (const div of Array.from(allDivs)) {
              if (div.scrollHeight > div.clientHeight) {
                viewport = div as HTMLElement;
                break;
              }
            }
          }
          
          if (viewport && viewport.scrollHeight > 0) {
            // Scroll to bottom
            viewport.scrollTop = viewport.scrollHeight;
          } else if (messagesEndRef.current) {
            // Final fallback: scroll the last message into view
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }
      }, 100);
    });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.sendMessage(currentInput);
      const aiMessage: Message = {
        role: "assistant",
        content: response.response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: language === "nl"
          ? `Fout bij het ophalen van antwoord: ${error instanceof Error ? error.message : "Onbekende fout"}`
          : `Error fetching response: ${error instanceof Error ? error.message : "Unknown error"}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full max-h-full flex-col overflow-hidden">
      <div className="border-b border-border bg-muted/50 p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            {language === "nl" ? "AI Assistent" : "AI Assistant"}
          </h3>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground">
                  <p className="text-sm italic">
                    {language === "nl" ? "Denken..." : "Thinking..."}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder={language === "nl" ? "Stel een vraag..." : "Ask a question..."}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
