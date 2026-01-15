import { Initiative } from '@/types/research';
import { searchCompanyNews } from '@/lib/integrations/tavily';

export async function extractInitiatives(
  companyName: string
): Promise<Initiative[]> {
  try {
    const newsResults = await searchCompanyNews(companyName);

    const initiatives: Initiative[] = [];

    for (const result of newsResults.results.slice(0, 5)) {
      const initiative = analyzeForInitiative(result.title, result.content, result.url);
      if (initiative) {
        initiatives.push(initiative);
      }
    }

    return initiatives;
  } catch (error) {
    console.error('Initiative extraction error:', error);
    return []; // Return empty array on error (non-critical)
  }
}

function analyzeForInitiative(
  title: string,
  content: string,
  sourceUrl: string
): Initiative | null {
  const combined = (title + ' ' + content).toLowerCase();

  // Initiative keywords that indicate strategic moves
  const initiativeKeywords = [
    { keyword: 'funding', why: 'Recent funding indicates growth plans and increased budget' },
    { keyword: 'series', why: 'Investment round suggests expansion and hiring' },
    { keyword: 'launch', why: 'New product launch shows innovation and market expansion' },
    { keyword: 'partnership', why: 'Strategic partnership indicates new market or capability' },
    { keyword: 'acquisition', why: 'Acquisition shows growth strategy and integration needs' },
    { keyword: 'expansion', why: 'Geographic or market expansion creates new opportunities' },
    { keyword: 'hiring', why: 'Hiring surge indicates growth and potential budget' },
    { keyword: 'new feature', why: 'Feature development shows product investment' },
    { keyword: 'new hire', why: 'Leadership hire often signals strategic shift' },
    { keyword: 'executive', why: 'Executive changes can create new buying opportunities' },
  ];

  for (const { keyword, why } of initiativeKeywords) {
    if (combined.includes(keyword)) {
      return {
        title: title.substring(0, 150),
        why_it_matters: why,
        source_url: sourceUrl,
      };
    }
  }

  // If no specific keyword but news is recent and substantive, include it
  if (content.length > 200) {
    return {
      title: title.substring(0, 150),
      why_it_matters: 'Recent company activity that may indicate strategic priorities',
      source_url: sourceUrl,
    };
  }

  return null;
}
