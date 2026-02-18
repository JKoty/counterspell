'use client';

import { useGameStore } from '@/lib/store';
import { ACTIVITIES } from '@/lib/game-data';
import type { ActivityDefinition, ActivityId } from '@/lib/types';

const RISK_COLORS = {
  low:    'text-[#9090a0]',
  medium: 'text-[#c9a227]',
  high:   'text-[#8b6cb8]',
} as const;

// ─── ActivityCard ─────────────────────────────────────────────────────────────

interface ActivityCardProps {
  activity: ActivityDefinition;
  onChoose: (id: ActivityId) => void;
  disabled: boolean;
}

function ActivityCard({ activity, onChoose, disabled }: ActivityCardProps) {
  return (
    <button
      onClick={() => onChoose(activity.id)}
      disabled={disabled}
      className="group relative flex flex-col gap-3 rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-6 text-left shadow-xl transition-all hover:border-[#6b4c9a] hover:shadow-[0_0_16px_rgba(107,76,154,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4c9a] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="absolute inset-0 rounded-lg border border-[#6b4c9a]/0 transition-all group-hover:border-[#6b4c9a]/20" />

      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-[#d4c4a8]">
          {activity.name}
        </h3>
        <span className={`text-xs uppercase tracking-widest ${RISK_COLORS[activity.risk]}`}>
          {activity.risk} risk
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[#9090a0]">{activity.description}</p>

      <div className="mt-auto flex items-center justify-between border-t border-[#2d2d44] pt-3">
        <span className="text-xs text-[#6b6b80]">
          Humours: <span className="text-[#d4c4a8]">{activity.humourHint}</span>
        </span>
        <span className="text-xs text-[#6b6b80]">
          Clout: <span className="text-[#c9a227]">{activity.cloutHint}</span>
        </span>
      </div>
    </button>
  );
}

// ─── ActivityPhase ────────────────────────────────────────────────────────────

interface ActivityPhaseProps {
  onChoose: (id: ActivityId) => void;
  pending: boolean;
}

export default function ActivityPhase({ onChoose, pending }: ActivityPhaseProps) {
  const day = useGameStore((s) => s.day);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-[#6b6b80]">
        Day {day} — Morning
      </p>
      <h2 className="mb-2 text-center font-[family-name:var(--font-cinzel)] text-3xl tracking-wider text-[#d4c4a8]">
        Choose Your Activity
      </h2>
      <div className="mb-8 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />
      <p className="mb-10 text-center text-sm italic text-[#6b6b80]">
        The day stretches before you. How will you spend it?
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {ACTIVITIES.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onChoose={onChoose}
            disabled={pending}
          />
        ))}
      </div>
    </div>
  );
}
