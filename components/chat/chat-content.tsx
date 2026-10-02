"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-hook";
import {
  Send,
  Mic,
  Image as ImageIcon,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input as PriceInput } from "@/components/ui/input";
import { getApiBase } from "@/lib/api-base";

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "OFFER";
  offerPrice?: number;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

interface ChatContentProps {
  conversationId: string;
}

export function ChatContent({ conversationId }: ChatContentProps) {
  // Get user from auth hook
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<any>(null);

  // HTTP polling by default (Nest Socket.io deprecated on pure Next.js)
  useEffect(() => {
    let socketInstance: any = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const pollMessages = async () => {
      try {
        const apiUrl = getApiBase();
        const response = await fetch(`${apiUrl}/api/messages/conversation/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          }
        }
      } catch {
        // keep existing messages on poll failure
      }
    };

    const initializeChat = async () => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
      if (socketUrl) {
        try {
          const io = (await import("socket.io-client")).default;
          socketInstance = io(socketUrl, { transports: ["websocket", "polling"] });
          socketInstance.on("connect", () => {
            socketInstance.emit("join-room", { conversationId });
          });
          socketInstance.on("message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
          });
          setSocket(socketInstance);
          return;
        } catch {
          console.warn("Socket.io failed, using polling");
        }
      }

      await pollMessages();
      pollInterval = setInterval(pollMessages, 3000);
    };

    initializeChat();

    return () => {
      if (socketInstance) socketInstance.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const content = input.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      content,
      type: "TEXT",
      createdAt: new Date().toISOString(),
      sender: {
        id: user?.id || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        avatar: user?.imageUrl || "",
      },
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Send via Socket.io or API
    if (socket) {
      socket.emit('send-message', {
        conversationId,
        type: 'TEXT',
        content,
        senderId: user?.id,
      });
    } else {
      // Fallback to API call
      const apiUrl = getApiBase();
      fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          conversationId,
          content,
          type: 'TEXT',
        }),
      }).catch(() => {
        // Silently fail - message already added to UI
      });
    }
  };

  const handleOffer = () => {
    if (!offerPrice) return;

    const offerMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      content: `I'm offering PKR ${parseInt(offerPrice).toLocaleString()}`,
      type: "OFFER",
      offerPrice: parseInt(offerPrice),
      createdAt: new Date().toISOString(),
      sender: {
        id: user?.id || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        avatar: user?.imageUrl || "",
      },
    };

    setMessages([...messages, offerMessage]);
    setShowOfferDialog(false);
    setOfferPrice("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start space-x-2 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {!isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"} />
                      <AvatarFallback>
                        {message.sender.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {message.type === "OFFER" && message.offerPrice && (
                      <div className="mb-2 p-2 bg-background/20 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">Offer</span>
                          <Badge className="bg-accent text-white">PKR {message.offerPrice.toLocaleString()}</Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            Decline
                          </Button>
                        </div>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="accent" size="icon" onClick={() => setShowOfferDialog(true)}>
              <DollarSign className="h-5 w-5" />
            </Button>
            <Button onClick={handleSend} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            AI can help translate, suggest offers, detect fraud
          </p>
        </div>
      </Card>

      {/* Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
            <DialogDescription>
              Enter your offer price for this product
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Offer Price (PKR)</label>
              <PriceInput
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="350000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOffer}>Send Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

