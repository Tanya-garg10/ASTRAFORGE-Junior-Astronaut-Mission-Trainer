import React, { useState } from 'react';
import { ExternalLink, Film, PlayCircle } from 'lucide-react';
import { NASAMediaItem } from '../shared/types.ts';

interface NASAVideoCardProps {
  item: NASAMediaItem;
  onInspect: (item: NASAMediaItem) => void;
}

export const NASAVideoCard: React.FC<NASAVideoCardProps> = ({ item, onInspect }) => {
  const [imgSrc, setImgSrc] = useState(item.thumbnailUrl);
  const [failed, setFailed] = useState(false);

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
      <div>
        <button
          type="button"
          onClick={() => onInspect(item)}
          className="w-full aspect-[4/3] bg-slate-900 relative overflow-hidden block group cursor-pointer"
        >
          {!failed ? (
            <img
              src={imgSrc}
              alt={item.title}
              referrerPolicy="no-referrer"
              onError={() => {
                if (imgSrc !== item.fallbackImageUrl) {
                  setImgSrc(item.fallbackImageUrl);
                } else {
                  setFailed(true);
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-300">
              <Film className="w-8 h-8 mb-2 text-sky-400" />
              <span className="text-xs">{item.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/95 drop-shadow" />
          </div>
        </button>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="font-semibold text-sky-700">{item.sourceLabel} · VIDEO</span>
            <span className="truncate">{item.nasaId}</span>
          </div>

          <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.title}</h4>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onInspect(item)}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
        >
          Check Manifest & Play
        </button>
        <a
          href={item.nasaPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          Watch on NASA
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
