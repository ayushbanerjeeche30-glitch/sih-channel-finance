"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function PageAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const currentHistory = [...history];
    
    setHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    // Silent superpower: It still reads the page to provide better context, 
    // but acts as a general assistant first.
    const rawContent = document.body.innerText || "";
    const pageContent = rawContent.replace(/\s+/g, ' ').substring(0, 4000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: currentHistory,
          pagePath: pathname,
          pageContent: pageContent 
        }),
      });
      const data = await res.json();
      
      setHistory((prev) => [
        ...prev,
        { sender: "ai", text: data.success ? data.reply : "Something went wrong." },
      ]);
    } catch {
      setHistory((prev) => [...prev, { sender: "ai", text: "Connection failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="bg-white border rounded-2xl shadow-xl w-80 h-[28rem] flex flex-col overflow-hidden">
          <div className="bg-[#1e3a8a] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold text-sm">SamruddhiSetu AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors"><X size={18} /></button>
          </div>
          
          <div ref={chatRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-sm">
            <div className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl rounded-tl-sm w-11/12 shadow-sm leading-relaxed">
              Namaste! I am the official SamruddhiSetu Assistant. I can answer any questions about NSFDC schemes, loans, and eligibility. 
              <br/><br/>
              <span className="text-xs text-slate-500 italic">Tip: I can also read the page you are on, so feel free to ask for help navigating this screen!</span>
            </div>
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap shadow-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#1e3a8a] text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-400 p-3 rounded-xl rounded-tl-sm text-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t p-3 bg-white flex gap-2 items-center">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a8a] focus:bg-white transition-all"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()} 
              className="bg-[#1e3a8a] text-white p-2.5 rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#1e3a8a] text-white p-4 rounded-full shadow-xl hover:bg-blue-800 hover:scale-105 transition-all flex items-center gap-2"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}