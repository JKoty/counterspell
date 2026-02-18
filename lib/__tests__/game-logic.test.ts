import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  applyHumourDelta,
  applyCloutDelta,
  resolveActivityRewards,
  pickEventForActivity,
  resolveEventChoice,
  resolveDuel,
  computeDaySummary,
} from '@/lib/game-logic';
import { EVENTS, ACTIVITIES, RIVALS } from '@/lib/game-data';
import type { Humours, Clout, RivalStudent } from '@/lib/types';

// ─── applyHumourDelta ─────────────────────────────────────────────────────────

describe('applyHumourDelta', () => {
  const base: Humours = { fire: 10, air: 10, earth: 10, muse: 10 };

  it('adds positive deltas', () => {
    expect(applyHumourDelta(base, { fire: 3, muse: 2 })).toEqual({
      fire: 13, air: 10, earth: 10, muse: 12,
    });
  });

  it('subtracts negative deltas', () => {
    expect(applyHumourDelta(base, { air: -4 })).toEqual({
      fire: 10, air: 6, earth: 10, muse: 10,
    });
  });

  it('floors at zero — never goes negative', () => {
    expect(applyHumourDelta(base, { fire: -100 })).toEqual({
      fire: 0, air: 10, earth: 10, muse: 10,
    });
  });

  it('ignores missing keys (treats as 0)', () => {
    expect(applyHumourDelta(base, {})).toEqual(base);
  });
});

// ─── applyCloutDelta ──────────────────────────────────────────────────────────

describe('applyCloutDelta', () => {
  const base: Clout = { prestige: 5, compromising: 3, contraband: 1, friendship: 2 };

  it('adds positive deltas', () => {
    const result = applyCloutDelta(base, { prestige: 2, friendship: 1 });
    expect(result.prestige).toBe(7);
    expect(result.friendship).toBe(3);
  });

  it('floors at zero', () => {
    const result = applyCloutDelta(base, { contraband: -99 });
    expect(result.contraband).toBe(0);
  });

  it('leaves untouched keys unchanged', () => {
    const result = applyCloutDelta(base, { prestige: 1 });
    expect(result.compromising).toBe(base.compromising);
    expect(result.contraband).toBe(base.contraband);
    expect(result.friendship).toBe(base.friendship);
  });
});

// ─── resolveActivityRewards ───────────────────────────────────────────────────

describe('resolveActivityRewards', () => {
  it('lectures gives air, earth, prestige', () => {
    const { humourDelta, cloutDelta } = resolveActivityRewards('lectures');
    expect(humourDelta.air).toBeGreaterThan(0);
    expect(humourDelta.earth).toBeGreaterThan(0);
    expect(cloutDelta.prestige).toBeGreaterThan(0);
  });

  it('tavern gives fire, friendship', () => {
    const { humourDelta, cloutDelta } = resolveActivityRewards('tavern');
    expect(humourDelta.fire).toBeGreaterThan(0);
    expect(cloutDelta.friendship).toBeGreaterThan(0);
  });

  it('practice always returns a non-empty humourDelta', () => {
    // Run many times to exercise all branches (disaster, muse-heavy, air-heavy)
    for (let i = 0; i < 100; i++) {
      const { humourDelta } = resolveActivityRewards('practice');
      const keys = Object.keys(humourDelta);
      expect(keys.length).toBeGreaterThan(0);
    }
  });

  it('practice disaster branch produces negative muse delta', () => {
    // Force the disaster branch (roll < 0.30)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1);
    const { humourDelta } = resolveActivityRewards('practice');
    expect(humourDelta.muse).toBe(-3);
    vi.restoreAllMocks();
  });

  it('practice muse-heavy branch (roll 0.30–0.65)', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const { humourDelta } = resolveActivityRewards('practice');
    expect(humourDelta.muse).toBe(4);
    expect(humourDelta.air).toBe(1);
    vi.restoreAllMocks();
  });

  it('practice air-heavy branch (roll > 0.65)', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.9);
    const { humourDelta } = resolveActivityRewards('practice');
    expect(humourDelta.air).toBe(4);
    expect(humourDelta.muse).toBe(1);
    vi.restoreAllMocks();
  });
});

// ─── pickEventForActivity ─────────────────────────────────────────────────────

describe('pickEventForActivity', () => {
  it('returns an EventDefinition', () => {
    const event = pickEventForActivity('lectures');
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('choices');
  });

  it('for lectures, picks only linked or universal events', () => {
    for (let i = 0; i < 50; i++) {
      const event = pickEventForActivity('lectures');
      const isLinked = event.linkedActivities.includes('lectures') || event.linkedActivities.length === 0;
      expect(isLinked).toBe(true);
    }
  });

  it('for tavern, picks only linked or universal events', () => {
    for (let i = 0; i < 50; i++) {
      const event = pickEventForActivity('tavern');
      const isLinked = event.linkedActivities.includes('tavern') || event.linkedActivities.length === 0;
      expect(isLinked).toBe(true);
    }
  });

  it('never returns an event linked to a different activity only', () => {
    // tavern_bet is linked only to tavern — should never appear for lectures
    for (let i = 0; i < 100; i++) {
      const event = pickEventForActivity('lectures');
      expect(event.id).not.toBe('tavern_bet');
    }
  });
});

// ─── resolveEventChoice ───────────────────────────────────────────────────────

describe('resolveEventChoice', () => {
  const librarian = EVENTS.find((e) => e.id === 'librarian_displeasure')!;
  const baseClout: Clout = { prestige: 0, compromising: 0, contraband: 0, friendship: 0 };

  it('guaranteed choice (no successThreshold) always returns onSuccess', () => {
    // Choice 'a' (apologize) has no successThreshold
    const outcome = resolveEventChoice(librarian, 'a', baseClout);
    expect(outcome.narrative).toBeTruthy();
    expect(outcome.cloutDelta.prestige).toBe(-1);
  });

  it('returns fallback outcome for unknown choiceId', () => {
    const outcome = resolveEventChoice(librarian, 'zzz', baseClout);
    expect(outcome.narrative).toBe('Nothing happened.');
  });

  it('clout-gated choice is blocked when requirement not met', () => {
    // Choice 'd' requires prestige >= 5; baseClout has 0
    const outcome = resolveEventChoice(librarian, 'd', baseClout);
    expect(outcome.narrative).toContain("don't have what it takes");
  });

  it('clout-gated choice succeeds when requirement is met', () => {
    const highPrestige: Clout = { ...baseClout, prestige: 5 };
    const outcome = resolveEventChoice(librarian, 'd', highPrestige);
    expect(outcome.cloutDelta.prestige).toBe(-2); // costs 2 prestige
  });

  it('risky choice succeeds when roll <= threshold', () => {
    // Choice 'b' has successThreshold: 40 — force roll of 20 (success)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.19); // floor(0.19 * 100) + 1 = 20
    const outcome = resolveEventChoice(librarian, 'b', baseClout);
    expect(outcome.cloutDelta.compromising).toBe(2);
    vi.restoreAllMocks();
  });

  it('risky choice fails when roll > threshold', () => {
    // Force roll of 80 (failure for threshold 40)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.79); // floor(0.79 * 100) + 1 = 80
    const outcome = resolveEventChoice(librarian, 'b', baseClout);
    expect(outcome.cloutDelta.prestige).toBe(-2);
    vi.restoreAllMocks();
  });
});

// ─── resolveDuel ──────────────────────────────────────────────────────────────

describe('resolveDuel', () => {
  const rival: RivalStudent = { name: 'Test Rival', title: 'Test', preferredSpell: 'fireball' };
  const flatHumours: Humours = { fire: 0, air: 0, earth: 0, muse: 0 };

  it('fireball beats illusion', () => {
    // Force rival to pick illusion: roll > 0.7 → random path, then floor(0.7*3)=2 → illusion
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)  // > 0.7 → random spell
      .mockReturnValueOnce(0.7); // floor(0.7*3)=2 → illusion
    const result = resolveDuel('fireball', rival, flatHumours);
    expect(result.outcome).toBe('win');
    vi.restoreAllMocks();
  });

  it('shield beats fireball', () => {
    // Force rival to pick fireball (preferred, roll < 0.7)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const result = resolveDuel('shield', rival, flatHumours);
    expect(result.outcome).toBe('win');
    vi.restoreAllMocks();
  });

  it('illusion loses to fireball', () => {
    // Force rival to pick fireball (preferred)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const result = resolveDuel('illusion', rival, flatHumours);
    expect(result.outcome).toBe('lose');
    vi.restoreAllMocks();
  });

  it('same spell with equal power is a draw', () => {
    // Force rival to pick fireball (preferred), player also picks fireball → draw at equal power
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const result = resolveDuel('fireball', rival, flatHumours);
    expect(result.outcome).toBe('draw');
    expect(result.humourDelta.muse).toBe(-1);
    vi.restoreAllMocks();
  });

  it('higher humour power breaks a spell tie in favour of player', () => {
    // Both pick fireball; player has 50 fire → power = 10 + 5 = 15 > 10
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const richHumours: Humours = { fire: 50, air: 0, earth: 0, muse: 0 };
    const result = resolveDuel('fireball', rival, richHumours);
    expect(result.outcome).toBe('win');
    expect(result.playerPower).toBe(15);
    vi.restoreAllMocks();
  });

  it('win gives +2 prestige', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5); // rival picks fireball
    const result = resolveDuel('shield', rival, flatHumours);
    expect(result.cloutDelta.prestige).toBe(2);
    vi.restoreAllMocks();
  });

  it('fireball win gives +1 contraband', () => {
    // Force rival illusion: floor(0.7*3)=2 → illusion; fireball beats illusion → win
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.7);
    const result = resolveDuel('fireball', rival, flatHumours);
    expect(result.cloutDelta.contraband).toBe(1);
    vi.restoreAllMocks();
  });

  it('loss gives -1 prestige', () => {
    // Force rival to pick shield: floor(0.5*3)=1 → shield; fireball loses to shield
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)  // > 0.7 → random spell
      .mockReturnValueOnce(0.5); // floor(0.5*3)=1 → shield
    const result = resolveDuel('fireball', rival, flatHumours);
    expect(result.outcome).toBe('lose');
    expect(result.cloutDelta.prestige).toBe(-1);
    vi.restoreAllMocks();
  });

  it('returns a non-empty narrative string', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = resolveDuel('shield', rival, flatHumours);
    expect(result.narrative.length).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });
});

// ─── computeDaySummary ────────────────────────────────────────────────────────

describe('computeDaySummary', () => {
  const librarian = EVENTS.find((e) => e.id === 'librarian_displeasure')!;
  const duelResult = {
    outcome: 'win' as const,
    playerSpell: 'shield' as const,
    rivalSpell: 'fireball' as const,
    playerPower: 10,
    rivalPower: 10,
    narrative: 'You win.',
    humourDelta: {},
    cloutDelta: { prestige: 2, friendship: 1 },
  };

  it('includes activity name', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'a', { narrative: 'OK', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.activityName).toBe('Attend Lectures');
  });

  it('includes event title', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'a', { narrative: 'OK', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.eventTitle).toBe("The Librarian's Displeasure");
  });

  it('includes the choice label for known choiceId', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'a', { narrative: 'OK', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.eventChoiceLabel).toBe('Apologize profusely');
  });

  it('falls back to — for unknown choiceId', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'zzz', { narrative: 'OK', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.eventChoiceLabel).toBe('—');
  });

  it('includes the duel result', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'a', { narrative: 'OK', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.duelResult.outcome).toBe('win');
  });

  it('includes the event outcome narrative', () => {
    const summary = computeDaySummary(1, 'lectures', librarian, 'a', { narrative: 'Librarian stares.', humourDelta: {}, cloutDelta: {} }, duelResult);
    expect(summary.eventOutcomeNarrative).toBe('Librarian stares.');
  });
});
