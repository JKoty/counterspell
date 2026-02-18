import type {
  ActivityId,
  EventDefinition,
  EventChoiceId,
  EventOutcome,
  SpellType,
  RivalStudent,
  Humours,
  Clout,
  DuelResult,
  DaySummaryData,
} from '@/lib/types';
import { ACTIVITIES, EVENTS } from '@/lib/game-data';

// ─── Delta helpers (exported so actions.ts can reuse them) ────────────────────

export function applyHumourDelta(
  current: Humours,
  delta: Partial<Humours>
): Humours {
  return {
    fire:  Math.max(0, current.fire  + (delta.fire  ?? 0)),
    air:   Math.max(0, current.air   + (delta.air   ?? 0)),
    earth: Math.max(0, current.earth + (delta.earth ?? 0)),
    muse:  Math.max(0, current.muse  + (delta.muse  ?? 0)),
  };
}

export function applyCloutDelta(
  current: Clout,
  delta: Partial<Clout>
): Clout {
  return {
    prestige:     Math.max(0, current.prestige     + (delta.prestige     ?? 0)),
    compromising: Math.max(0, current.compromising + (delta.compromising ?? 0)),
    contraband:   Math.max(0, current.contraband   + (delta.contraband   ?? 0)),
    friendship:   Math.max(0, current.friendship   + (delta.friendship   ?? 0)),
  };
}

// ─── resolveActivityRewards ───────────────────────────────────────────────────

export function resolveActivityRewards(
  activityId: ActivityId
): { humourDelta: Partial<Humours>; cloutDelta: Partial<Clout> } {
  switch (activityId) {
    case 'lectures':
      return {
        humourDelta: { air: 3, earth: 2 },
        cloutDelta: { prestige: 1 },
      };

    case 'tavern':
      return {
        humourDelta: { fire: 4 },
        cloutDelta: { friendship: 1 },
      };

    case 'practice': {
      const roll = Math.random();
      if (roll < 0.30) {
        // Disaster
        return { humourDelta: { muse: -3 }, cloutDelta: {} };
      }
      if (roll < 0.65) {
        // Muse-heavy
        return { humourDelta: { muse: 4, air: 1 }, cloutDelta: {} };
      }
      // Air-heavy
      return { humourDelta: { air: 4, muse: 1 }, cloutDelta: {} };
    }
  }
}

// ─── pickEventForActivity ─────────────────────────────────────────────────────

export function pickEventForActivity(activityId: ActivityId): EventDefinition {
  const linked = EVENTS.filter(
    (e) => e.linkedActivities.length === 0 || e.linkedActivities.includes(activityId)
  );
  const pool = linked.length > 0 ? linked : EVENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── resolveEventChoice ───────────────────────────────────────────────────────

export function resolveEventChoice(
  event: EventDefinition,
  choiceId: EventChoiceId,
  playerClout: Clout
): EventOutcome {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { narrative: 'Nothing happened.', humourDelta: {}, cloutDelta: {} };
  }

  // Validate clout requirement
  if (choice.requiresClout) {
    const { key, amount } = choice.requiresClout;
    if (playerClout[key] < amount) {
      return {
        narrative: "You don't have what it takes. Not this time.",
        humourDelta: {},
        cloutDelta: {},
      };
    }
  }

  // RNG resolution
  if (choice.successThreshold !== undefined) {
    const roll = Math.floor(Math.random() * 100) + 1; // 1–100
    if (roll <= choice.successThreshold) {
      return choice.onSuccess;
    }
    return choice.onFailure ?? {
      narrative: 'It did not go as planned.',
      humourDelta: {},
      cloutDelta: {},
    };
  }

  return choice.onSuccess;
}

// ─── resolveDuel ──────────────────────────────────────────────────────────────

const SPELL_BEATS: Record<SpellType, SpellType> = {
  fireball: 'illusion',
  shield:   'fireball',
  illusion: 'shield',
};

const SPELL_WIN_CLOUT: Record<SpellType, Partial<Clout>> = {
  fireball: { contraband: 1 },
  shield:   { friendship: 1 },
  illusion: { compromising: 1 },
};

const DUEL_NARRATIVES: Record<'win' | 'lose' | 'draw', string[]> = {
  win: [
    'Your spell connects with a sound that future students will describe in hushed tones.',
    'You win with the kind of efficiency that makes victory seem entirely accidental, which is your preferred aesthetic.',
    'The duel ends. Your rival looks at their hands as if reconsidering their academic choices.',
  ],
  lose: [
    "You lose. Your rival has the decency not to gloat. You suspect they are simply saving it for later.",
    "The spell rebounds in a direction that could generously be called 'unexpected.' You are fine. Your reputation is not.",
    "You are defeated with mathematical precision. Your rival bows. You consider whether bowing back is legally required.",
  ],
  draw: [
    "Both spells arrive at the same moment and politely cancel each other out. You share a look of mutual exhaustion.",
    "The duel ends inconclusively, which the rulebook calls a draw and your instincts call deeply unsatisfying.",
    "Neither of you wins. The Muse you both expended dissipates into the air and briefly makes the hallway smell like unfinished poetry.",
  ],
};

export function resolveDuel(
  playerSpell: SpellType,
  rival: RivalStudent,
  playerHumours: Humours
): DuelResult {
  const spellOptions: SpellType[] = ['fireball', 'shield', 'illusion'];
  const rivalSpell: SpellType =
    Math.random() < 0.7
      ? rival.preferredSpell
      : spellOptions[Math.floor(Math.random() * 3)];

  const humourBonus: Record<SpellType, number> = {
    fireball: Math.floor(playerHumours.fire  / 10),
    illusion: Math.floor(playerHumours.air   / 10),
    shield:   Math.floor(playerHumours.earth / 10),
  };
  const playerPower = 10 + humourBonus[playerSpell];
  const rivalPower  = 10;

  let outcome: 'win' | 'lose' | 'draw';
  if (playerSpell === rivalSpell) {
    // Tie broken by power
    if (playerPower > rivalPower) outcome = 'win';
    else if (playerPower < rivalPower) outcome = 'lose';
    else outcome = 'draw';
  } else if (SPELL_BEATS[playerSpell] === rivalSpell) {
    outcome = 'win';
  } else {
    outcome = 'lose';
  }

  const narratives = DUEL_NARRATIVES[outcome];
  const narrative = narratives[Math.floor(Math.random() * narratives.length)];

  const humourDelta: Partial<Humours> = outcome === 'draw' ? { muse: -1 } : {};
  let cloutDelta: Partial<Clout>;
  switch (outcome) {
    case 'win':
      cloutDelta = { prestige: 2, ...SPELL_WIN_CLOUT[playerSpell] };
      break;
    case 'lose':
      cloutDelta = { prestige: -1 };
      break;
    default:
      cloutDelta = {};
  }

  return { outcome, playerSpell, rivalSpell, playerPower, rivalPower, narrative, humourDelta, cloutDelta };
}

// ─── computeDaySummary ────────────────────────────────────────────────────────

export function computeDaySummary(
  day: number,
  activityId: ActivityId,
  event: EventDefinition,
  choiceId: EventChoiceId,
  eventOutcome: EventOutcome,
  duelResult: DuelResult
): DaySummaryData {
  const activity = ACTIVITIES.find((a) => a.id === activityId)!;
  const choice = event.choices.find((c) => c.id === choiceId);
  return {
    day,
    activityName: activity.name,
    eventTitle: event.title,
    eventChoiceLabel: choice?.label ?? '—',
    eventOutcomeNarrative: eventOutcome.narrative,
    duelResult,
  };
}
