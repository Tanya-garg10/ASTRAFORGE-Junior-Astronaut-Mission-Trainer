import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, Film, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import { NASAImageCard } from '../components/NASAImageCard.tsx';
import { NASAMediaModal } from '../components/NASAMediaModal.tsx';
import { NASAVideoCard } from '../components/NASAVideoCard.tsx';
import { CURATED_NASA_FALLBACK_MEDIA, LEARNING_TOPICS } from '../shared/nasaData.ts';
import { LearningTopic, NASAMediaItem } from '../shared/types.ts';

const PRESET_COLLECTIONS = [
  { label: 'Moon Surface', query: 'Moon surface' },
  { label: 'Mars Rovers', query: 'Mars Perseverance rover' },
  { label: 'Astronaut Life', query: 'Astronaut spacewalk International Space Station' },
  { label: 'Space Weather', query: 'Solar storm flare SDO' },
  { label: 'Space Habitats', query: 'Space habitat module' },
];

export const SpaceSciencePage: React.FC = () => {
  const [sectionTab, setSectionTab] = useState<'learning' | 'nasa-gallery'>('learning');
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic>(LEARNING_TOPICS[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [completedTopics, setCompletedTopics] = useState<Record<string, number>>({});

  // NASA Media Gallery State
  const [query, setQuery] = useState('Moon surface');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaItems, setMediaItems] = useState<NASAMediaItem[]>(
    CURATED_NASA_FALLBACK_MEDIA.filter((m) => m.mediaType === 'image')
  );
  const [mediaSourceNote, setMediaSourceNote] = useState<string | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [inspectedItem, setInspectedItem] = useState<NASAMediaItem | null>(null);

  useEffect(() => {
    fetch('/api/learning/resources?sessionId=default-cadet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.progress)) {
          const map: Record<string, number> = {};
          data.progress.forEach((row: { topic_id: string; quiz_score: number }) => {
            map[row.topic_id] = row.quiz_score;
          });
          setCompletedTopics(map);
        }
      })
      .catch(() => {});
  }, []);

  const searchNasa = async (searchQuery: string, type: 'image' | 'video') => {
    setLoadingMedia(true);
    setMediaSourceNote(null);
    try {
      const res = await fetch(
        `/api/nasa/search?q=${encodeURIComponent(searchQuery)}&media_type=${type}`
      );
      const data = await res.json();
      if (Array.isArray(data?.items) && data.items.length > 0) {
        setMediaItems(data.items);
        if (data.notice) setMediaSourceNote(data.notice);
      } else {
        setMediaItems(CURATED_NASA_FALLBACK_MEDIA.filter((m) => m.mediaType === type));
        setMediaSourceNote('Showing verified NASA reference items.');
      }
    } catch {
      setMediaItems(CURATED_NASA_FALLBACK_MEDIA.filter((m) => m.mediaType === type));
      setMediaSourceNote('Unable to reach NASA API proxy; displaying verified NASA fallback records.');
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (sectionTab === 'nasa-gallery') {
      searchNasa(query, mediaType);
    }
  }, [sectionTab, mediaType]);

  const handleSelectQuizAnswer = (topicId: string, questionId: string, optionIdx: number) => {
    const key = `${topicId}:${questionId}`;
    const nextAnswers = { ...quizAnswers, [key]: optionIdx };
    setQuizAnswers(nextAnswers);

    // Check if all quiz questions for this topic have been answered
    const topic = LEARNING_TOPICS.find((t) => t.id === topicId);
    if (!topic) return;
    const allAnswered = topic.quiz.every((q) => nextAnswers[`${topicId}:${q.id}`] !== undefined);
    if (allAnswered) {
      const score = topic.quiz.reduce((acc, q) => {
        return acc + (nextAnswers[`${topicId}:${q.id}`] === q.correctIndex ? 1 : 0);
      }, 0);
      setCompletedTopics((prev) => ({ ...prev, [topicId]: score }));
      fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'default-cadet',
          topicId,
          completed: true,
          quizScore: score,
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
            Space Science & NASA Exploration
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Learning Library & NASA Media Explorer
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Study the real science behind space habitats, test your knowledge with module quizzes, and search the
            official NASA Image and Video Library.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            type="button"
            onClick={() => setSectionTab('learning')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              sectionTab === 'learning' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-700" />
            Learning Modules ({Object.keys(completedTopics).length}/{LEARNING_TOPICS.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionTab('nasa-gallery')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              sectionTab === 'nasa-gallery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-700" />
            NASA Media Library
          </button>
        </div>
      </div>

      {sectionTab === 'learning' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Module Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            {LEARNING_TOPICS.map((topic, index) => {
              const isSelected = selectedTopic.id === topic.id;
              const done = completedTopics[topic.id] !== undefined;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div>
                    <p className={`text-[11px] font-mono ${isSelected ? 'text-sky-300' : 'text-slate-500'}`}>
                      0{index + 1}. {topic.category}
                    </p>
                    <p className="text-sm font-semibold mt-0.5">{topic.title}</p>
                  </div>
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Active Topic Content & Quiz */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="h-60 bg-slate-900 relative">
              <img
                src={selectedTopic.imageUrl}
                alt={selectedTopic.imageCaption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5">
                <p className="text-xs font-mono text-sky-300">{selectedTopic.category}</p>
                <h2 className="font-display text-2xl font-bold text-white">{selectedTopic.title}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{selectedTopic.explanation}</p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Key Scientific Facts</p>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-700">
                  {selectedTopic.keyFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-1">
                <p className="text-xs font-semibold text-sky-900">How This Connects to ASTRAFORGE</p>
                <p className="text-xs text-sky-800 leading-relaxed">{selectedTopic.simulationConnection}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 pt-4">
                <a
                  href={selectedTopic.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-sky-700 hover:underline"
                >
                  Source: {selectedTopic.sourceTitle}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(selectedTopic.nasaQuery);
                    setSectionTab('nasa-gallery');
                    searchNasa(selectedTopic.nasaQuery, 'image');
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-sky-700 underline cursor-pointer"
                >
                  Search Related NASA Media →
                </button>
              </div>

              {/* Knowledge-Check Quiz */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900">Module Knowledge Check</h3>
                {selectedTopic.quiz.map((q, qIdx) => {
                  const chosen = quizAnswers[`${selectedTopic.id}:${q.id}`];
                  const hasAnswered = chosen !== undefined;
                  return (
                    <div key={q.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isChosen = chosen === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                          if (hasAnswered) {
                            if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                            else if (isChosen) style = 'border-rose-400 bg-rose-50 text-rose-900';
                          }
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuizAnswer(selectedTopic.id, q.id, optIdx)}
                              className={`w-full text-left px-3.5 py-2.5 text-xs rounded-lg border transition-colors cursor-pointer ${style}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {hasAnswered && (
                        <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* NASA Image & Video Library Gallery */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchNasa(query, mediaType);
                }}
                className="flex-1 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search NASA Image & Video Library (e.g., Perseverance, Apollo 11, Solar storm)..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingMedia}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-sky-700 text-white cursor-pointer"
                >
                  Search NASA
                </button>
              </form>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                    mediaType === 'image' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                    mediaType === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  Videos
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500">Collections:</span>
              {PRESET_COLLECTIONS.map((preset) => (
                <button
                  key={preset.query}
                  type="button"
                  onClick={() => {
                    setQuery(preset.query);
                    searchNasa(preset.query, mediaType);
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-md border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {mediaSourceNote && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {mediaSourceNote}
              </p>
            )}
          </div>

          {loadingMedia ? (
            <div className="py-16 flex items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              <span className="text-sm">Querying NASA Image and Video Library API...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mediaItems.map((item) =>
                item.mediaType === 'video' ? (
                  <NASAVideoCard key={item.nasaId} item={item} onInspect={setInspectedItem} />
                ) : (
                  <NASAImageCard key={item.nasaId} item={item} onInspect={setInspectedItem} />
                )
              )}
            </div>
          )}
        </div>
      )}

      <NASAMediaModal item={inspectedItem} onClose={() => setInspectedItem(null)} />
    </div>
  );
};
