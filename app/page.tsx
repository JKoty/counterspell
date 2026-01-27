import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="relative rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-10 shadow-xl">
        <div className="absolute inset-0 rounded-lg border border-[#6b4c9a]/20" />
        <h1 className="font-[family-name:var(--font-cinzel)] text-5xl tracking-wider text-[#d4c4a8]">
          Counterspell
        </h1>
        <p className="mt-4 text-center text-lg text-[#9090a0]">
          Welcome to the Unseen University
        </p>
        <p className="mt-2 text-center text-sm italic text-[#6b6b80]">
          &ldquo;The trouble with having an open mind is that people will insist on coming along and trying to put things in it.&rdquo;
        </p>
        <Link
          href="/game"
          className="relative mt-6 block rounded border-2 border-[#6b4c9a] bg-gradient-to-b from-[#6b4c9a] to-[#4a3570] px-8 py-3 text-center font-[family-name:var(--font-cinzel)] text-lg text-[#eaeaea] shadow-lg transition-all hover:from-[#7a5ca8] hover:to-[#5a4580]"
        >
          Enter the University
        </Link>
      </div>
    </div>
  );
}
