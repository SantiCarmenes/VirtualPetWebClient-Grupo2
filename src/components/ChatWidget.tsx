"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react";
import { sendChatMessage } from "@/lib/services/chatbot.service";
import type { ChatMessage } from "@/lib/services/chatbot.service";
import { useAuth } from "@/context/AuthContext";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy Firulais, el asistente virtual de VirtualPet 🐾\n" +
    "Puedo ayudarte con consultas generales sobre envíos, horarios y facturación, " +
    "o con información sobre tus pedidos.\n" +
    "¿En qué te puedo ayudar hoy?",
};

const STORAGE_KEY   = (userId: string) => `firulais_chat_${userId}`;
const STORAGE_MAX   = 50;
const STORAGE_TTL   = 24 * 60 * 60 * 1000; // 24 h

interface StoredChat { messages: ChatMessage[]; savedAt: number }

function loadChat(userId: string): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId));
    if (!raw) return null;
    const { messages, savedAt } = JSON.parse(raw) as StoredChat;
    if (Date.now() - savedAt > STORAGE_TTL) {
      localStorage.removeItem(STORAGE_KEY(userId));
      return null;
    }
    return messages;
  } catch { return null; }
}

function saveChat(userId: string, messages: ChatMessage[]) {
  try {
    const payload: StoredChat = { messages: messages.slice(-STORAGE_MAX), savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(payload));
  } catch {}
}

export function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted history after mount (safe for SSR)
  useEffect(() => {
    if (!user) return;
    const saved = loadChat(user.id);
    if (saved) setMessages(saved);
  }, [user?.id]);

  // Persist history on every update (capped + timestamped)
  useEffect(() => {
    if (!user) return;
    saveChat(user.id, messages);
  }, [messages, user?.id]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(nextMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un problema al conectar con el asistente. Intentá de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Cerrar chat" : "Abrir chat de soporte"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[min(520px,calc(100vh-7rem))] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
            <span className="text-2xl leading-none shrink-0" role="img" aria-label="Firulais">🐶</span>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Firulais</p>
              <p className="text-xs opacity-75">Soporte con IA</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    msg.role === "assistant"
                      ? "bg-primary/10"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <span className="text-base leading-none" role="img" aria-label="Firulais">🐶</span>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                    msg.role === "assistant"
                      ? "bg-muted text-foreground rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-start">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-primary/10">
                  <span className="text-base leading-none" role="img" aria-label="Firulais">🐶</span>
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu consulta..."
              disabled={loading}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Enviar mensaje"
              className="shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
