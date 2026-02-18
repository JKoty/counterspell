import { getOrInitSession } from '@/lib/session';
import GameClient from '@/components/game/GameClient';
import type { InitialGameState } from '@/lib/types';

export default async function GamePage() {
  const session = await getOrInitSession();

  const initialState: InitialGameState = {
    playerName: session.playerName,
    day: session.day,
    phase: session.phase,
    humours: session.humours,
    clout: session.clout,
  };

  return <GameClient initialState={initialState} />;
}
