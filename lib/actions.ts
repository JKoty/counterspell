'use server';

import { getSession, DEFAULT_HUMOURS, DEFAULT_CLOUT } from '@/lib/session';
import {
  resolveActivityRewards,
  pickEventForActivity,
  resolveEventChoice,
  resolveDuel,
  computeDaySummary,
  applyHumourDelta,
  applyCloutDelta,
} from '@/lib/game-logic';
import { EVENTS, RIVALS } from '@/lib/game-data';
import type {
  ActivityId,
  EventChoiceId,
  SpellType,
  ActivityActionResult,
  EventActionResult,
  DuelActionResult,
  NewDayResult,
} from '@/lib/types';

export async function performActivity(
  activityId: ActivityId
): Promise<ActivityActionResult> {
  const session = await getSession();

  // First visit: session cookie doesn't exist yet — initialize it now.
  // (Cookies can only be written from Server Actions, not Server Components.)
  if (!session.phase) {
    session.playerName = 'Ponder Stibbons Jr.';
    session.day = 1;
    session.phase = 'activity';
    session.humours = { ...DEFAULT_HUMOURS };
    session.clout = { ...DEFAULT_CLOUT };
    session.pendingActivityId = null;
    session.pendingEventId = null;
    session.pendingChoiceId = null;
    session.pendingEventOutcome = null;
    session.pendingRivalName = null;
  }

  if (session.phase !== 'activity') {
    throw new Error(`Invalid phase: expected 'activity', got '${session.phase}'`);
  }

  const rewards = resolveActivityRewards(activityId);
  const event = pickEventForActivity(activityId);
  const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];

  session.humours = applyHumourDelta(session.humours, rewards.humourDelta);
  session.clout = applyCloutDelta(session.clout, rewards.cloutDelta);
  session.pendingActivityId = activityId;
  session.pendingEventId = event.id;
  session.pendingChoiceId = null;
  session.pendingEventOutcome = null;
  session.pendingRivalName = rival.name;
  session.phase = 'event';
  await session.save();

  return { humours: session.humours, clout: session.clout, event, rival };
}

export async function performEventChoice(
  choiceId: EventChoiceId
): Promise<EventActionResult> {
  const session = await getSession();

  if (session.phase !== 'event') {
    throw new Error(`Invalid phase: expected 'event', got '${session.phase}'`);
  }

  const event = EVENTS.find((e) => e.id === session.pendingEventId);
  if (!event) throw new Error(`Unknown event: ${session.pendingEventId}`);

  const rival = RIVALS.find((r) => r.name === session.pendingRivalName);
  if (!rival) throw new Error(`Unknown rival: ${session.pendingRivalName}`);

  const eventOutcome = resolveEventChoice(event, choiceId, session.clout);

  session.humours = applyHumourDelta(session.humours, eventOutcome.humourDelta);
  session.clout = applyCloutDelta(session.clout, eventOutcome.cloutDelta);
  session.pendingChoiceId = choiceId;
  session.pendingEventOutcome = eventOutcome;
  session.phase = 'duel';
  await session.save();

  return { humours: session.humours, clout: session.clout, eventOutcome, rival };
}

export async function performDuel(
  playerSpell: SpellType
): Promise<DuelActionResult> {
  const session = await getSession();

  if (session.phase !== 'duel') {
    throw new Error(`Invalid phase: expected 'duel', got '${session.phase}'`);
  }

  const rival = RIVALS.find((r) => r.name === session.pendingRivalName);
  if (!rival) throw new Error(`Unknown rival: ${session.pendingRivalName}`);

  const event = EVENTS.find((e) => e.id === session.pendingEventId);
  if (!event) throw new Error(`Unknown event: ${session.pendingEventId}`);

  if (!session.pendingEventOutcome) throw new Error('Missing pending event outcome');

  const duelResult = resolveDuel(playerSpell, rival, session.humours);

  session.humours = applyHumourDelta(session.humours, duelResult.humourDelta);
  session.clout = applyCloutDelta(session.clout, duelResult.cloutDelta);
  session.phase = 'summary';
  await session.save();

  const daySummary = computeDaySummary(
    session.day,
    session.pendingActivityId!,
    event,
    session.pendingChoiceId ?? '',
    session.pendingEventOutcome,
    duelResult
  );

  return { humours: session.humours, clout: session.clout, daySummary };
}

export async function beginNextDay(): Promise<NewDayResult> {
  const session = await getSession();

  if (session.phase !== 'summary') {
    throw new Error(`Invalid phase: expected 'summary', got '${session.phase}'`);
  }

  session.day += 1;
  session.phase = 'activity';
  session.pendingActivityId = null;
  session.pendingEventId = null;
  session.pendingChoiceId = null;
  session.pendingEventOutcome = null;
  session.pendingRivalName = null;
  await session.save();

  return { day: session.day, humours: session.humours, clout: session.clout };
}
