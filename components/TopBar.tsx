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

export default function TopBar() {
  const counters = [
    { icon: '/icons/gold.svg', value: Math.floor(Math.random() * 1000), alt: 'Gold' },
    { icon: '/icons/gem.svg', value: Math.floor(Math.random() * 100), alt: 'Gems' },
    { icon: '/icons/star.svg', value: Math.floor(Math.random() * 50), alt: 'Stars' },
    { icon: '/icons/scroll.svg', value: Math.floor(Math.random() * 20), alt: 'Scrolls' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-6 border-b-2 border-[#3d3d5c] bg-gradient-to-b from-[#252540] to-[#1a1a2e] px-6 py-3">
      <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent" />
      {counters.map((counter) => (
        <Counter key={counter.alt} {...counter} />
      ))}
    </header>
  );
}
