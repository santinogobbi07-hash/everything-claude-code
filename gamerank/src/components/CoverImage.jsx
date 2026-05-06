import { useEffect, useState } from 'react';
import { GamepadIcon } from './Icons.jsx';

export default function CoverImage({ src, title, className = '', aspect = 'aspect-[3/4]' }) {
  const [errored, setErrored] = useState(false);

  // Reset error state whenever the source changes so a new image gets a fresh chance.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const showImage = Boolean(src) && !errored;

  return (
    <div
      className={`relative overflow-hidden bg-bg-elevated ${aspect} ${className}`}
      aria-label={title}
    >
      {showImage ? (
        <img
          src={src}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2 p-4 text-center">
          <GamepadIcon width={32} height={32} />
          <span className="text-xs font-medium line-clamp-2">{title || 'No cover'}</span>
          {src && errored && (
            <span className="text-[10px] text-red-400/80 line-clamp-2">
              Image couldn't be loaded
            </span>
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent pointer-events-none" />
    </div>
  );
}
