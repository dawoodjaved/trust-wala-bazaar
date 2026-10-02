"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getApiBase } from "@/lib/api-base";

export function AIChatBubble({ productId, productName }: { productId?: string; productName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Add loading message
    const loadingMessageId = Date.now();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Thinking..." },
    ]);

    try {
      const apiUrl = getApiBase();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: userMessage,
          context: {
            productId,
            productName,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => {
          const filtered = prev.filter((_, idx) => idx !== prev.length - 1); // Remove loading message
          return [
            ...filtered,
            {
              role: "assistant",
              content: data.response || "I apologize, I couldn't generate a response. Please ensure your AI API keys are configured.",
            },
          ];
        });
      } else if (response.status === 429) {
        const errorData = await response.json().catch(() => ({ message: 'Too many requests' }));
        const retry = errorData.retryAfterSec ? ` Try again in ${errorData.retryAfterSec}s.` : '';
        setMessages((prev) => {
          const filtered = prev.filter((_, idx) => idx !== prev.length - 1);
          return [
            ...filtered,
            {
              role: "assistant",
              content: `${errorData.message || 'Too many AI requests.'}${retry}`,
            },
          ];
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(errorData.message || 'API request failed');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setMessages((prev) => {
          const filtered = prev.filter((_, idx) => idx !== prev.length - 1);
          return [
            ...filtered,
            {
              role: "assistant",
              content: "Request timed out. The AI service may be slow or unavailable. Please try again.",
            },
          ];
        });
      } else {
        console.warn('AI chat error (handled gracefully):', error);
        setMessages((prev) => {
          const filtered = prev.filter((_, idx) => idx !== prev.length - 1);
          return [
            ...filtered,
            {
              role: "assistant",
              content: "I'm having trouble connecting to the AI service. This feature requires OpenAI or Groq API keys to be configured. You can still browse products and contact sellers directly.",
            },
          ];
        });
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 lg:bottom-4 h-14 w-14 rounded-full shadow-lg z-40"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 lg:bottom-4 w-80 h-96 flex flex-col shadow-2xl z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Ask me anything</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <p className="font-semibold mb-2">How can I help you?</p>
                <p className="text-xs">
                  Ask about product details, pricing, seller info, or comparisons.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              AI-powered • Supports Urdu & English
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

