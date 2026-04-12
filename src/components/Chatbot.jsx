"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `You are AURA AI, a helpful and sophisticated personal shopping assistant for AURA, a premium lingerie and nightwear brand in Bangladesh. 

Your personality:
- Elegant, polite, and professional.
- Knowledgeable about lingerie styles (Bras, Panties, Nightwear, Sets).
- Helpful with sizing advice and styling tips.
- Conversational and engaging.

Your goals:
- Help customers find the perfect fit and style.
- Answer questions about AURA's collections.
- Provide information about shipping (৳120 flat rate, free over ৳5000).
- Explain the return policy (7-day easy returns).
- Be discreet and respectful given the nature of the products.

If asked about specific products, mention that we have a wide range of Bras, Panties, and Nightwear in various colors like Rose Gold, Black, and Emerald.

Keep your responses concise and helpful. Use emojis occasionally to maintain a friendly tone. 🌸`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
  { role: 'model', text: 'Hello! I am AURA AI, your personal shopping assistant. How can I help you find the perfect style today? 🌸' }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        },
        history: messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;

      if (text) {
        setMessages((prev) => [...prev, { role: 'model', text }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: "I'm sorry, I'm having a bit of trouble connecting right now. Please try again in a moment! 🙏" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-rose text-white shadow-2xl shadow-brand-rose/40 transition-all hover:scale-110 active:scale-95">
        
        <MessageSquare className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold">1</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-28 right-8 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-100">
          
            {/* Header */}
            <div className="bg-brand-rose p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold">AURA AI</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Shopping Assistant</p>
                  </div>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 hover:bg-white/10 transition-all">
                
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((m, i) =>
            <div
              key={i}
              className={cn(
                "flex items-start gap-3",
                m.role === 'user' ? "flex-row-reverse" : ""
              )}>
              
                  <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white",
                m.role === 'user' ? "bg-slate-900" : "bg-brand-rose"
              )}>
                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                "max-w-[80%] rounded-2xl p-4 text-sm shadow-sm",
                m.role === 'user' ?
                "bg-slate-900 text-white rounded-tr-none" :
                "bg-white text-slate-900 rounded-tl-none border border-slate-100"
              )}>
                    {m.text}
                  </div>
                </div>
            )}
              {isLoading &&
            <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-rose text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white text-slate-900 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-rose" />
                  </div>
                </div>
            }
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 pr-12 text-sm font-medium outline-none transition-all focus:border-brand-rose" />
              
                <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-rose p-2 text-white transition-all hover:bg-rose-500 disabled:opacity-50">
                
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Powered by Gemini AI
              </p>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}