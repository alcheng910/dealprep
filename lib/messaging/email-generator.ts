import {
  Contact,
  CompanyData,
  Initiative,
  HiringSignal,
} from '@/types/research';
import { generateContent } from '@/lib/integrations/claude';

/**
 * Extract keyword from initiative title for email hooks
 */
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

/**
 * Generate 10 AI-powered email hooks using Claude API
 * Falls back to template-based hooks if API fails
 */
export async function generateEmailHooks(
  company: CompanyData,
  contacts: Contact[],
  initiatives: Initiative[],
  hiringSignals: HiringSignal[],
  whatWeSell?: string
): Promise<string[]> {
  const value = whatWeSell || 'CRE deal management';

  try {
    // Build context for Claude
    const firstContact = contacts[0];
    const topInitiatives = initiatives.slice(0, 3);
    const topSignals = hiringSignals.slice(0, 3);

    // Construct system prompt
    const systemPrompt = `You are an expert B2B sales email copywriter specializing in personalized outbound messaging. Your goal is to create compelling email opening lines (hooks) that grab attention and demonstrate research.`;

    // Construct user prompt
    let userPrompt = `Generate 10 different email opening lines (hooks) for reaching out to prospects at ${company.name}.

Context:
- Company: ${company.name} (${company.industry}, ${company.size_estimate || 'Unknown size'})
- What We Sell: ${value}`;

    if (firstContact) {
      userPrompt += `\n- Target Persona: ${firstContact.title}`;
    }

    if (topInitiatives.length > 0) {
      userPrompt += `\n- Recent Initiatives:`;
      topInitiatives.forEach((initiative, idx) => {
        userPrompt += `\n  ${idx + 1}. ${initiative.title} - ${initiative.why_it_matters}`;
      });
    }

    if (topSignals.length > 0) {
      userPrompt += `\n- Hiring Signals:`;
      topSignals.forEach((signal, idx) => {
        userPrompt += `\n  ${idx + 1}. ${signal.role} - ${signal.signal}`;
      });
    }

    userPrompt += `

Requirements:
1. Each hook should be 1-2 sentences maximum
2. Reference specific signals (initiatives, hiring, or industry context)
3. Create variety in tone and angle:
   - 3 hooks focused on strategic initiatives
   - 3 hooks focused on hiring/growth signals
   - 2 hooks focused on industry trends or pain points
   - 2 hooks using curiosity or questions
4. Make each hook distinctive - no repetition
5. Keep it conversational and authentic
6. Format: Return as numbered list (1., 2., 3., etc.)

Generate 10 hooks now:`;

    // Call Claude API
    const response = await generateContent(systemPrompt, userPrompt);

    // Parse hooks from response
    const hooks = parseHooksFromResponse(response);

    // Validate we have enough hooks, pad if needed
    if (hooks.length < 10) {
      console.warn(`Claude returned only ${hooks.length} hooks, padding with fallbacks`);
      const fallbackHooks = generateFallbackHooks(
        company,
        contacts,
        initiatives,
        hiringSignals,
        whatWeSell
      );
      while (hooks.length < 10 && fallbackHooks.length > 0) {
        hooks.push(fallbackHooks.shift()!);
      }
    }

    return hooks.slice(0, 10);
  } catch (error: any) {
    console.error('Failed to generate email hooks with Claude:', error.message);
    console.log('Falling back to template-based hooks');

    // Fallback to template-based hooks
    return generateFallbackHooks(
      company,
      contacts,
      initiatives,
      hiringSignals,
      whatWeSell
    );
  }
}

/**
 * Parse numbered hooks from Claude's response
 */
function parseHooksFromResponse(response: string): string[] {
  const hooks: string[] = [];
  const lines = response.split('\n');
  let currentHook = '';

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (match) {
      // New numbered item found
      if (currentHook) {
        hooks.push(currentHook.trim());
      }
      currentHook = match[2];
    } else if (currentHook && trimmed && !trimmed.match(/^(\d+)\./)) {
      // Continue previous hook (multi-line)
      currentHook += ' ' + trimmed;
    }
  }

  // Add the last hook
  if (currentHook) {
    hooks.push(currentHook.trim());
  }

  return hooks;
}

/**
 * Generate template-based hooks as fallback
 */
function generateFallbackHooks(
  company: CompanyData,
  contacts: Contact[],
  initiatives: Initiative[],
  hiringSignals: HiringSignal[],
  whatWeSell?: string
): string[] {
  const hooks: string[] = [];
  const value = whatWeSell || 'CRE deal management';
  const topInitiative = initiatives[0];
  const topSignal = hiringSignals[0];

  // Initiative-based hooks (3)
  if (topInitiative) {
    const keyword = extractKeyword(topInitiative.title);
    hooks.push(
      `I saw that ${company.name} recently ${keyword}. ${topInitiative.why_it_matters}?`,
      `Quick question about ${company.name}'s ${keyword} - how is that impacting your ${value.toLowerCase()} process?`,
      `Your recent ${keyword} caught my attention. Are you finding it challenging to manage the increased complexity?`
    );
  } else {
    hooks.push(
      `I've been following ${company.name}'s growth in ${company.industry}. How are you currently handling your ${value.toLowerCase()}?`,
      `Quick question: What's your biggest challenge with ${value.toLowerCase()} right now?`,
      `I work with ${company.industry} companies to streamline ${value.toLowerCase()}. Would love to learn about your current approach.`
    );
  }

  // Hiring-based hooks (3)
  if (topSignal) {
    hooks.push(
      `Noticed ${company.name} is hiring for ${topSignal.role}. Curious how your team is handling ${value.toLowerCase()} during this growth phase?`,
      `I see you're building out your team with ${topSignal.role} - typically that signals scaling challenges. How's your ${value.toLowerCase()} infrastructure holding up?`,
      `Your hiring for ${topSignal.role} suggests growth. Are you finding it hard to keep everyone aligned on deals?`
    );
  } else {
    hooks.push(
      `How is ${company.name} currently managing ${value.toLowerCase()} across the organization?`,
      `I noticed your company is in a growth phase. What tools are you using for ${value.toLowerCase()}?`,
      `Quick question about ${company.name}'s approach to ${value.toLowerCase()} - would you be open to a brief conversation?`
    );
  }

  // Industry/pain point hooks (2)
  hooks.push(
    `I work with ${company.industry} companies to ${value.toLowerCase()}. What's your biggest friction point right now?`,
    `Most ${company.industry} companies struggle with ${value.toLowerCase()} at scale. How are you solving this?`
  );

  // Curiosity/question hooks (2)
  hooks.push(
    `Would it be worth a quick conversation about how ${company.name} approaches ${value.toLowerCase()}?`,
    `Curious - what does your ${value.toLowerCase()} stack look like today?`
  );

  return hooks.slice(0, 10);
}
