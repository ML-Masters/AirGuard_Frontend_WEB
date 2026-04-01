import Sidebar from "@/components/layout/Sidebar";
import ChatWidget from "@/components/chat/ChatWidget";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <>{children}</>;
}
