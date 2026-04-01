import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/layout/AuthGuard";
import ChatWidget from "@/components/chat/ChatWidget";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-full">
        <Sidebar />
        <main className="ml-[280px] flex-1 p-8 overflow-auto">{children}</main>
        <ChatWidget />
      </div>
    </AuthGuard>
  );
}
