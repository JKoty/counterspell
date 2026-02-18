// ─── Humours ──────────────────────────────────────────────────────────────────

export type HumourKey = 'fire' | 'air' | 'earth' | 'muse';

export interface Humours {
  fire: number;
  air: number;
  earth: number;
  muse: number;
}

// ─── Clout ────────────────────────────────────────────────────────────────────

export type CloutKey = 'prestige' | 'compromising' | 'contraband' | 'friendship';

export interface Clout {
  prestige: number;
  compromising: number; // "Compromising Materials"
  contraband: number;
  friendship: number;
}

// ─── Activities ───────────────────────────────────────────────────────────────

export type ActivityId = 'lectures' | 'tavern' | 'practice';

export interface ActivityDefinition {
  id: ActivityId;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  humourHint: string;
  cloutHint: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventChoiceId = string;

export interface EventOutcome {
  narrative: string;
  humourDelta: Partial<Humours>;
  cloutDelta: Partial<Clout>;
}

export interface EventChoice {
  id: EventChoiceId;
  label: string;
  hint: string;
  requiresClout?: { key: CloutKey; amount: number };
  /** d100 roll, 1–100; if undefined = always succeeds */
  successThreshold?: number;
  onSuccess: EventOutcome;
  onFailure?: EventOutcome;
}

export interface EventDefinition {
  id: string;
  title: string;
  setup: string;
  flavor: string;
  linkedActivities: ActivityId[];
  choices: EventChoice[];
}

// ─── Duels ────────────────────────────────────────────────────────────────────

export type SpellType = 'fireball' | 'shield' | 'illusion';

export interface RivalStudent {
  name: string;
  title: string;
  preferredSpell: SpellType;
}

export interface DuelResult {
  outcome: 'win' | 'lose' | 'draw';
  playerSpell: SpellType;
  rivalSpell: SpellType;
  playerPower: number;
  rivalPower: number;
  narrative: string;
  humourDelta: Partial<Humours>;
  cloutDelta: Partial<Clout>;
}

// ─── Game Phases ──────────────────────────────────────────────────────────────

export type GamePhase = 'activity' | 'event' | 'duel' | 'summary';

// ─── Day Summary ──────────────────────────────────────────────────────────────

export interface DaySummaryData {
  day: number;
  activityName: string;
  eventTitle: string;
  eventChoiceLabel: string;
  eventOutcomeNarrative: string;
  duelResult: DuelResult;
}

// ─── Session (server-side only) ───────────────────────────────────────────────

export interface GameSession {
  playerName: string;
  day: number;
  phase: GamePhase;
  humours: Humours;
  clout: Clout;
  pendingActivityId: ActivityId | null;
  pendingEventId: string | null;
  pendingChoiceId: string | null;
  pendingEventOutcome: EventOutcome | null;
  pendingRivalName: string | null;
}

// ─── Initial state passed from Server Component to GameClient ─────────────────

export interface InitialGameState {
  playerName: string;
  day: number;
  phase: GamePhase;
  humours: Humours;
  clout: Clout;
}

// ─── Server Action return types ───────────────────────────────────────────────

export interface ActivityActionResult {
  humours: Humours;
  clout: Clout;
  event: EventDefinition;
  rival: RivalStudent;
}

export interface EventActionResult {
  humours: Humours;
  clout: Clout;
  eventOutcome: EventOutcome;
  rival: RivalStudent;
}

export interface DuelActionResult {
  humours: Humours;
  clout: Clout;
  daySummary: DaySummaryData;
}

export interface NewDayResult {
  day: number;
  humours: Humours;
  clout: Clout;
}
