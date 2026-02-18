'use client';

import Image from 'next/image';
import { useGameStore } from '@/lib/store';

// ─── Counter ──────────────────────────────────────────────────────────────────

interface CounterProps {
  icon: string;
  value: number;
  alt: string;
  dimmed?: boolean;
}

function Counter({ icon, value, alt, dimmed = false }: CounterProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded border-2 bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] px-3 py-2 shadow-inner ${
        dimmed ? 'border-[#2d2d44]' : 'border-[#3d3d5c]'
      }`}
    >
      <Image
        src={icon}
        alt={alt}
        width={18}
        height={18}
        className="drop-shadow-[0_0_4px_rgba(201,162,39,0.5)]"
      />
      <span
        className={`font-[family-name:var(--font-cinzel)] text-sm ${
          dimmed ? 'text-[#9090a0]' : 'text-[#d4c4a8]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── PlayerPortrait ───────────────────────────────────────────────────────────

function PlayerPortrait({ name, day }: { name: string; day: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-[#6b4c9a] shadow-[0_0_10px_rgba(107,76,154,0.6)]">
        <Image src="/icons/portrait.svg" alt="Player portrait" fill className="object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="font-[family-name:var(--font-cinzel)] text-sm tracking-wide text-[#c9a227]">
          {name}
        </span>
        <span className="text-xs text-[#9090a0]">Day {day}</span>
      </div>
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

export default function TopBar() {
  const { playerName, day, humours, clout } = useGameStore();

  const humourCounters = [
    { icon: '/icons/fire.svg',  value: humours.fire,  alt: 'Fire'  },
    { icon: '/icons/air.svg',   value: humours.air,   alt: 'Air'   },
    { icon: '/icons/earth.svg', value: humours.earth, alt: 'Earth' },
    { icon: '/icons/muse.svg',  value: humours.muse,  alt: 'Muse'  },
  ];

  // Clout reuses humour icons as placeholders — dedicated icons (star, scroll, vial, ribbon) to be added later
  const cloutCounters = [
    { icon: '/icons/fire.svg',  value: clout.prestige,     alt: 'Prestige'               },
    { icon: '/icons/air.svg',   value: clout.compromising, alt: 'Compromising Materials' },
    { icon: '/icons/earth.svg', value: clout.contraband,   alt: 'Contraband'             },
    { icon: '/icons/muse.svg',  value: clout.friendship,   alt: 'Friendship'             },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-2 border-[#3d3d5c] bg-gradient-to-b from-[#252540] to-[#1a1a2e] px-6 py-2">
      <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />

      <PlayerPortrait name={playerName} day={day} />

      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest text-[#6b6b80]">Humours</span>
        {humourCounters.map((c) => (
          <Counter key={c.alt} {...c} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest text-[#6b6b80]">Clout</span>
        {cloutCounters.map((c) => (
          <Counter key={c.alt} {...c} dimmed />
        ))}
      </div>
    </header>
  );
}
