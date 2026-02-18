import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { GameSession, Humours, Clout } from '@/lib/types';

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'counterspell_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
};

export async function getSession() {
  return getIronSession<GameSession>(await cookies(), sessionOptions);
}

export const DEFAULT_HUMOURS: Humours = { fire: 5, air: 5, earth: 5, muse: 5 };
export const DEFAULT_CLOUT: Clout = { prestige: 0, compromising: 0, contraband: 0, friendship: 0 };

/**
 * Read-only: returns the session if it exists, or a plain default object if not.
 * Does NOT write cookies — safe to call from Server Components.
 * The session is persisted on the first Server Action call (performActivity).
 */
export async function getOrInitSession(): Promise<GameSession> {
  const session = await getSession();
  if (!session.phase) {
    return {
      playerName: 'Ponder Stibbons Jr.',
      day: 1,
      phase: 'activity',
      humours: { ...DEFAULT_HUMOURS },
      clout: { ...DEFAULT_CLOUT },
      pendingActivityId: null,
      pendingEventId: null,
      pendingChoiceId: null,
      pendingEventOutcome: null,
      pendingRivalName: null,
    };
  }
  return session;
}
