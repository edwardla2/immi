// knowledge.ts
// CRITICAL: This is reference content for an AI navigator, NOT legal advice.
// Every figure tagged [VERIFY] must be confirmed against the official source URL
// before it is relied upon. Immigration fees and rules change frequently.
// Re-verify everything older than ~60 days.

export interface KnowledgeChunk {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
  source: string; // official URL
  lastVerified: string; // YYYY-MM-DD
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'opt-overview',
    topic: 'Post-completion OPT basics',
    keywords: ['opt', 'optional practical training', 'work', 'f-1', 'ead', 'i-765'],
    content: `Post-completion OPT is temporary work authorization for F-1 students, giving up to 12 months of work directly related to the field of study. You apply with USCIS using Form I-765 and, if approved, receive an Employment Authorization Document (EAD). Your DSO must first enter an OPT recommendation in your SEVIS record before you file. [VERIFY] Filing window: you may file Form I-765 starting 90 days before your program end date and up to 60 days after it. [VERIFY] You must file within 30 days of your DSO's SEVIS recommendation or the application can be denied. You cannot begin work until you receive your EAD and your OPT start date has arrived.`,
    source:
      'https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/f-1-optional-practical-training-opt',
    lastVerified: '2026-06-09',
  },
  {
    id: 'opt-fee',
    topic: 'I-765 filing fee for OPT',
    keywords: ['fee', 'cost', 'i-765', 'how much', 'price', 'payment'],
    content: `[VERIFY] The Form I-765 filing fee is $470 when filed online through myUSCIS and $520 when filed by paper. (This increased from $410 in April 2024.) There is no separate biometrics fee for the (c)(3) OPT categories. [VERIFY] Optional premium processing for eligible I-765 OPT/STEM cases costs $1,780 as of March 1, 2026 (up from $1,685) and is requested with Form I-907. Always confirm the current fee on the USCIS fee schedule before filing, as fees change.`,
    source: 'https://www.uscis.gov/i-765',
    lastVerified: '2026-06-09',
  },
  {
    id: 'opt-processing-unemployment',
    topic: 'OPT processing time and unemployment limits',
    keywords: ['processing time', 'how long', 'unemployment', 'days', 'wait', 'ead arrive'],
    content: `[VERIFY] OPT EAD processing typically takes roughly 3-5 months; always check the live USCIS Processing Times tool for the current estimate rather than relying on a fixed number. [VERIFY] Unemployment limits: standard post-completion OPT allows up to 90 days of unemployment; with a STEM OPT extension the cumulative limit is 150 days total. Exceeding the limit is a status violation. Certain activities (e.g. some unpaid work of 20+ hours/week) can stop the unemployment clock — confirm specifics with a DSO.`,
    source: 'https://egov.uscis.gov/processing-times/',
    lastVerified: '2026-06-09',
  },
  {
    id: 'stem-opt-overview',
    topic: 'STEM OPT 24-month extension',
    keywords: ['stem', 'extension', '24 month', 'i-983', 'e-verify', 'stem opt'],
    content: `Students with a degree on the DHS STEM Designated Degree Program list may apply for a 24-month STEM OPT extension on top of their initial 12-month OPT. Requirements: the degree must be STEM-list eligible; the employer must be enrolled in E-Verify before you file; you and the employer must complete a Form I-983 training plan tying the job to your degree; and the job must be paid, at least 20 hours/week, with a bona fide employer-employee relationship (no self-employment). Your DSO must recommend the STEM extension in SEVIS before you file Form I-765.`,
    source:
      'https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/f-1-stem-optional-practical-training-opt',
    lastVerified: '2026-06-09',
  },
  {
    id: 'stem-opt-timing',
    topic: 'STEM OPT filing timing and 180-day rule',
    keywords: [
      'stem deadline',
      'file before',
      '180 days',
      'expire',
      'timely filed',
      'continue working',
    ],
    content: `You must file the STEM OPT extension before your current OPT EAD expires. [VERIFY] If USCIS receives your timely-filed I-765 before your OPT EAD expires, your work authorization is automatically extended for up to 180 days while the application is pending. If your application is not received before your EAD expires, you do NOT get the 180-day extension — so file early. You can file the STEM extension up to 90 days before your current OPT EAD expiration.`,
    source:
      'https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/f-1-stem-optional-practical-training-opt',
    lastVerified: '2026-06-09',
  },
  {
    id: 'stem-opt-documents',
    topic: 'Documents typically needed for a STEM OPT filing',
    keywords: ['stem documents', 'documents', 'checklist', 'what do i need', 'i-983', 'i-20'],
    content: `A STEM OPT extension filing typically involves: a completed Form I-983 training plan (signed by you and your employer) given to your DSO; a new I-20 with the DSO's STEM OPT recommendation; Form I-765 (category (c)(6)) with the filing fee; a copy of your current EAD card; copies of your degree/diploma or transcript evidencing the STEM degree; passport-style photos if filing by paper; and copies of your passport ID page and most recent visa/I-94. [VERIFY] Exact evidence requirements are listed in the I-765 instructions — confirm the current checklist there before filing.`,
    source: 'https://www.uscis.gov/i-765',
    lastVerified: '2026-06-09',
  },
  {
    id: 'f1-grace-periods',
    topic: 'F-1 grace periods',
    keywords: ['grace period', '60 days', 'after opt', 'leave the us', 'stay after', 'program end'],
    content: `[VERIFY] After completing a program of study or post-completion OPT, F-1 students generally have a 60-day grace period to depart the US, change status, transfer to another program, or begin a new course of study. You cannot work during the grace period. [VERIFY] If OPT is cut short by exceeding unemployment limits or a denial, the grace period rules differ — confirm the specific situation with a DSO before relying on any grace period.`,
    source: 'https://studyinthestates.dhs.gov/',
    lastVerified: '2026-06-09',
  },
  {
    id: 'ead-auto-extension-change',
    topic: 'IMPORTANT recent change — EAD automatic extension',
    keywords: ['ead extension', 'automatic extension', 'renewal', 'policy change', '2025'],
    content: `[VERIFY — MATERIAL RECENT CHANGE] A federal rule published October 30, 2025 (90 FR 48799) addresses removal of the automatic extension of certain Employment Authorization Documents. This may affect EAD renewals. This area is in active flux — DO NOT advise on EAD auto-extension without confirming the current rule on uscis.gov, and recommend the user verify with their DSO or an attorney.`,
    source: 'https://www.uscis.gov/i-765',
    lastVerified: '2026-06-09',
  },

  // ===== H-1B — SCAFFOLD: fill from official sources, keep [VERIFY], do not invent =====
  {
    id: 'h1b-overview',
    topic: 'H-1B specialty occupation visa basics',
    keywords: ['h-1b', 'h1b', 'work visa', 'sponsor', 'employer', 'specialty occupation'],
    content: `H-1B is an employer-sponsored visa for specialty occupations generally requiring at least a bachelor's degree in a specific field. The employer files Form I-129. [VERIFY] Most cap-subject petitions require first being selected in the annual electronic registration (lottery); confirm current registration window, registration fee, and cap numbers on uscis.gov. [VERIFY — TODO: confirm current H-1B registration fee, the annual cap (65,000 + 20,000 advanced-degree exemption), and current-season dates before stating any of these to a user.]`,
    source: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations',
    lastVerified: '2026-06-09',
  },
  {
    id: 'h1b-capgap',
    topic: 'Cap-gap for F-1 students moving to H-1B',
    keywords: ['cap gap', 'cap-gap', 'opt to h1b', 'october 1', 'bridge'],
    content: `[VERIFY] Cap-gap can extend an eligible F-1 student's status and (in some cases) work authorization through the start of the H-1B fiscal year when a timely cap-subject H-1B petition requesting a change of status was filed while the student's status/OPT was valid. The exact conditions and dates are specific — confirm current cap-gap rules on uscis.gov / Study in the States before advising, and recommend DSO confirmation.`,
    source: 'https://studyinthestates.dhs.gov/',
    lastVerified: '2026-06-09',
  },
  {
    id: 'h1b-portability',
    topic: 'H-1B transfers and portability',
    keywords: ['transfer', 'change employer', 'portability', 'new job h1b', 'switch jobs'],
    content: `[VERIFY] H-1B portability generally allows someone already in valid H-1B status to begin working for a new employer once the new employer's non-frivolous I-129 petition is properly filed with USCIS (not approved), provided the person was lawfully admitted and maintained status. [VERIFY — TODO: confirm current portability conditions and any documentation nuances on uscis.gov before stating specifics.] Changing employers is a common point where an attorney adds real value — recommend one for anything beyond a straightforward transfer.`,
    source: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations',
    lastVerified: '2026-06-09',
  },

  // ===== GREEN CARD — SCAFFOLD: fill from official sources, keep [VERIFY], do not invent =====
  {
    id: 'gc-paths-overview',
    topic: 'Green card (permanent residence) paths',
    keywords: [
      'green card',
      'permanent residence',
      'i-485',
      'i-140',
      'priority date',
      'visa bulletin',
    ],
    content: `The two main green card paths are family-based and employment-based. Employment-based commonly involves (depending on category) PERM labor certification, an employer-filed Form I-140, and then either adjustment of status in the US (Form I-485) or consular processing abroad. [VERIFY] Whether you can file depends on your priority date being current per the monthly Visa Bulletin, which varies by category and country of birth. These timelines are highly variable — direct users to the current Visa Bulletin and recommend an attorney for strategy.`,
    source: 'https://www.uscis.gov/green-card',
    lastVerified: '2026-06-09',
  },
  {
    id: 'gc-visa-bulletin',
    topic: 'Visa Bulletin and priority dates',
    keywords: ['visa bulletin', 'priority date', 'current', 'backlog', 'wait time green card'],
    content: `[VERIFY] The Department of State publishes a monthly Visa Bulletin with cutoff/priority dates that determine when an immigrant visa or adjustment of status can move forward, by category and country. Backlogs can be long, especially for high-demand countries. Always point the user to the current month's Visa Bulletin rather than quoting a wait time, and note this is an area where an attorney adds real value.`,
    source: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
    lastVerified: '2026-06-09',
  },
  {
    id: 'gc-i485-work-travel',
    topic: 'Work and travel while I-485 is pending',
    keywords: ['i-485 pending', 'work while pending', 'advance parole', 'i-131', 'travel green card'],
    content: `[VERIFY] Applicants with a pending I-485 commonly file Form I-765 (work authorization) and Form I-131 (advance parole travel document) alongside or after the I-485. Traveling abroad while the I-485 is pending without advance parole can be treated as abandoning the application for many categories (H-1B/L-1 holders may have different options). [VERIFY — TODO: confirm current combo-card practice, fees, and travel rules on uscis.gov before stating specifics.] This is high-stakes — recommend attorney confirmation before any international travel with a pending I-485.`,
    source: 'https://www.uscis.gov/green-card/green-card-processes-and-procedures/travel-documents',
    lastVerified: '2026-06-09',
  },
];

export function retrieveKnowledge(
  query: string,
  userVisaType?: string | null,
  maxChunks = 4
): KnowledgeChunk[] {
  const q = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (q.includes(kw)) score += 2;
    }
    // light boost for chunks matching the user's visa type
    if (userVisaType) {
      const vt = userVisaType.toLowerCase();
      if (chunk.keywords.some((k) => vt.includes(k) || k.includes(vt.replace('_', ' ')))) {
        score += 1;
      }
    }
    return { chunk, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((s) => s.chunk);
}
