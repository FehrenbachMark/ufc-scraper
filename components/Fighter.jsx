import Image from 'next/image';
import { eventLabel, formatHeight } from '@/lib/format';
import { FighterLink } from './FighterLink';
import { Headshot, Panel, PanelSection } from './Panel';
import { Reveal } from './Reveal';

export function Fighter({ fighter }) {
  const { bio } = fighter;
  const facts = [
    ['Age', bio.Age],
    ['Height', formatHeight(bio.Height)],
    ['Reach', bio.Reach && `${Math.round(Number(bio.Reach))}"`],
    ['Weight', bio.Weight && `${Number(bio.Weight)} lb`],
    ['Born', bio['Place of Birth']?.replace(/\s+,/g, ',')],
    ['Trains at', bio['Trains at']],
    ['Style', bio['Fighting style']],
    ['UFC debut', bio['Octagon Debut']],
  ].filter(([, value]) => value);
  const tags = fighter.tags.filter((tag) => tag !== fighter.division);

  return (
    <Panel eyebrow={fighter.division ?? 'Fighter'} title={fighter.name}>
      <div className="mt-1 flex flex-col items-center gap-3 text-center">
        {fighter.nickname && <p className="italic text-slate-300">“{fighter.nickname}”</p>}
        {fighter.record && (
          <p className="font-mono">
            {fighter.record} <span className="text-xs text-slate-500">W-L-D</span>
          </p>
        )}
        {tags.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2 text-xs">
            {tags.map((tag) => (
              <li key={tag} className={`rounded-full px-2.5 py-0.5 ${/title holder/i.test(tag) ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-slate-300'}`}>
                {tag}
              </li>
            ))}
          </ul>
        )}
        <a
          href={fighter.profileUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold hover:bg-red-500"
        >
          View on UFC.com
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 3h7v7M13 3 4 12" />
          </svg>
        </a>
      </div>

      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
        {fighter.imageUrl && (
          <Image src={fighter.imageUrl} alt={fighter.name} width={460} height={700} sizes="192px" priority className="mx-auto w-40 sm:w-48" />
        )}
        <div className="flex flex-col gap-6">
          {fighter.stats.length > 0 && (
            <dl className="grid grid-cols-3 gap-2 text-center">
              {fighter.stats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/5 p-3">
                  <dd className="text-2xl font-bold">{stat.value}</dd>
                  <dt className="text-xs text-slate-400">{stat.label}</dt>
                </div>
              ))}
            </dl>
          )}
          {facts.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm min-[420px]:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-white/10 pb-1">
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {fighter.fights.length > 0 && (
        <PanelSection title={`Last ${fighter.fights.length} Fights`}>
          {fighter.fights.map((fight, i) => (
            <FightHistoryRow key={`${fight.date}-${fight.opponent?.slug}`} fight={fight} index={i} />
          ))}
        </PanelSection>
      )}
    </Panel>
  );
}

const resultStyles = {
  win: ['W', 'bg-green-600'],
  loss: ['L', 'bg-red-700'],
  draw: ['D', 'bg-slate-500'],
  nc: ['NC', 'bg-slate-600'],
};

function FightHistoryRow({ fight, index }) {
  const [letter, color] = resultStyles[fight.result] ?? ['–', 'bg-slate-700'];
  const opponent = fight.opponent;
  const details = [fight.method, fight.round && `R${fight.round}`, fight.time].filter(Boolean).join(' · ');

  return (
    <Reveal
      index={index}
      className="grid grid-cols-[2.25rem_3rem_minmax(0,1fr)] items-center gap-3 py-2 sm:grid-cols-[2.25rem_3rem_minmax(0,1fr)_minmax(0,16rem)] sm:gap-4"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${color}`} title={fight.result ?? 'Unknown'}>
        {letter}
      </span>
      {/* Headshots are 256x160 landscape. */}
      <Headshot src={opponent?.imageUrl} tint="blue" sizes="110px" />
      <div className="min-w-0">
        <p className="font-semibold wrap-break-word">
          <span className="text-sm font-normal text-slate-400">vs </span>
          {opponent?.slug ? (
            <FighterLink slug={opponent.slug} className="hover:underline">
              {opponent.name}
            </FighterLink>
          ) : (
            opponent?.name ?? 'Unknown'
          )}
        </p>
        <p className="font-mono text-xs text-slate-400">
          {fight.date}
          {fight.eventUrl && (
            <>
              {' · '}
              <a href={fight.eventUrl} target="_blank" rel="noopener" className="hover:text-white hover:underline">
                {eventLabel(fight.eventUrl)}
              </a>
            </>
          )}
        </p>
        <p className="font-mono text-xs text-slate-300 sm:hidden">{details}</p>
      </div>
      <p className="hidden text-right font-mono text-sm text-slate-300 sm:block">{details}</p>
    </Reveal>
  );
}
