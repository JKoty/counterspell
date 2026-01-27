export default function Game() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="relative rounded-lg border-2 border-[#3d3d5c] bg-gradient-to-b from-[#2a2a40] to-[#1f1f35] p-10 shadow-xl">
        <div className="absolute inset-0 rounded-lg border border-[#6b4c9a]/20" />
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl tracking-wider text-[#d4c4a8]">
          The Great Hall
        </h1>
        <p className="mt-4 max-w-md text-center text-lg text-[#9090a0]">
          You stand in the entrance of Unseen University.
          The smell of old books and ancient magic fills the air.
        </p>
      </div>
    </div>
  );
}
