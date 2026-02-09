import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const MOCK_MODE = process.env.MOCK_MODE === 'true';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const ANTHROPIC_MAX_TOKENS = parseInt(process.env.ANTHROPIC_MAX_TOKENS || '2000', 10);
const ANTHROPIC_TEMPERATURE = parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.85');

/**
 * Generate content using Claude API with system and user prompts
 */
export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Claude generateContent - returning mock hooks');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return getMockHooksResponse();
  }

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured. Add it to your .env file or enable MOCK_MODE=true for testing.');
  }

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      temperature: ANTHROPIC_TEMPERATURE,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text from the first content block
    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  } catch (error: any) {
    console.error('Claude API error:', error.message);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

/**
 * Get mock hooks response for testing without API key
 */
function getMockHooksResponse(): string {
  return `1. I noticed your company recently raised Series B funding - curious how that's changing your go-to-market strategy?

2. Saw you're hiring multiple sales roles - how's your team currently handling deal qualification and pipeline management?

3. Your recent expansion into the commercial real estate sector caught my attention. What's driving that strategic shift?

4. I noticed you're building out your sales development team. Are you finding it challenging to keep your growing team aligned on deal tracking?

5. With your company's growth trajectory in PropTech, how are you currently managing your deal flow and CRE transactions?

6. I see you're hiring for a VP of Sales - typically that signals scaling challenges. How's your current deal management infrastructure holding up?

7. Quick question: I work with commercial real estate companies scaling their operations. What's your biggest friction point in managing deals right now?

8. Your company's recent initiative around digital transformation - how is that impacting your sales and deal management processes?

9. I help CRE firms like yours streamline deal management. Would it be worth a quick conversation about your current approach?

10. Noticed your team is growing fast in a competitive market. Curious - what tools are you using to keep everyone on the same page with deals?`;
}
