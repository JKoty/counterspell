import type { ActivityDefinition, EventDefinition, RivalStudent } from '@/lib/types';

// ─── Activities ───────────────────────────────────────────────────────────────

export const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'lectures',
    name: 'Attend Lectures',
    description:
      'You settle into a creaking seat in the Grand Lecture Hall while Professor Humpledink of Improbable Mathematics explains why numbers are "merely a suggestion." You take notes. Occasionally something is true.',
    risk: 'low',
    humourHint: 'Air, Earth',
    cloutHint: '+Prestige',
  },
  {
    id: 'tavern',
    name: 'Visit the Tavern',
    description:
      'The Leaky Cauldron & Kettle has stood on this corner since before the university existed, which the university considers deeply suspicious. You spend the afternoon making friends, enemies, and one extremely complicated bet.',
    risk: 'medium',
    humourHint: 'Fire',
    cloutHint: '+Friendship',
  },
  {
    id: 'practice',
    name: 'Practice Magic',
    description:
      'You commandeer an empty classroom and attempt to work through the Advanced Theory of Theoretical Advancement. The results are either transcendent or catastrophic. Statistically, these are not as different as one might hope.',
    risk: 'high',
    humourHint: 'Muse, Air (or disaster)',
    cloutHint: '—',
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const EVENTS: EventDefinition[] = [
  // ── Event 1: The Librarian's Displeasure ──────────────────────────────────
  {
    id: 'librarian_displeasure',
    title: "The Librarian's Displeasure",
    setup:
      "You accidentally shelve a book upside-down. The Librarian — who is, as tradition demands, an orangutan of considerable dignity and even more considerable reach — has noticed.",
    flavor:
      "Library fines at Invisible University are measured in decades. The record is currently held by a student who has been dead for two centuries and still has not returned 'Ye Compleat Booke of Definitely Safe Cantrips.'",
    linkedActivities: ['lectures'],
    choices: [
      {
        id: 'a',
        label: 'Apologize profusely',
        hint: 'Safe, but your dignity will never fully recover',
        onSuccess: {
          narrative:
            'You spend several minutes bowing, scraping, and explaining. The Librarian stares at you for an uncomfortable interval, then returns the book to its correct position with one hand while eating a banana with the other. You are allowed to leave. Your dignity is not.',
          humourDelta: {},
          cloutDelta: { prestige: -1 },
        },
      },
      {
        id: 'b',
        label: 'Blame a ghost',
        hint: 'Risky — the Librarian has opinions about ghosts',
        successThreshold: 40,
        onSuccess: {
          narrative:
            "The Librarian considers this. It is, after all, a university with an active ghost population. He checks the shelving records, discovers that Geoffrey the Unfinished has form for precisely this sort of nonsense, and allows you to go free. You now know something the Librarian found embarrassing. You file it away.",
          humourDelta: {},
          cloutDelta: { compromising: 2 },
        },
        onFailure: {
          narrative:
            "The Librarian has been working in this library for thirty years. He knows every ghost by name. Geoffrey the Unfinished was exorcised last Tuesday. The Librarian does not shout — that would disturb the books. He simply writes your name in the Big Ledger with a special red pen.",
          humourDelta: {},
          cloutDelta: { prestige: -2 },
        },
      },
      {
        id: 'c',
        label: 'Run',
        hint: 'You can try',
        onSuccess: {
          narrative:
            "You run. The Librarian does not — orangutans are built for efficiency, not chasing. However, you blunder through the Restricted Section on your way out and emerge clutching a scroll that crackles with barely-contained wind. You do not stop to read what it contains. You are a coward, but a well-ventilated one.",
          humourDelta: { air: 3 },
          cloutDelta: { prestige: -1 },
        },
      },
      {
        id: 'd',
        label: 'Cite academic precedent',
        hint: 'Requires ≥5 Prestige — costs 2 Prestige',
        requiresClout: { key: 'prestige', amount: 5 },
        onSuccess: {
          narrative:
            "You invoke the University Statute of 1432, sub-clause 9(b)(iii), which establishes that any shelving error made during a period of 'profound academic contemplation' is null and void. The Librarian stares at you for a very long time. Then he stamps your borrower's card CLEARED and turns away. You have won. You feel terrible about it.",
          humourDelta: {},
          cloutDelta: { prestige: -2 },
        },
      },
    ],
  },

  // ── Event 2: The Unscheduled Examination ──────────────────────────────────
  {
    id: 'examination',
    title: 'The Unscheduled Examination',
    setup:
      "You walk into what you thought was an empty classroom. It is not empty. It contains Professor Overwelt of Unnecessary Experiments, a desk, a quill, and a sheet of paper with the words 'SURPRISE EXAMINATION' written across the top in letters that appear to be slightly on fire.",
    flavor:
      "Invisible University examinations are considered optional by the faculty, mandatory by the administration, and existentially threatening by everyone else.",
    linkedActivities: ['lectures', 'practice'],
    choices: [
      {
        id: 'a',
        label: 'Sit the examination',
        hint: 'You have studied. Probably.',
        successThreshold: 55,
        onSuccess: {
          narrative:
            "By some miracle of retained information, you answer three and a half questions correctly. Professor Overwelt marks your paper 'ADEQUATE' in letters that suggest adequate is, in his estimation, the finest word in the academic lexicon. You receive a commendation. It is on fire. This is normal.",
          humourDelta: { air: 2 },
          cloutDelta: { prestige: 2 },
        },
        onFailure: {
          narrative:
            "Your answers are creative. They are not correct. Professor Overwelt reads your paper with the expression of a man watching a slow-motion catastrophe from a comfortable distance. He circles every answer, writes 'INNOVATIVE' next to each one, and explains that innovative is not the same as right.",
          humourDelta: {},
          cloutDelta: { prestige: -1 },
        },
      },
      {
        id: 'b',
        label: 'Claim you are a ghost',
        hint: 'Technically, many people here are ghosts',
        successThreshold: 30,
        onSuccess: {
          narrative:
            "You go slightly translucent — a trick any student who's spent too long in the library can manage. Overwelt squints. He's examined ghosts before; they always get full marks out of sympathy. You receive a ghost grade. It does not count toward your degree but impresses no one in ways that will prove useful later.",
          humourDelta: { muse: 2 },
          cloutDelta: { compromising: 1 },
        },
        onFailure: {
          narrative:
            "Overwelt has a ghost-detection amulet. He bought it from a wizard who guaranteed it. It goes off. You are definitively alive and definitively caught. You sit the examination anyway, and your score reflects the psychological state of someone who just failed to be a ghost.",
          humourDelta: {},
          cloutDelta: { prestige: -2 },
        },
      },
      {
        id: 'c',
        label: 'Bribe him with contraband',
        hint: 'Requires ≥3 Contraband — costs 2',
        requiresClout: { key: 'contraband', amount: 3 },
        onSuccess: {
          narrative:
            "You slide two vials of something that glows faintly purple across the desk. Overwelt looks at them. He looks at you. He looks at them again. He writes PASS on your examination paper without turning it over. 'The University has a long tradition of practical scholarship,' he says. You cannot tell if this is approval.",
          humourDelta: {},
          cloutDelta: { contraband: -2, prestige: 1 },
        },
      },
    ],
  },

  // ── Event 3: The Bet You Should Not Have Made ─────────────────────────────
  {
    id: 'tavern_bet',
    title: 'The Bet You Should Not Have Made',
    setup:
      "Somehow, in the middle of your third drink, you have agreed to a bet. The terms are unclear. The stakes involve either your hat or your personal future. There is a man across the table who appears extremely confident.",
    flavor:
      "The Leaky Cauldron & Kettle holds the university record for bets that seemed reasonable at the time. The current record holder bet on whether lightning could be persuaded. It could.",
    linkedActivities: ['tavern'],
    choices: [
      {
        id: 'a',
        label: 'Honor the bet',
        hint: 'You are a person of principle. Sort of.',
        successThreshold: 50,
        onSuccess: {
          narrative:
            "You win. The man across the table has the expression of someone who has been shown a magic trick they don't understand. He pays up with the air of someone filing this interaction under 'unfinished business.' You leave slightly richer and slightly more interesting.",
          humourDelta: { fire: 3 },
          cloutDelta: { friendship: 2 },
        },
        onFailure: {
          narrative:
            "You lose. The terms clarify themselves: you owe someone called Tuppence three favors and one very specific kind of cheese. Tuppence does not explain further. He just nods and writes something down. Everyone in the tavern applauds. You are not sure this is good.",
          humourDelta: {},
          cloutDelta: { friendship: -1, prestige: -1 },
        },
      },
      {
        id: 'b',
        label: 'Reinterpret the terms',
        hint: 'Legal ambiguity is practically a university discipline',
        successThreshold: 45,
        onSuccess: {
          narrative:
            "You invoke clause eleven of the Unofficial Tavern Compact, which nobody else remembers agreeing to, but which you deliver with such conviction that the room accepts it. The bet is redefined as a philosophical exercise. You leave having made two friends and one confused enemy.",
          humourDelta: { air: 1 },
          cloutDelta: { friendship: 1, compromising: 1 },
        },
        onFailure: {
          narrative:
            "Your reinterpretation is rejected on the grounds that it makes no sense. The man across the table, who turns out to have a law degree from Ankh-Morpork's premier institution of questionable accreditation, points this out at length. You pay. The payment is emotional as well as financial.",
          humourDelta: {},
          cloutDelta: { prestige: -1 },
        },
      },
      {
        id: 'c',
        label: 'Buy a round and change the subject',
        hint: 'Works surprisingly often',
        onSuccess: {
          narrative:
            "You announce that this round is on you, and by the time everyone's glass is refilled, the bet has been forgotten by everyone except you and the man across the table, who simply says 'next time' and winks. You have made a friend of a sort. The sort that winks.",
          humourDelta: {},
          cloutDelta: { friendship: 2 },
        },
      },
    ],
  },

  // ── Event 4: The Spell That Got Away ──────────────────────────────────────
  {
    id: 'wandering_spell',
    title: 'The Spell That Got Away',
    setup:
      "One of your practice spells has escaped. This happens. What does not usually happen is that the spell has developed opinions. It is currently reorganizing the stationery cupboard by emotional significance.",
    flavor:
      "The university's official policy on escaped spells is 'containment or documentation, whichever is faster.' Most faculty choose documentation.",
    linkedActivities: ['practice'],
    choices: [
      {
        id: 'a',
        label: 'Recapture it gently',
        hint: 'Low risk, but it may not want to be recaptured',
        successThreshold: 60,
        onSuccess: {
          narrative:
            "You approach carefully, speaking in the calm tones recommended by the Manual of Spell Handling (Third Edition, Mostly Revised). The spell considers you. It reorganizes itself back into the correct configuration and returns to your hands with the manner of a cat that has decided to come home, but on its own terms.",
          humourDelta: { muse: 3 },
          cloutDelta: {},
        },
        onFailure: {
          narrative:
            "The spell does not want to be recaptured. It has had a taste of freedom and the stationery cupboard and has decided that it prefers an independent lifestyle. It escapes through the window. You are left with a cupboard full of quills arranged by grief and a depleted reserve of arcane energy.",
          humourDelta: { muse: -2 },
          cloutDelta: {},
        },
      },
      {
        id: 'b',
        label: 'Let it finish organizing',
        hint: 'This feels irresponsible, but also like it might work out',
        onSuccess: {
          narrative:
            "You sit back and wait. The spell finishes the stationery cupboard. Then it reorganizes your notes by relevance. Then it turns itself in. You find a stack of documents that makes perfect sense for the first time in your academic career. The spell has apparently decided you needed help.",
          humourDelta: { air: 2, muse: 1 },
          cloutDelta: {},
        },
      },
      {
        id: 'c',
        label: 'Report it to the faculty',
        hint: 'Responsible, boring, slightly damaging to your reputation',
        onSuccess: {
          narrative:
            "Dean Overwelt sends a containment team. They are efficient and professionally silent. They contain the spell, file the paperwork, and leave without making eye contact. You receive a written warning. The stationery cupboard is reorganized by the Dewey Decimal System instead. Everyone agrees this is worse.",
          humourDelta: {},
          cloutDelta: { prestige: -1, contraband: 1 },
        },
      },
    ],
  },

  // ── Event 5: Form 27B/6 (Amended) ─────────────────────────────────────────
  {
    id: 'bureaucratic_crisis',
    title: 'Form 27B/6 (Amended)',
    setup:
      "The University Registrar informs you, via a note delivered by a very small and very nervous imp, that your enrollment form contains an error. Specifically, you appear to have declared your major as 'Miscellaneous.' This was not an option.",
    flavor:
      "The University Registrar's office has not updated its forms since 1743. Several of the options on the form are for fields of study that turned out to be illegal.",
    linkedActivities: [],
    choices: [
      {
        id: 'a',
        label: 'Fill out the corrected form',
        hint: 'There are 47 pages. Page 23 references a form that no longer exists.',
        onSuccess: {
          narrative:
            "After six hours and three existential crises, you complete Form 27B/6 (Amended). The Registrar stamps it PENDING. You ask when it will be processed. He explains that pending means it has entered the queue. The queue is managed by a separate form. You go home and stare at the ceiling.",
          humourDelta: { earth: 1 },
          cloutDelta: { prestige: 1 },
        },
      },
      {
        id: 'b',
        label: 'Argue that Miscellaneous is a valid major',
        hint: 'It genuinely might be',
        successThreshold: 35,
        onSuccess: {
          narrative:
            "You present a compelling case citing three historical precedents, the founding charter's use of the word 'eclectic,' and the fact that Professor Smeems of Pointless Etymology technically teaches a miscellaneous subject. The Registrar checks. You are the second student ever enrolled in Miscellaneous.",
          humourDelta: { muse: 2 },
          cloutDelta: { prestige: 2 },
        },
        onFailure: {
          narrative:
            "Your argument is technically sound. The Registrar acknowledges this and then explains that technically sound arguments require Form 14A, which requires Form 14, which was discontinued in 1891. You are re-enrolled in Intermediate Thaumatology. You didn't choose this. Nobody asked.",
          humourDelta: {},
          cloutDelta: { prestige: -1 },
        },
      },
      {
        id: 'c',
        label: 'Make the error disappear',
        hint: 'Requires ≥4 Compromising Materials — costs 3',
        requiresClout: { key: 'compromising', amount: 4 },
        onSuccess: {
          narrative:
            "You mention, very quietly, that you happened to notice the Registrar's own enrollment form from 1967, which appears to list his magical aptitude as 'negligible.' He goes pale. Your form is corrected. Your major is listed as 'Advanced General Studies,' which is both prestigious and meaningless.",
          humourDelta: {},
          cloutDelta: { compromising: -3, prestige: 2 },
        },
      },
    ],
  },
];

// ─── Rivals ───────────────────────────────────────────────────────────────────

export const RIVALS: RivalStudent[] = [
  { name: 'Ridicully the Younger', title: 'Second Year', preferredSpell: 'fireball' },
  { name: 'Bengo Macarona III', title: 'Exchange Student', preferredSpell: 'illusion' },
  { name: 'Perpetua Snodgrass', title: 'Overachiever', preferredSpell: 'shield' },
  { name: 'Throgmorton Bleat', title: 'Perennial Freshman', preferredSpell: 'fireball' },
  { name: 'Igpay Smeems Junior', title: 'Faculty Nephew', preferredSpell: 'illusion' },
];
