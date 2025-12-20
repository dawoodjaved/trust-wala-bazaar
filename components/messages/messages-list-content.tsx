"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle as MessageSquare, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function MessagesListContent() {
  const conversations = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Is this product still available?",
      timestamp: new Date(),
      unread: 2,
      avatar: "",
    },
    {
      id: "2",
      name: "Tech Store",
      lastMessage: "Yes, we can negotiate the price",
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      avatar: "",
    },
  ];

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
            <p className="text-slate-300">Your conversations</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-12 h-12 rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_16px_45px_rgba(15,23,42,0.9)]"
          />
        </div>
      </motion.div>

      <div className="space-y-4">
        {conversations.map((conversation, idx) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <Link href={`/messages/${conversation.id}`}>
              <Card className="relative overflow-hidden cursor-pointer rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-100/10 via-slate-900 to-slate-950 shadow-[0_26px_70px_rgba(15,23,42,1)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/22 via-transparent to-black/60 opacity-80" />
                <CardContent className="relative p-5 md:p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14 ring-2 ring-amber-300/40">
                      <AvatarFallback className="bg-gradient-to-br from-amber-300 via-amber-400 to-indigo-400 text-slate-950 font-bold">
                        {conversation.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg truncate text-slate-50">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-slate-200 whitespace-nowrap ml-2">
                          {formatDate(conversation.timestamp.toISOString())}
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
    </div>
  );
}

