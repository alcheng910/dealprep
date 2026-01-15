import {
  EmailDraft,
  Contact,
  CompanyData,
  Initiative,
  HiringSignal,
} from '@/types/research';

export function generateEmails(
  company: CompanyData,
  contacts: Contact[],
  initiatives: Initiative[],
  hiringSignals: HiringSignal[],
  whatWeSell?: string
): EmailDraft[] {
  const emails: EmailDraft[] = [];

  for (const contact of contacts.slice(0, 3)) {
    // Generate 1 email per contact (max 3)
    const email = generatePersonalizedEmail(
      contact,
      company,
      initiatives,
      hiringSignals,
      whatWeSell
    );
    emails.push(email);
  }

  return emails;
}

function generatePersonalizedEmail(
  contact: Contact,
  company: CompanyData,
  initiatives: Initiative[],
  hiringSignals: HiringSignal[],
  whatWeSell?: string
): EmailDraft {
  const firstName = contact.name.split(' ')[0];
  const personalizationPoints: string[] = [];

  // Select most relevant signal
  const topInitiative = initiatives[0];
  const topHiringSignal = hiringSignals[0];

  // Build subject line
  const subject = topInitiative
    ? `${company.name} ${extractKeyword(topInitiative.title)}`
    : `Quick question about ${company.name}'s sales process`;

  // Build personalization points
  if (topInitiative) {
    personalizationPoints.push(`References: ${topInitiative.title}`);
  }
  if (topHiringSignal) {
    personalizationPoints.push(`Mentions: ${topHiringSignal.role} hiring`);
  }
  personalizationPoints.push(`Addresses: ${contact.title}`);

  // Build email body
  const body = buildEmailBody(
    firstName,
    company,
    contact,
    topInitiative,
    topHiringSignal,
    whatWeSell
  );

  return {
    subject,
    body,
    personalization_points: personalizationPoints,
  };
}

function buildEmailBody(
  firstName: string,
  company: CompanyData,
  contact: Contact,
  initiative: Initiative | undefined,
  hiringSignal: HiringSignal | undefined,
  whatWeSell?: string
): string {
  const value = whatWeSell || 'sales enablement solutions';

  let body = `Hi ${firstName},\n\n`;

  // Opening with specific signal
  if (initiative) {
    body += `I saw that ${company.name} recently ${extractKeyword(
      initiative.title
    ).toLowerCase()}. `;
    body += `${initiative.why_it_matters}\n\n`;
  } else if (hiringSignal) {
    body += `I noticed ${company.name} is hiring for ${hiringSignal.role}. `;
    body += `This usually signals growth and expansion.\n\n`;
  } else {
    body += `I've been following ${company.name} and impressed by your growth in the ${company.industry} space.\n\n`;
  }

  // Value prop
  body += `I work with companies like yours to ${value.toLowerCase()}. `;

  // Role-specific relevance
  if (contact.title.toLowerCase().includes('revenue')) {
    body += `Given your role in revenue operations, I thought this might be relevant.\n\n`;
  } else if (contact.title.toLowerCase().includes('sales')) {
    body += `Given your role leading sales, I thought this could help your team hit their numbers.\n\n`;
  } else {
    body += `Given your role, I thought this might be worth exploring.\n\n`;
  }

  // Call to action
  body += `Would you be open to a 15-minute call next week to discuss how we can support your goals?\n\n`;
  body += `Best,\n[Your Name]`;

  return body;
}

function extractKeyword(text: string): string {
  const keywords = text.toLowerCase();

  if (keywords.includes('funding')) return 'raised funding';
  if (keywords.includes('series')) return 'closed investment';
  if (keywords.includes('launch')) return 'launched';
  if (keywords.includes('partnership')) return 'partnered';
  if (keywords.includes('acquisition')) return 'acquired';
  if (keywords.includes('expansion')) return 'expanded';
  if (keywords.includes('hire')) return 'hired';

  return 'announced';
}
