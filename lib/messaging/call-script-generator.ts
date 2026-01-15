import {
  CallScript,
  CompanyData,
  Initiative,
  HiringSignal,
} from '@/types/research';

export function generateCallScript(
  company: CompanyData,
  initiatives: Initiative[],
  hiringSignals: HiringSignal[],
  whatWeSell?: string
): CallScript {
  const topInitiative = initiatives[0];
  const topHiringSignal = hiringSignals[0];
  const value = whatWeSell || 'sales enablement solutions';

  // Build opener
  const opener = buildOpener(company, topInitiative, topHiringSignal);

  // Build discovery questions
  const discoveryQuestions = buildDiscoveryQuestions(
    company,
    topInitiative,
    topHiringSignal
  );

  // Build objection handlers
  const objections = buildObjectionHandlers();

  return {
    opener,
    discovery_questions: discoveryQuestions,
    objections,
  };
}

function buildOpener(
  company: CompanyData,
  initiative: Initiative | undefined,
  hiringSignal: HiringSignal | undefined
): string {
  let opener = `Hi [Name], this is [Your Name] from [Company]. `;

  if (initiative) {
    opener += `I saw that ${company.name} recently ${extractAction(
      initiative.title
    )}. `;
    opener += `I work with companies in similar situations to help them ${getValueProp()}. `;
  } else if (hiringSignal) {
    opener += `I noticed you're hiring for ${hiringSignal.role} roles. `;
    opener += `We work with growing teams like yours to ${getValueProp()}. `;
  } else {
    opener += `I work with ${company.industry} companies to ${getValueProp()}. `;
  }

  opener += `Do you have 2 minutes to chat?`;

  return opener;
}

function buildDiscoveryQuestions(
  company: CompanyData,
  initiative: Initiative | undefined,
  hiringSignal: HiringSignal | undefined
): string[] {
  const questions: string[] = [];

  // Opening questions
  questions.push(
    `Tell me about your current sales process - how does your team typically approach outbound?`
  );

  // Context-specific questions
  if (initiative) {
    questions.push(
      `With the recent ${extractAction(
        initiative.title
      )}, how is that impacting your sales strategy?`
    );
  }

  if (hiringSignal) {
    questions.push(
      `You're hiring for ${hiringSignal.role} - what's driving that growth right now?`
    );
  }

  // Standard discovery questions
  questions.push(
    `What are the biggest challenges your sales team faces today?`
  );

  questions.push(
    `How do you currently handle prospect research and prep for your reps?`
  );

  questions.push(
    `If you could wave a magic wand, what would you change about your current process?`
  );

  return questions.slice(0, 5);
}

function buildObjectionHandlers(): string[] {
  return [
    `"We're not interested" → "I understand. Can I ask - is it that the timing isn't right, or is it that this isn't a priority for your team?"`,
    `"Send me some information" → "Happy to. Just so I send the right materials - what specifically would you want to see? A case study, a demo video, or pricing?"`,
    `"We're happy with our current solution" → "That's great to hear. Out of curiosity, how long have you been using it, and is there anything you wish it did better?"`,
    `"We don't have budget" → "Totally understand. When does your next budget cycle open up? I'd love to stay in touch for when the timing is better."`,
    `"Can you email me?" → "Absolutely. Before I do - I want to make sure I send you something relevant. What's your biggest pain point right now?"`,
  ];
}

function extractAction(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('funding') || lower.includes('series')) return 'raised funding';
  if (lower.includes('launch')) return 'launched a new product';
  if (lower.includes('partnership')) return 'announced a partnership';
  if (lower.includes('acquisition')) return 'made an acquisition';
  if (lower.includes('expansion')) return 'expanded operations';

  return 'made an announcement';
}

function getValueProp(): string {
  return 'accelerate their sales process with better prospect research and preparation';
}
