import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Sparkles,
  Flame,
  Award,
  Dumbbell,
  CheckCircle2,
  Smile,
  Paperclip,
  TrendingUp,
  RefreshCw,
  Hash,
  ChevronDown,
  Activity,
  Bot
} from 'lucide-react';
import { AuthUser, ChatMessage } from '../types/auth';
import { CompletedSet } from '../types/fitness';
import { sounds } from '../utils/audioEffects';
import { useTranslation } from '../utils/i18n';

interface ChannelDef {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const CHANNELS: ChannelDef[] = [
  {
    id: 'general-lifting',
    name: 'general-gym',
    icon: '🏋️‍♂️',
    description: 'Daily gym banter, motivation & check-ins',
  },
  {
    id: 'form-check',
    name: 'form-check',
    icon: '🦾',
    description: 'Technique, posture & lifting mechanics',
  },
  {
    id: 'nutrition-recipes',
    name: 'nutrition-macros',
    icon: '🥗',
    description: 'High-protein recipes, meal prep & timing',
  },
  {
    id: 'pr-club',
    name: 'pr-showcase',
    icon: '🏆',
    description: 'Personal records, max reps & milestones',
  },
];

interface OnlineAthlete {
  id: string;
  name: string;
  avatar: string;
  currentActivity: string;
  badge: string;
}

const MOCK_ONLINE_ATHLETES: OnlineAthlete[] = [
  {
    id: 'marcus',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    currentActivity: 'Squats 140kg • Set 4 (Form 96%)',
    badge: 'Elite Athlete',
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    currentActivity: 'Resting 45s • Push-ups next',
    badge: 'Powerlifter',
  },
  {
    id: 'sarah',
    name: 'Coach Sarah',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    currentActivity: 'Analyzing post-workout carbs',
    badge: 'Dietitian',
  },
  {
    id: 'leo',
    name: 'Leo Zhang',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    currentActivity: 'Bicep Curls 20kg • Optical Track',
    badge: 'Kinetic Pro',
  },
];

interface CommunityChatViewProps {
  currentUser: AuthUser;
  latestCompletedSet?: {
    exerciseName: string;
    set: CompletedSet;
  } | null;
  onOpenAuthModal: () => void;
}

export const CommunityChatView: React.FC<CommunityChatViewProps> = ({
  currentUser,
  latestCompletedSet,
  onOpenAuthModal,
}) => {
  const { t } = useTranslation();
  const [activeChannel, setActiveChannel] = useState<string>('general-lifting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [attachSet, setAttachSet] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for active channel
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages?channel=${activeChannel}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle reaction tap
  const handleToggleReaction = (msgId: string, emoji: string) => {
    sounds.playTap();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const exists = m.reactions.find((r) => r.emoji === emoji);
        let updatedReactions;
        if (exists) {
          updatedReactions = m.reactions.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
              : r
          );
        } else {
          updatedReactions = [...m.reactions, { emoji, count: 1, userReacted: true }];
        }
        return { ...m, reactions: updatedReactions.filter((r) => r.count > 0) };
      })
    );
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachSet) return;

    if (!currentUser.isLoggedIn) {
      onOpenAuthModal();
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);
    sounds.playTap();

    let setAttachment = undefined;
    if (attachSet && latestCompletedSet) {
      setAttachment = {
        exerciseName: latestCompletedSet.exerciseName,
        reps: latestCompletedSet.set.reps,
        romPercent: latestCompletedSet.set.averageRom,
        formScore: latestCompletedSet.set.formScore,
      };
      setAttachSet(false);
    }

    const payload = {
      channel: activeChannel,
      message: {
        channelId: activeChannel,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarUrl,
        userBadge: currentUser.currentBadge,
        text: textToSend,
        workoutSetAttachment: setAttachment,
        reactions: [{ emoji: '🔥', count: 1 }],
      },
    };

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: `opt_${Date.now()}`,
      channelId: activeChannel,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userBadge: currentUser.currentBadge,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      workoutSetAttachment: setAttachment,
      reactions: [{ emoji: '🔥', count: 1 }],
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.message) {
        // Replace optimistic message with server message
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? data.message : m))
        );
      }
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }

    // AI Mention Trigger: If user tagged @coach or @znjy, generate automated AI coach feedback in the channel
    if (textToSend.toLowerCase().includes('@coach') || textToSend.toLowerCase().includes('@znjy')) {
      setTimeout(async () => {
        try {
          const aiRes = await fetch('/api/coach/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `[Community Channel Mention by ${currentUser.name}]: ${textToSend}`,
              userContext: {
                activeChannel,
                attachedSet: setAttachment,
              },
            }),
          });
          const aiData = await aiRes.json();
          if (aiData.reply) {
            const botMessage: ChatMessage = {
              id: `bot_${Date.now()}`,
              channelId: activeChannel,
              userId: 'bot_znjy',
              userName: 'znjy track AI Coach',
              userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
              userBadge: 'Official AI',
              text: aiData.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reactions: [{ emoji: '🤖', count: 3 }, { emoji: '💡', count: 4 }],
            };

            await fetch('/api/chat/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                channel: activeChannel,
                message: botMessage,
              }),
            });
            sounds.playSuccessFanfare();
            fetchMessages();
          }
        } catch {
          // ignore
        }
      }, 1200);
    }
  };

  const currentChannelObj =
    CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];

  return (
    <div className="h-full flex flex-col bg-[#07080c] text-white">
      {/* Top App Bar with Channel Switcher & Online Lifters Count */}
      <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#0c0d14]/90 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Channel Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playTap();
                setShowChannelDropdown(!showChannelDropdown);
              }}
              className="flex items-center space-x-2 bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 px-3 py-1.5 rounded-2xl text-left transition-all active:scale-95 shadow-sm"
            >
              <span className="text-base">{currentChannelObj.icon}</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>#{currentChannelObj.name}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </div>
                <div className="text-[9px] text-neutral-400 truncate max-w-[150px]">
                  {currentChannelObj.description}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showChannelDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#12141e] border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <span className="text-[9px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider block">
                  {t('chat.channels', 'Channels')}
                </span>
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      sounds.playTap();
                      setActiveChannel(ch.id);
                      setShowChannelDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                      activeChannel === ch.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <span className="text-base">{ch.icon}</span>
                    <div className="flex-1 truncate">
                      <div className="text-xs truncate">#{ch.name}</div>
                      <div className="text-[9px] text-neutral-400 truncate">{ch.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Status / Login Prompt */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sounds.playTap();
                onOpenAuthModal();
              }}
              className="flex items-center space-x-1.5 bg-neutral-900 border border-white/10 hover:border-emerald-500/40 px-2.5 py-1 rounded-full text-xs transition-all active:scale-95"
              title="View account profile or sign in"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-white/10"
              />
              <span className="text-[11px] font-medium text-neutral-300 truncate max-w-[70px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Online Lifters Strip */}
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center space-x-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>4 LIFTERS IN GYM</span>
          </div>

          {MOCK_ONLINE_ATHLETES.map((ath) => (
            <div
              key={ath.id}
              className="flex items-center space-x-1.5 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-white/5 flex-shrink-0 text-[10px] text-neutral-300"
              title={ath.currentActivity}
            >
              <img src={ath.avatar} alt={ath.name} className="w-3.5 h-3.5 rounded-full object-cover" />
              <span className="font-semibold text-white truncate max-w-[65px]">{ath.name.split(' ')[0]}</span>
              <span className="text-neutral-500 text-[9px]">•</span>
              <span className="text-[9px] text-emerald-400/90 truncate max-w-[90px]">{ath.currentActivity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Welcome Banner in Channel */}
        <div className="bg-gradient-to-r from-neutral-900 to-[#141620] border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-xl mb-1">{currentChannelObj.icon}</div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Welcome to #{currentChannelObj.name}
          </h4>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            {currentChannelObj.description}. Tip: mention <span className="text-emerald-400 font-mono font-bold">@coach</span> to get instant AI biofeedback!
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 text-xs">
            {t('chat.noMessages', 'No messages yet in this channel. Break the ice!')}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUser.id;
            const isBot = msg.userId === 'bot_znjy';

            return (
              <div
                key={msg.id}
                className={`flex space-x-2.5 transition-all animate-in fade-in ${
                  isMe ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-0.5">
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className={`w-8 h-8 rounded-xl object-cover border ${
                      isBot
                        ? 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                        : isMe
                        ? 'border-emerald-500/40'
                        : 'border-white/10'
                    }`}
                  />
                </div>

                {/* Message Body */}
                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Meta */}
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px]">
                    <span className="font-bold text-white">{msg.userName}</span>
                    {msg.userBadge && (
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.2 rounded border ${
                          isBot
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                            : 'bg-neutral-800 text-neutral-300 border-white/10'
                        }`}
                      >
                        {msg.userBadge}
                      </span>
                    )}
                    <span className="text-[9px] text-neutral-500">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                      isBot
                        ? 'bg-[#101918] border border-emerald-500/30 text-emerald-100'
                        : isMe
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-neutral-900 border border-white/10 text-neutral-200 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                    {/* Workout Set Attachment */}
                    {msg.workoutSetAttachment && (
                      <div className="mt-2.5 bg-black/40 border border-white/15 rounded-xl p-2.5 text-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs flex items-center space-x-1 text-emerald-300">
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>{msg.workoutSetAttachment.exerciseName}</span>
                          </span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                            FORM VERIFIED
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center mt-1.5">
                          <div className="bg-neutral-900/80 p-1 rounded-lg">
                            <div className="text-[8px] text-neutral-400 uppercase">Reps</div>
                            <div className="text-xs font-bold text-white">
                              {msg.workoutSetAttachment.reps}
                            </div>
                          </div>
                          <div className="bg-neutral-900/80 p-1 rounded-lg">
                            <div className="text-[8px] text-neutral-400 uppercase">ROM Depth</div>
                            <div className="text-xs font-bold text-emerald-400">
                              {msg.workoutSetAttachment.romPercent}%
                            </div>
                          </div>
                          <div className="bg-neutral-900/80 p-1 rounded-lg">
                            <div className="text-[8px] text-neutral-400 uppercase">Form Score</div>
                            <div className="text-xs font-bold text-cyan-400">
                              {msg.workoutSetAttachment.formScore}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reaction Buttons */}
                  <div className="flex items-center space-x-1 mt-1 flex-wrap gap-y-1">
                    {msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => handleToggleReaction(msg.id, r.emoji)}
                        className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] transition-all active:scale-90 border ${
                          r.userReacted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-900/70 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[9px] font-mono">{r.count}</span>
                      </button>
                    ))}

                    {/* Quick Add Reaction Button */}
                    <button
                      onClick={() => handleToggleReaction(msg.id, '💪')}
                      className="text-neutral-500 hover:text-white px-1 text-[10px] transition-all"
                      title="Cheer"
                    >
                      +💪
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Box if active */}
      {attachSet && latestCompletedSet && (
        <div className="px-4 py-1.5 bg-neutral-900/95 border-t border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">🦾</span>
            <div>
              <span className="font-bold text-white text-[11px]">
                Attaching: {latestCompletedSet.exerciseName}
              </span>
              <span className="text-[10px] text-emerald-400 ml-2">
                {latestCompletedSet.set.reps} Reps • {latestCompletedSet.set.formScore}% Form
              </span>
            </div>
          </div>
          <button
            onClick={() => setAttachSet(false)}
            className="text-neutral-400 hover:text-white text-[10px] px-2 py-0.5 rounded bg-neutral-800"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Bar & Controls */}
      <div className="p-3 bg-[#0d0e14] border-t border-white/10 flex-shrink-0 space-y-2">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[10px]">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setInputText('@coach how can I optimize my squat depth?');
            }}
            className="bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center space-x-1 active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>@coach Ask Squat Depth</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setInputText('Just smashed my workout! How is everyone feeling? 💪');
            }}
            className="bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 px-2.5 py-1 rounded-full whitespace-nowrap active:scale-95"
          >
            🔥 Post Workout Hype
          </button>

          {latestCompletedSet && !attachSet && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setAttachSet(true);
              }}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center space-x-1 active:scale-95"
            >
              <Paperclip className="w-3 h-3 text-emerald-400" />
              <span>Attach Set ({latestCompletedSet.exerciseName})</span>
            </button>
          )}
        </div>

        {/* Text Input Row */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chat.typePlaceholder', 'Message the lifters (type @coach to ask AI)...')}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all pr-8"
            />
          </div>

          <button
            type="submit"
            disabled={(!inputText.trim() && !attachSet) || isSending}
            className={`p-2.5 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center ${
              inputText.trim() || attachSet
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
