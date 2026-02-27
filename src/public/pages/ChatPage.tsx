import { useState } from "react";
import { Send, Phone, Video, Search } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: "user" | "provider";
  text: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  { id: 1, sender: "provider", text: "Hello! How can I help you today?", time: "09:12" },
  { id: 2, sender: "user", text: "I need to book a consultation.", time: "09:13" },
  { id: 3, sender: "provider", text: "Sure. Do you prefer online or in-person?", time: "09:14" },
];

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">BesaPlus Chat</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">Mercy Health Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col">
        <div className="mb-4 flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
            placeholder="Search messages"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-[10px] mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-slate-400"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm px-2 outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
            placeholder="Type your message..."
          />
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
