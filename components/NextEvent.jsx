import { formatDateTime } from '@/lib/format';
import { Countdown } from './Countdown';
import { FighterLink } from './FighterLink';
import { Headshot, Panel, PanelSection } from './Panel';
import { Reveal } from './Reveal';

export function NextEvent({ event, results }) {
  const { startTimes } = event;
  const firstStart = startTimes.earlyPrelims ?? startTimes.prelims ?? startTimes.mainCard;
  const schedule = [
    ['Early Prelims', startTimes.earlyPrelims],
    ['Prelims', startTimes.prelims],
    ['Main Card', startTimes.mainCard],
  ].filter(([, time]) => time);

  const title = (
    <a href={event.url} target="_blank" rel="noopener" className="underline decoration-white/30 hover:decoration-white">
      {event.title && <span className="text-slate-300">{event.title}: </span>}
      {event.headline}
    </a>
  );

  return (
    <Panel eyebrow="Next Event" title={title}>
      <p className="mt-1 text-center text-slate-300">{[event.venue, event.location].filter(Boolean).join(' · ')}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-sm">
        {schedule.map(([label, time]) => (
          <span key={label}>
            <span className="text-slate-400">{label}:</span> {formatDateTime(time)}
          </span>
        ))}
        {firstStart && <Countdown startsAt={firstStart} />}
      </div>

      {event.sections.map((section) => (
        <PanelSection key={section.name} title={section.name}>
          {section.fights.map((fight, i) => (
            <FightRow key={`${fight.red.name}-${fight.blue.name}`} fight={fight} result={results[fight.id]} index={i} />
          ))}
        </PanelSection>
      ))}
    </Panel>
  );
}

// The middle column is a fixed width, so photos and names line up down the
// whole card no matter how long each weight class label is.
function FightRow({ fight, result, index }) {
  return (
    <Reveal
      index={index}
      className="grid grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] items-center gap-2 py-2 sm:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)] sm:gap-4"
    >
      <Corner fighter={fight.red} side="red" won={result?.winner === 'red'} />
      <div className="flex flex-col items-center text-center text-xs sm:text-sm">
        {fight.titleFight && <span className="rounded bg-amber-500/20 px-1.5 font-semibold text-amber-300">Title</span>}
        <span className="text-slate-300">{fight.weightClass?.replace(/\s*Title$/, '')}</span>
        {result ? (
          <span className="text-slate-400">{[result.method, result.round && `R${result.round}`, result.time].filter(Boolean).join(' · ')}</span>
        ) : (
          <span className="text-slate-500">vs</span>
        )}
      </div>
      <Corner fighter={fight.blue} side="blue" won={result?.winner === 'blue'} />
    </Reveal>
  );
}

function Corner({ fighter, side, won }) {
  const isRed = side === 'red';
  return (
    <FighterLink
      slug={fighter.slug}
      profileUrl={fighter.profileUrl}
      className={`group flex items-center gap-3 ${isRed ? 'flex-row-reverse text-right' : 'text-left'}`}
    >
      <Headshot src={fighter.imageUrl} tint={side} className="hidden sm:block" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold wrap-break-word group-hover:underline sm:text-base">
          {fighter.rank && <span className="mr-1 text-xs text-slate-400">{fighter.rank}</span>}
          {fighter.name}
          {won && <span className="mx-1 inline-block rounded bg-emerald-500/20 px-1.5 text-xs font-semibold text-emerald-300">WIN</span>}
        </p>
        <p className="font-mono text-xs text-slate-400">{[fighter.country, fighter.odds].filter(Boolean).join(' · ')}</p>
      </div>
    </FighterLink>
  );
}
