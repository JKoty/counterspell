'use client';

import { useEffect, useTransition } from 'react';
import { useGameStore } from '@/lib/store';
import { performActivity, performEventChoice, performDuel, beginNextDay } from '@/lib/actions';
import ActivityPhase from '@/components/game/ActivityPhase';
import EventPhase from '@/components/game/EventPhase';
import DuelPhase from '@/components/game/DuelPhase';
import DaySummary from '@/components/game/DaySummary';
import type { InitialGameState, ActivityId, EventChoiceId, SpellType } from '@/lib/types';

interface GameClientProps {
  initialState: InitialGameState;
}

export default function GameClient({ initialState }: GameClientProps) {
  const [pending, startTransition] = useTransition();
  const phase = useGameStore((s) => s.phase);

  // Hydrate Zustand store from server props after mount (useEffect avoids mutating during render)
  useEffect(() => {
    useGameStore.getState().initialize(initialState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleActivityChosen(activityId: ActivityId) {
    startTransition(async () => {
      const result = await performActivity(activityId);
      useGameStore.getState().setActivityResult(result);
    });
  }

  function handleEventChoice(choiceId: EventChoiceId) {
    startTransition(async () => {
      const result = await performEventChoice(choiceId);
      useGameStore.getState().setEventResult(result);
    });
  }

  function handleDuelConfirmed(spell: SpellType) {
    startTransition(async () => {
      const result = await performDuel(spell);
      useGameStore.getState().setDuelResult(result);
    });
  }

  function handleBeginNextDay() {
    startTransition(async () => {
      const result = await beginNextDay();
      useGameStore.getState().advanceDay(result);
    });
  }

  return (
    <div className="min-h-screen">
      {phase === 'activity' && (
        <ActivityPhase onChoose={handleActivityChosen} pending={pending} />
      )}
      {phase === 'event' && (
        <EventPhase onChoose={handleEventChoice} pending={pending} />
      )}
      {phase === 'duel' && (
        <DuelPhase onConfirm={handleDuelConfirmed} pending={pending} />
      )}
      {phase === 'summary' && (
        <DaySummary onBeginNextDay={handleBeginNextDay} pending={pending} />
      )}
    </div>
  );
}
