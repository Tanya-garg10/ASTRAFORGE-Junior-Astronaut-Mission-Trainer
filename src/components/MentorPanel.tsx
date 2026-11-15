import React, { useState } from 'react';
import { BookOpen, Compass, HelpCircle, Loader2, Send } from 'lucide-react';
import { MissionState } from '../shared/types.ts';

interface MentorPanelProps {
  mission: MissionState;
}

interface MentorMessage {
  id: string;
  role: 'user' | 'mentor';
  text: string;
  source?: string;
}

export const MentorPanel: React.FC<MentorPanelProps> = ({ mission }) => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'welcome',
      role: 'mentor',
      text: `Mission Mentor online for ${mission.config.destination === 'moon' ? 'Lunar' : 'Martian'} Outpost (Day ${mission.currentDay}). Ask why a resource is shifting, or choose a guided analysis prompt below.`,
      source: 'telemetry-brief',
    },
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const askMentor = async (
    actionType: 'explain_decision' | 'hint' | 'explain_science' | 'compare_strategies' | 'question',
    label: string,
    customQuestion?: string
  ) => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: customQuestion || label },
    ]);

    try {
      const res = await fetch('/api/mentor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          actionType,
          question: customQuestion || '',
          missionState: mission,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'mentor',
          text: data.answer || 'Unable to generate explanation right now.',
          source: data.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'mentor',
          text: 'Network error reaching Mission Mentor endpoint. Inspect the Resource Cards above for live deterministic cause breakdowns.',
          source: 'offline-notice',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setQuestion('');
    askMentor('question', trimmed, trimmed);
  };

  const quickActions = [
    { id: 'hint' as const, label: 'Give Me a Hint', icon: Compass },
    { id: 'explain_decision' as const, label: 'Explain My Decision', icon: HelpCircle },
    { id: 'explain_science' as const, label: 'Explain the Science', icon: BookOpen },
    { id: 'compare_strategies' as const, label: 'Compare Two Strategies', icon: Compass },
  ];

  return (
    <aside className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">AI Mission Mentor</h3>
          <p className="text-xs text-slate-400">
            Explains telemetry, NASA science, and engineering trade-offs without altering your simulation state.
          </p>
        </div>
      </div>

      {/* Quick Educational Actions */}
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              disabled={loading}
              onClick={() => askMentor(act.id, act.label)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conversation Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 max-h-80 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-xs leading-relaxed rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-sky-950/70 border border-sky-800/60 text-sky-100 ml-6'
                : 'bg-slate-900 border border-slate-800 text-slate-200 mr-2'
            }`}
          >
            <p className="whitespace-pre-line">{msg.text}</p>
            {msg.source && (
              <p className="mt-1.5 text-[10px] font-mono text-slate-500">
                Source: {msg.source === 'gemini-4-hydrogen' ? 'Gemini AI · Grounded in telemetry' : 'Rule-based science guide'}
              </p>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 px-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Analyzing outpost telemetry...</span>
          </div>
        )}
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask why O₂ dropped or how solar storms work..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Send question to Mission Mentor"
          className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
