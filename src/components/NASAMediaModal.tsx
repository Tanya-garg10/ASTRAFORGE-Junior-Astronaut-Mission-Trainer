import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, X } from 'lucide-react';
import { NASAAssetDetail, NASAMediaItem } from '../shared/types.ts';

interface NASAMediaModalProps {
  item: NASAMediaItem | null;
  onClose: () => void;
}

export const NASAMediaModal: React.FC<NASAMediaModalProps> = ({ item, onClose }) => {
  const [detail, setDetail] = useState<NASAAssetDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/nasa/asset/${encodeURIComponent(item.nasaId)}`)
      .then((res) => res.json())
      .then((data: NASAAssetDetail) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) {
          setDetail({
            nasaId: item.nasaId,
            mediaType: item.mediaType,
            title: item.title,
            description: item.description,
            playableVideoUrl: null,
            highResImageUrl: item.thumbnailUrl,
            captionsUrl: null,
            nasaPageUrl: item.nasaPageUrl,
            credit: item.credit,
            restrictionsNote: item.restrictionsNote,
            manifestCount: 0,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nasa-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-4 z-10">
          <div>
            <p className="text-[11px] font-mono text-sky-700 font-semibold">
              {item.sourceLabel} · {item.nasaId}
            </p>
            <h3 id="nasa-modal-title" className="text-base font-bold text-slate-900">
              {detail?.title || item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media details"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {loading ? (
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-slate-300 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              <span className="text-sm">Inspecting NASA asset manifest and metadata...</span>
            </div>
          ) : item.mediaType === 'video' ? (
            detail?.playableVideoUrl ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  src={detail.playableVideoUrl}
                  controls
                  playsInline
                  poster={item.thumbnailUrl}
                  className="w-full h-full object-contain"
                >
                  {detail.captionsUrl && (
                    <track kind="captions" src={detail.captionsUrl} label="English captions" default />
                  )}
                </video>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl p-6 text-center space-y-3">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="max-h-60 mx-auto rounded-lg object-cover"
                />
                <p className="text-sm text-slate-200">
                  No direct browser-playable MP4 stream was found in this NASA asset manifest.
                </p>
                <a
                  href={detail?.nasaPageUrl || item.nasaPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
                >
                  Watch on NASA Image & Video Library
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )
          ) : (
            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center max-h-[440px]">
              <img
                src={detail?.highResImageUrl || item.thumbnailUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = item.fallbackImageUrl;
                }}
                className="max-h-[440px] w-full object-contain"
              />
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">{detail?.description || item.description}</p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
              <p>
                <strong className="text-slate-900">Credit / Center:</strong> {detail?.credit || item.credit}
              </p>
              {item.dateCreated && (
                <p>
                  <strong className="text-slate-900">Date Recorded:</strong> {item.dateCreated}
                </p>
              )}
              <p>
                <strong className="text-slate-900">Usage Note:</strong>{' '}
                {detail?.restrictionsNote || item.restrictionsNote}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <a
              href={detail?.nasaPageUrl || item.nasaPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Open Original NASA Asset Page
              <ExternalLink className="w-4 h-4" />
            </a>
            {detail?.captionsUrl && (
              <a
                href={detail.captionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-600 hover:text-slate-900 underline"
              >
                Download Official Captions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
