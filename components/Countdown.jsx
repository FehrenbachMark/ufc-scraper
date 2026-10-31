'use client';

import { useEffect, useState } from 'react';

const LIVE_WINDOW_MS = 6 * 60 * 60 * 1000;

function describe(start, now) {
  const ms = start - now;
  if (ms <= 0) return ms > -LIVE_WINDOW_MS ? 'Live now' : null;
  const minutes = Math.ceil(ms / 60_000);
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  return `Starts in ${[d && `${d}d`, (d || h) && `${h}h`, !d && `${m}m`].filter(Boolean).join(' ')}`;
}

/** Live countdown to `startsAt`. Renders nothing on the server to avoid a hydration mismatch. */
export function Countdown({ startsAt }) {
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const start = Date.parse(startsAt);
    const tick = () => setLabel(describe(start, Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [startsAt]);

  if (!label) return null;
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${label === 'Live now' ? 'bg-red-600' : 'bg-white/10'}`}>
      {label}
    </span>
  );
}
