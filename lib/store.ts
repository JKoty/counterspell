import { create } from 'zustand';
import type {
  GamePhase,
  Humours,
  Clout,
  SpellType,
  EventDefinition,
  RivalStudent,
  EventOutcome,
  DuelResult,
  DaySummaryData,
  InitialGameState,
  ActivityActionResult,
  EventActionResult,
  DuelActionResult,
  NewDayResult,
} from '@/lib/types';

// ─── Store shape ──────────────────────────────────────────────────────────────

interface GameStore {
  // Mirrored from server (display only — not authoritative)
  playerName: string;
  day: number;
  phase: GamePhase;
  humours: Humours;
  clout: Clout;

  // Per-day display data
  currentEvent: EventDefinition | null;
  currentRival: RivalStudent | null;
  eventOutcome: EventOutcome | null;
  duelResult: DuelResult | null;
  daySummary: DaySummaryData | null;

  // Duel UI state (purely client-side until spell is confirmed)
  pendingSpell: SpellType | null;
  hasMuseSwapped: boolean;

  // Actions
  initialize: (state: InitialGameState) => void;
  setActivityResult: (result: ActivityActionResult) => void;
  setEventResult: (result: EventActionResult) => void;
  setPendingSpell: (spell: SpellType) => void;
  applyMuseSwap: (newSpell: SpellType) => void;
  setDuelResult: (result: DuelActionResult) => void;
  advanceDay: (result: NewDayResult) => void;
}

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_HUMOURS: Humours = { fire: 0, air: 0, earth: 0, muse: 0 };
const DEFAULT_CLOUT: Clout = { prestige: 0, compromising: 0, contraband: 0, friendship: 0 };

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  playerName: '',
  day: 1,
  phase: 'activity',
  humours: { ...DEFAULT_HUMOURS },
  clout: { ...DEFAULT_CLOUT },
  currentEvent: null,
  currentRival: null,
  eventOutcome: null,
  duelResult: null,
  daySummary: null,
  pendingSpell: null,
  hasMuseSwapped: false,

  initialize: (state) => set({
    playerName: state.playerName,
    day: state.day,
    phase: state.phase,
    humours: state.humours,
    clout: state.clout,
    // Reset per-day display data on re-init
    currentEvent: null,
    currentRival: null,
    eventOutcome: null,
    duelResult: null,
    daySummary: null,
    pendingSpell: null,
    hasMuseSwapped: false,
  }),

  setActivityResult: (result) => set({
    humours: result.humours,
    clout: result.clout,
    currentEvent: result.event,
    currentRival: result.rival,
    phase: 'event',
  }),

  setEventResult: (result) => set({
    humours: result.humours,
    clout: result.clout,
    eventOutcome: result.eventOutcome,
    currentRival: result.rival,
    phase: 'duel',
  }),

  setPendingSpell: (spell) => set({ pendingSpell: spell }),

  applyMuseSwap: (newSpell) => {
    const { humours, hasMuseSwapped } = get();
    if (hasMuseSwapped || humours.muse < 5) return;
    set({
      pendingSpell: newSpell,
      hasMuseSwapped: true,
      humours: { ...humours, muse: humours.muse - 5 },
    });
  },

  setDuelResult: (result) => set({
    humours: result.humours,
    clout: result.clout,
    daySummary: result.daySummary,
    phase: 'summary',
  }),

  advanceDay: (result) => set({
    day: result.day,
    humours: result.humours,
    clout: result.clout,
    phase: 'activity',
    currentEvent: null,
    currentRival: null,
    eventOutcome: null,
    duelResult: null,
    daySummary: null,
    pendingSpell: null,
    hasMuseSwapped: false,
  }),
}));
