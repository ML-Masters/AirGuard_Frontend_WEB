"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: t("greeting") },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await api.chat(msg);
      setMessages((prev) => [...prev, { role: "bot", text: res.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t("errorMessage") }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-[70dvh] sm:h-[500px] bg-surface sm:rounded-2xl border border-border shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary rounded-t-2xl">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">AirGuard Bot</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-gray-100 text-text rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:bg-primary-dark transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
