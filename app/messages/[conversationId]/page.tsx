import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ChatContent } from "@/components/chat/chat-content";
import { Toaster } from "@/components/ui/toaster";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <>
      <Header />
      <div className="flex pt-16 md:pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4 min-w-0">
          <ChatContent conversationId={conversationId} />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
