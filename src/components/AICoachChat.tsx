import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw, Flame, Dumbbell } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface AICoachChatProps {
  userContext: any;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({ userContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: `Hey! I'm znjy track AI, your personal biomechanics and sports nutrition coach. 🏋️‍♂️🥗\n\nI'm monitoring your logged workout sets, training volume, active calorie burn, and dietary macros in real time. Ask me to adjust your training volume, review joint mechanics, or optimize your post-workout meal timing!`,
      timestamp: '9:41 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    sounds.playTap();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userContext,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'Great question! Stay consistent with your progressive overload protocol.';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Coach chat failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do I stop my knees from caving during squats?',
    'What should I eat right now to hit my protein goal?',
    'Can you substitute an exercise for sore shoulders?',
    'Explain my form score and progressive overload from today',
  ];

  return (
    <div className="flex flex-col h-full bg-[#07080c] text-white pb-28 pt-2">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight capitalize">znjy track AI Coach</h1>
            <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in Biomechanics & Sports Nutrition</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-emerald-500 text-black font-medium'
                    : 'bg-neutral-900/90 text-neutral-200 border border-white/10'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-black/60 font-semibold' : 'text-neutral-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-neutral-400 text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>AI Coach is analyzing workout & nutrition telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-5 py-2 overflow-x-auto scrollbar-none flex space-x-2 border-t border-white/5 bg-neutral-950/60">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium bg-neutral-900 border border-white/10 hover:border-emerald-500/40 text-neutral-300 hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-all active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="px-5 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 bg-neutral-900/90 border border-white/10 rounded-2xl p-1.5 pl-3 focus-within:border-emerald-500/60"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workout form, split, or macros..."
            className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black flex items-center justify-center shrink-0 transition-all active:scale-90"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
