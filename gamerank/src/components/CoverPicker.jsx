import { useEffect, useRef, useState } from 'react';
import { approxBytes, fileToDataUrl, fmtBytes } from '../utils/image.js';
import CoverImage from './CoverImage.jsx';

const TABS = [
  { key: 'upload', label: 'Upload' },
  { key: 'url', label: 'Paste URL' }
];

export default function CoverPicker({ value, onChange, title }) {
  const initialTab = value && value.startsWith('data:') ? 'upload' : 'url';
  const [tab, setTab] = useState(initialTab);
  const [urlField, setUrlField] = useState(value && !value.startsWith('data:') ? value : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Keep the URL field in sync if the parent clears the value.
  useEffect(() => {
    if (!value) setUrlField('');
  }, [value]);

  const handleFile = async (file) => {
    setError('');
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Could not load image');
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlBlur = () => {
    const next = urlField.trim();
    if (next !== value) onChange(next);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    handleUrlBlur();
  };

  const handleClear = () => {
    onChange('');
    setUrlField('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isData = value && value.startsWith('data:');
  const size = isData ? fmtBytes(approxBytes(value)) : null;

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-bg-surface border border-edge rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              tab === t.key ? 'bg-accent text-bg' : 'text-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-edge bg-bg-surface hover:border-accent/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {busy ? (
            <p className="text-sm text-muted">Processing image…</p>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-200">
                Click to choose or drag an image here
              </p>
              <p className="text-[11px] text-muted mt-1">
                PNG, JPG, WEBP — auto-resized to ~800px
              </p>
            </>
          )}
        </div>
      )}

      {tab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            className="input flex-1"
            type="url"
            placeholder="https://...image.jpg"
            value={urlField}
            onChange={(e) => setUrlField(e.target.value)}
            onBlur={handleUrlBlur}
          />
          <button type="submit" className="btn-ghost text-sm">
            Use
          </button>
        </form>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {value && (
        <div className="flex gap-3 items-center">
          <div className="w-20 shrink-0 rounded-md overflow-hidden border border-edge">
            <CoverImage src={value} title={title || 'Preview'} />
          </div>
          <div className="flex-1 min-w-0 text-xs text-muted">
            {isData ? (
              <>
                Embedded image{size && <> · {size}</>}
                <br />
                <span className="text-[11px]">
                  Stored with the game — works offline.
                </span>
              </>
            ) : (
              <span className="break-all line-clamp-2">{value}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted hover:text-red-400"
          >
            Remove
          </button>
        </div>
      )}

      {tab === 'url' && !value && (
        <p className="text-[11px] text-muted">
          Tip: paste a direct image link (ending in .jpg / .png), not a Google search page.
        </p>
      )}
    </div>
  );
}
