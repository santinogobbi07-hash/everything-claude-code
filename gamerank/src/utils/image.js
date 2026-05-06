// Image helpers: read a File, downscale on a canvas, return a JPEG data URL.
// Keeps storage small enough for localStorage and cheap enough for jsonb.

const DEFAULT_MAX = 800;
const DEFAULT_QUALITY = 0.82;

export async function fileToDataUrl(file, max = DEFAULT_MAX, quality = DEFAULT_QUALITY) {
  if (!file) throw new Error('No file');
  if (!file.type.startsWith('image/')) {
    throw new Error('Not an image file');
  }
  const raw = await readAsDataUrl(file);
  return await resizeDataUrl(raw, max, quality);
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsDataURL(file);
  });
}

function resizeDataUrl(dataUrl, max, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Image could not be decoded'));
    img.src = dataUrl;
  });
}

export function approxBytes(dataUrl) {
  if (!dataUrl) return 0;
  // Strip header, then base64 -> ~3/4 bytes.
  const i = dataUrl.indexOf(',');
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  return Math.round((b64.length * 3) / 4);
}

export function fmtBytes(n) {
  if (!n) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
