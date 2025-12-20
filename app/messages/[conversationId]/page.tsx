import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ChatContent } from "@/components/chat/chat-content";
import { Toaster } from "@/components/ui/toaster";

export default function ChatPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <ChatContent conversationId={params.conversationId} />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

