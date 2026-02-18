'use client';

import { useGameStore } from '@/lib/store';
import type { SpellType } from '@/lib/types';

// ─── Spell config ─────────────────────────────────────────────────────────────

const SPELL_CONFIG: Record<SpellType, { label: string; description: string }> = {
  fireball: {
    label: "Winkle's Wobbling Fireball",
    description: 'Beats Illusion. Loses to Shield.',
  },
  shield: {
    label: "Grumbolt's Slightly Reliable Shield",
    description: 'Beats Fireball. Loses to Illusion.',
  },
  illusion: {
    label: "Pffft's Convincing Illusion",
    description: 'Beats Shield. Loses to Fireball.',
  },
};

const SPELLS: SpellType[] = ['fireball', 'shield', 'illusion'];

// ─── SpellButton ──────────────────────────────────────────────────────────────

interface SpellButtonProps {
  spell: SpellType;
  humourBonus: number;
  isSelected: boolean;
  onSelect: (spell: SpellType) => void;
}

function SpellButton({ spell, humourBonus, isSelected, onSelect }: SpellButtonProps) {
  const { label, description } = SPELL_CONFIG[spell];
  return (
    <button
      onClick={() => onSelect(spell)}
      className={`flex flex-col gap-1 rounded-lg border-2 px-5 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4c9a] ${
        isSelected
          ? 'border-[#6b4c9a] bg-gradient-to-b from-[#3a2a55] to-[#2a1f40] shadow-[0_0_16px_rgba(107,76,154,0.4)]'
          : 'border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] hover:border-[#6b4c9a] hover:shadow-[0_0_10px_rgba(107,76,154,0.2)]'
      }`}
    >
      <span className="font-[family-name:var(--font-cinzel)] text-base text-[#d4c4a8]">{label}</span>
      <span className="text-xs italic text-[#6b6b80]">{description}</span>
      {humourBonus > 0 && (
        <span className="mt-1 text-xs text-[#c9a227]">+{humourBonus} power from Humours</span>
      )}
    </button>
  );
}

// ─── DuelPhase ────────────────────────────────────────────────────────────────

interface DuelPhaseProps {
  onConfirm: (spell: SpellType) => void;
  pending: boolean;
}

export default function DuelPhase({ onConfirm, pending }: DuelPhaseProps) {
  const currentRival   = useGameStore((s) => s.currentRival);
  const pendingSpell   = useGameStore((s) => s.pendingSpell);
  const hasMuseSwapped = useGameStore((s) => s.hasMuseSwapped);
  const humours        = useGameStore((s) => s.humours);
  const setPendingSpell = useGameStore((s) => s.setPendingSpell);
  const applyMuseSwap   = useGameStore((s) => s.applyMuseSwap);

  if (!currentRival) return null;

  const humourBonuses: Record<SpellType, number> = {
    fireball: Math.floor(humours.fire  / 10),
    illusion: Math.floor(humours.air   / 10),
    shield:   Math.floor(humours.earth / 10),
  };

  const canMuseSwap = humours.muse >= 5 && !hasMuseSwapped && pendingSpell !== null;

  function handleMuseSwap() {
    if (!pendingSpell || !canMuseSwap) return;
    const idx = SPELLS.indexOf(pendingSpell);
    applyMuseSwap(SPELLS[(idx + 1) % SPELLS.length]);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-[#6b6b80]">
        Evening — Duel
      </p>

      {/* Rival panel */}
      <div className="mb-6 rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-[#d4c4a8]">
              {currentRival.name}
            </h3>
            <p className="text-sm text-[#9090a0]">{currentRival.title}</p>
          </div>
          <p className="text-xs italic text-[#6b6b80]">Their preferred spells are unknown.</p>
        </div>
      </div>

      {/* Spell selection */}
      <h2 className="mb-2 font-[family-name:var(--font-cinzel)] text-lg text-[#d4c4a8]">
        Choose Your Spell
      </h2>
      <div className="mb-2 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />
      <div className="mb-6 mt-4 grid gap-3 md:grid-cols-3">
        {SPELLS.map((spell) => (
          <SpellButton
            key={spell}
            spell={spell}
            humourBonus={humourBonuses[spell]}
            isSelected={pendingSpell === spell}
            onSelect={setPendingSpell}
          />
        ))}
      </div>

      {/* Muse swap */}
      {pendingSpell && (
        <div className="mb-6 rounded-lg border border-[#2d2d44] bg-[#1f1f35] px-4 py-3">
          <p className="text-xs text-[#6b6b80]">
            Muse tokens allow you to change your spell selection. Costs 5 Muse, usable once per duel.
          </p>
          <button
            disabled={!canMuseSwap}
            onClick={handleMuseSwap}
            className={`mt-2 rounded border px-4 py-2 text-xs font-[family-name:var(--font-cinzel)] transition-all ${
              canMuseSwap
                ? 'border-[#8b6cb8] text-[#8b6cb8] hover:border-[#6b4c9a] hover:text-[#d4c4a8]'
                : 'cursor-not-allowed border-[#2d2d44] text-[#3d3d5c]'
            }`}
          >
            {hasMuseSwapped
              ? 'Muse Swap Used'
              : humours.muse < 5
              ? `Need 5 Muse (have ${humours.muse})`
              : `Muse Swap — costs 5 Muse (have ${humours.muse})`}
          </button>
        </div>
      )}

      {/* Confirm */}
      <button
        disabled={!pendingSpell || pending}
        onClick={() => pendingSpell && onConfirm(pendingSpell)}
        className={`w-full rounded border-2 px-8 py-4 font-[family-name:var(--font-cinzel)] text-lg transition-all ${
          pendingSpell && !pending
            ? 'border-[#6b4c9a] bg-gradient-to-b from-[#6b4c9a] to-[#4a3570] text-[#eaeaea] shadow-lg hover:from-[#7a5ca8] hover:to-[#5a4580]'
            : 'cursor-not-allowed border-[#2d2d44] text-[#3d3d5c]'
        }`}
      >
        {pending ? 'Resolving…' : 'Begin the Duel'}
      </button>
    </div>
  );
}
