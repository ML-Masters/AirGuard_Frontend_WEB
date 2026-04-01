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
        <main className="flex-1 p-4 pt-16 lg:pt-8 lg:ml-[280px] sm:p-6 lg:p-8 overflow-auto">{children}</main>
        <ChatWidget />
      </div>
    </AuthGuard>
  );
}
