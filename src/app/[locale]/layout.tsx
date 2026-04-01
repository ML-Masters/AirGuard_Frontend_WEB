import Sidebar from "@/components/layout/Sidebar";
import ChatWidget from "@/components/chat/ChatWidget";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="ml-[280px] flex-1 p-8 overflow-auto">{children}</main>
      <ChatWidget />
    </div>
  );
}
