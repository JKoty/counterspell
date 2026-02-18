'use client';

import { useGameStore } from '@/lib/store';
import type { EventChoice, EventChoiceId } from '@/lib/types';

// ─── ChoiceButton ─────────────────────────────────────────────────────────────

interface ChoiceButtonProps {
  choice: EventChoice;
  onChoose: (id: EventChoiceId) => void;
  playerCloutValue: number;
  disabled: boolean;
}

function ChoiceButton({ choice, onChoose, playerCloutValue, disabled }: ChoiceButtonProps) {
  // Hide clout-gated choices when requirement not met
  if (choice.requiresClout && playerCloutValue < choice.requiresClout.amount) {
    return null;
  }

  const isRisky = choice.successThreshold !== undefined && choice.successThreshold < 50;

  return (
    <button
      onClick={() => onChoose(choice.id)}
      disabled={disabled}
      className={`flex w-full flex-col gap-1 rounded-lg border-2 bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] px-5 py-4 text-left transition-all hover:shadow-[0_0_12px_rgba(107,76,154,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4c9a] disabled:cursor-not-allowed disabled:opacity-50 ${
        isRisky
          ? 'border-[#8b6cb8] hover:border-[#6b4c9a]'
          : 'border-[#3d3d5c] hover:border-[#6b4c9a]'
      }`}
    >
      <span className="font-[family-name:var(--font-cinzel)] text-sm text-[#d4c4a8]">
        {choice.label}
      </span>
      <span className="text-xs italic text-[#6b6b80]">{choice.hint}</span>
      {choice.requiresClout && (
        <span className="mt-1 text-xs text-[#c9a227]">
          Requires {choice.requiresClout.amount}+ {choice.requiresClout.key}
        </span>
      )}
    </button>
  );
}

// ─── EventPhase ───────────────────────────────────────────────────────────────

interface EventPhaseProps {
  onChoose: (id: EventChoiceId) => void;
  pending: boolean;
}

export default function EventPhase({ onChoose, pending }: EventPhaseProps) {
  const currentEvent = useGameStore((s) => s.currentEvent);
  const clout = useGameStore((s) => s.clout);

  if (!currentEvent) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-[#6b6b80]">
        Daytime — Event
      </p>
      <h2 className="mb-2 text-center font-[family-name:var(--font-cinzel)] text-2xl tracking-wider text-[#d4c4a8]">
        {currentEvent.title}
      </h2>
      <div className="mb-6 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />

      <div className="mb-6 rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-6 shadow-xl">
        <p className="mb-4 leading-relaxed text-[#eaeaea]">{currentEvent.setup}</p>
        <div className="border-t border-[#2d2d44] pt-4">
          <p className="text-sm italic text-[#6b6b80]">{currentEvent.flavor}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="mb-1 text-xs uppercase tracking-widest text-[#6b6b80]">Your Options:</p>
        {currentEvent.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            onChoose={onChoose}
            playerCloutValue={choice.requiresClout ? clout[choice.requiresClout.key] : 0}
            disabled={pending}
          />
        ))}
      </div>
    </div>
  );
}
