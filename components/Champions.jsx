import { formatDateTime } from '@/lib/format';
import { FighterLink } from './FighterLink';
import { Headshot, Panel, PanelSection } from './Panel';
import { Reveal } from './Reveal';

export function Champions({ champions, fetchedAt }) {
  const groups = [
    ['Men', champions.filter((c) => c.gender === 'men')],
    ['Women', champions.filter((c) => c.gender === 'women')],
  ];

  return (
    <Panel eyebrow="UFC" title="Current Champions">
      <p className="mt-1 text-center font-mono text-sm text-slate-400">As of {formatDateTime(fetchedAt)}</p>
      {groups.map(([title, list]) =>
        list.length ? (
          <PanelSection key={title} title={title}>
            {list.map((champion, i) => (
              <ChampionRow key={champion.division} champion={champion} index={i} />
            ))}
          </PanelSection>
        ) : null,
      )}
    </Panel>
  );
}

// Fixed columns (division | photo | name | record) keep every row aligned.
function ChampionRow({ champion, index }) {
  const division = (
    <>
      {champion.division?.replace(/^Women's /, '')}
      {champion.interim && <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 text-xs text-amber-300">Interim</span>}
    </>
  );

  return (
    <Reveal index={index}>
      <FighterLink
        slug={champion.slug}
        profileUrl={champion.profileUrl}
        className="group grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 py-2 sm:grid-cols-[11rem_3rem_minmax(0,1fr)_minmax(0,16rem)] sm:gap-4"
      >
        <div className="hidden sm:block">
          <p className="font-semibold text-slate-200">{division}</p>
          <p className="font-mono text-xs text-slate-400">{champion.weight}</p>
        </div>
        {/* Source is 520x325 landscape; 64px tall means ~102px wide. */}
        <Headshot src={champion.imageUrl} tint="gold" sizes="110px" />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 sm:hidden">{division}</p>
          <p className="font-semibold wrap-break-word group-hover:underline sm:text-lg">{champion.name}</p>
          {champion.nickname && <p className="text-sm italic text-slate-400">“{champion.nickname}”</p>}
          <p className="font-mono text-xs text-slate-400 sm:hidden">
            {[champion.record, champion.lastFight && `Last: ${champion.lastFight}`].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="hidden text-right font-mono text-sm sm:block">
          {champion.record && (
            <p>
              {champion.record} <span className="text-xs text-slate-500">W-L-D</span>
            </p>
          )}
          {champion.lastFight && <p className="text-xs text-slate-400">Last: {champion.lastFight}</p>}
        </div>
      </FighterLink>
    </Reveal>
  );
}
