'use client';

import { useGameStore } from '@/lib/store';
import type { DuelResult, SpellType } from '@/lib/types';

// ─── Spell labels ─────────────────────────────────────────────────────────────

const SPELL_LABELS: Record<SpellType, string> = {
  fireball: "Winkle's Wobbling Fireball",
  shield:   "Grumbolt's Slightly Reliable Shield",
  illusion: "Pffft's Convincing Illusion",
};

// ─── DuelResultBadge ──────────────────────────────────────────────────────────

function DuelResultBadge({ result }: { result: DuelResult }) {
  const styles = {
    win:  { border: 'border-[#c9a227]', text: 'text-[#c9a227]', label: 'Victory' },
    lose: { border: 'border-[#8b6cb8]', text: 'text-[#8b6cb8]', label: 'Defeat'  },
    draw: { border: 'border-[#9090a0]', text: 'text-[#9090a0]', label: 'Draw'    },
  };
  const s = styles[result.outcome];

  return (
    <div className={`rounded-lg border-2 ${s.border} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <span className={`font-[family-name:var(--font-cinzel)] text-lg ${s.text}`}>{s.label}</span>
        <span className="text-xs text-[#6b6b80]">
          Power {result.playerPower} vs {result.rivalPower}
        </span>
      </div>
      <p className="mb-3 text-xs text-[#6b6b80]">
        You cast: <span className="text-[#d4c4a8]">{SPELL_LABELS[result.playerSpell]}</span>
        {' — '}
        Rival cast: <span className="text-[#d4c4a8]">{SPELL_LABELS[result.rivalSpell]}</span>
      </p>
      <p className="text-sm italic leading-relaxed text-[#9090a0]">{result.narrative}</p>
    </div>
  );
}

// ─── DaySummary ───────────────────────────────────────────────────────────────

interface DaySummaryProps {
  onBeginNextDay: () => void;
  pending: boolean;
}

export default function DaySummary({ onBeginNextDay, pending }: DaySummaryProps) {
  const daySummary = useGameStore((s) => s.daySummary);

  if (!daySummary) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-[#6b6b80]">
        End of Day {daySummary.day}
      </p>
      <h2 className="mb-2 text-center font-[family-name:var(--font-cinzel)] text-3xl tracking-wider text-[#d4c4a8]">
        Day&apos;s End
      </h2>
      <div className="mb-8 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />

      {/* Activity + Event recap */}
      <div className="mb-5 rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-5 shadow-xl">
        <h3 className="mb-3 font-[family-name:var(--font-cinzel)] text-base text-[#d4c4a8]">
          What Happened
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6b6b80]">Morning activity</span>
            <span className="text-[#d4c4a8]">{daySummary.activityName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6b6b80]">Event</span>
            <span className="text-[#d4c4a8]">{daySummary.eventTitle}</span>
          </div>
          {daySummary.eventChoiceLabel && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b6b80]">You chose</span>
              <span className="text-[#d4c4a8]">{daySummary.eventChoiceLabel}</span>
            </div>
          )}
        </div>
        {daySummary.eventOutcomeNarrative && (
          <div className="mt-3 border-t border-[#2d2d44] pt-3">
            <p className="text-sm italic leading-relaxed text-[#6b6b80]">
              {daySummary.eventOutcomeNarrative}
            </p>
          </div>
        )}
      </div>

      {/* Duel result */}
      <div className="mb-8">
        <DuelResultBadge result={daySummary.duelResult} />
      </div>

      {/* Begin next day */}
      <button
        onClick={onBeginNextDay}
        disabled={pending}
        className="w-full rounded border-2 border-[#6b4c9a] bg-gradient-to-b from-[#6b4c9a] to-[#4a3570] px-8 py-4 font-[family-name:var(--font-cinzel)] text-lg text-[#eaeaea] shadow-lg transition-all hover:from-[#7a5ca8] hover:to-[#5a4580] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Loading…' : `Begin Day ${daySummary.day + 1}`}
      </button>
    </div>
  );
}
