import React, { useState } from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { NASAMediaItem } from '../shared/types.ts';

interface NASAImageCardProps {
  item: NASAMediaItem;
  onInspect: (item: NASAMediaItem) => void;
}

export const NASAImageCard: React.FC<NASAImageCardProps> = ({ item, onInspect }) => {
  const [imgSrc, setImgSrc] = useState(item.thumbnailUrl);
  const [failed, setFailed] = useState(false);

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
      <div>
        <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
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
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300">
              <ImageIcon className="w-8 h-8 mb-2 text-sky-400" />
              <span className="text-xs font-medium">{item.title}</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="font-semibold text-sky-700">{item.sourceLabel}</span>
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
          Inspect Asset
        </button>
        <a
          href={item.nasaPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          Open Original
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
