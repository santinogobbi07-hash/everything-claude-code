export const CATEGORIES = [
  { key: 'gameplay', label: 'Gameplay' },
  { key: 'story', label: 'Story' },
  { key: 'graphics', label: 'Graphics' },
  { key: 'vibe', label: 'Vibe' }
];

// Weights for the weighted average. Equal weighting by default; tweak here if desired.
export const CATEGORY_WEIGHTS = {
  gameplay: 1,
  story: 1,
  graphics: 1,
  vibe: 1
};

export function computePlayerScore(review) {
  if (!review || !isReviewComplete(review)) return null;
  let total = 0;
  let weightSum = 0;
  for (const { key } of CATEGORIES) {
    const w = CATEGORY_WEIGHTS[key] ?? 1;
    total += Number(review[key]) * w;
    weightSum += w;
  }
  return total / weightSum;
}

export function isReviewComplete(review) {
  if (!review) return false;
  return CATEGORIES.every(({ key }) => {
    const v = Number(review[key]);
    return Number.isFinite(v) && v >= 1 && v <= 10;
  });
}

export function computeCombinedScore(game) {
  const p1 = computePlayerScore(game?.reviews?.p1);
  const p2 = computePlayerScore(game?.reviews?.p2);
  if (p1 == null || p2 == null) return null;
  return (p1 + p2) / 2;
}

export function fmtScore(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return Number(n).toFixed(1);
}

export function gameStatus(game, players) {
  const c1 = isReviewComplete(game?.reviews?.p1);
  const c2 = isReviewComplete(game?.reviews?.p2);
  if (c1 && c2) return { label: 'Both Reviewed', tone: 'good' };
  if (!c1 && !c2) return { label: 'Not Started', tone: 'neutral' };
  return {
    label: `Waiting for ${c1 ? players.p2 : players.p1}`,
    tone: 'pending'
  };
}

export function emptyReview() {
  return { gameplay: 0, story: 0, graphics: 0, vibe: 0, note: '' };
}
