'use client';

import Image from 'next/image';

interface CounterProps {
  icon: string;
  value: number;
  alt: string;
}

function Counter({ icon, value, alt }: CounterProps) {
  return (
    <div className="flex items-center gap-2 rounded border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] px-4 py-2 shadow-inner">
      <Image src={icon} alt={alt} width={20} height={20} className="drop-shadow-[0_0_4px_rgba(201,162,39,0.5)]" />
      <span className="font-[family-name:var(--font-cinzel)] text-base text-[#d4c4a8]">{value.toLocaleString()}</span>
    </div>
  );
}

function PlayerPortrait() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-[#6b4c9a] shadow-[0_0_10px_rgba(107,76,154,0.6)]">
        <Image src="/icons/portrait.svg" alt="Player portrait" fill className="object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="font-[family-name:var(--font-cinzel)] text-base tracking-wide text-[#c9a227]">
          Ponder Stibbons Jr.
        </span>
        <span className="text-xs text-[#9090a0]">
          Freshman Student
        </span>
      </div>
    </div>
  );
}

export default function TopBar() {
  const counters = [
    { icon: '/icons/fire.svg', value: Math.floor(Math.random() * 100), alt: 'Fire' },
    { icon: '/icons/air.svg', value: Math.floor(Math.random() * 100), alt: 'Air' },
    { icon: '/icons/earth.svg', value: Math.floor(Math.random() * 100), alt: 'Earth' },
    { icon: '/icons/muse.svg', value: Math.floor(Math.random() * 50), alt: 'Muse' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-2 border-[#3d3d5c] bg-gradient-to-b from-[#252540] to-[#1a1a2e] px-6 py-2">
      <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />

      <PlayerPortrait />

      <div className="flex items-center gap-4">
        {counters.map((counter) => (
          <Counter key={counter.alt} {...counter} />
        ))}
      </div>

      <div className="w-[140px]" /> {/* Spacer for balance */}
    </header>
  );
}
