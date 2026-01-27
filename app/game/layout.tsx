import TopBar from "@/components/TopBar";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
