"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle as MessageSquare, Search, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getApiBase } from "@/lib/api-base";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
};

export function MessagesListContent() {
  const apiUrl = getApiBase();
  const [filter, setFilter] = useState("");

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async (): Promise<Conversation[]> => {
      const res = await fetch(`${apiUrl}/api/products?limit=40`);
      if (!res.ok) throw new Error("Failed to load conversations");
      const products = await res.json();
      if (!Array.isArray(products)) return [];

      const seen = new Set<string>();
      const list: Conversation[] = [];
      for (const p of products) {
        const s = p.seller;
        if (!s?.id || seen.has(s.id)) continue;
        seen.add(s.id);
        const name = [s.firstName, s.lastName].filter(Boolean).join(" ") || "Seller";
        list.push({
          id: s.id,
          name,
          lastMessage: `About: ${p.title}`,
          timestamp: p.updatedAt || new Date().toISOString(),
          unread: list.length === 0 ? 1 : 0,
          avatar: s.avatar || "",
        });
        if (list.length >= 8) break;
      }
      return list;
    },
    staleTime: 30000,
    retry: 1,
  });

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, filter]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-indigo-400 flex items-center justify-center shadow-[0_14px_40px_rgba(250,204,21,0.7)]">
            <MessageSquare className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-slate-300">Your conversations with sellers</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search conversations..."
            className="pl-12 h-12 rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_16px_45px_rgba(15,23,42,0.9)]"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8d96f]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-slate-300">
          No conversations yet. Open a product and message a seller.
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((conversation, idx) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
            >
              <Link href={`/messages/${conversation.id}`}>
                <Card className="relative overflow-hidden cursor-pointer rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-100/10 via-slate-900 to-slate-950 shadow-[0_26px_70px_rgba(15,23,42,1)]">
                  <CardContent className="relative p-5 md:p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-14 w-14 ring-2 ring-amber-300/40">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-300 via-amber-400 to-indigo-400 text-slate-950 font-bold">
                          {conversation.name?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg truncate text-slate-50">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-slate-200 whitespace-nowrap ml-2">
                            {formatDate(conversation.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-200/90 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge className="rounded-full min-w-[24px] h-6 flex items-center justify-center">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
