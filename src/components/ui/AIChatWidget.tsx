"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Namaste! I am your SamruddhiSetu AI Assistant. How can I help you with your loan scheme or application today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an error connecting to the server." }]);
      }
    } catch {
      setMessages(prev => [...prev, { sender: "ai", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-full p-4 shadow-xl flex items-center gap-2"
        >
          <MessageSquare size={20} /> Ask AI Assistant
        </Button>
      ) : (
        <div className="bg-white border rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col h-[450px] overflow-hidden">
          <div className="bg-[#1e3a8a] text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-sm">SamruddhiSetu AI Help Desk</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${m.sender === 'user' ? 'bg-[#1e3a8a] text-white' : 'bg-white border text-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400 italic">AI is thinking...</div>}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text"
              placeholder="Ask about schemes, interest, eligibility..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a8a]"
            />
            <Button type="submit" className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-4">
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}