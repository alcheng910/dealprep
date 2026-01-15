import { tavily } from '@tavily/core';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
  query: string;
}

export async function searchCompanyInfo(
  companyName: string,
  companyUrl: string
): Promise<TavilyResponse> {
  try {
    const query = `${companyName} company overview products services`;
    const response = await tvly.search(query, {
      maxResults: 5,
      searchDepth: 'advanced',
      includeAnswer: false,
    });

    return {
      query,
      results: response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    throw new Error(`Failed to search company info: ${error}`);
  }
}

export async function searchCompanyNews(
  companyName: string
): Promise<TavilyResponse> {
  try {
    const query = `${companyName} recent news funding launches 2026`;
    const response = await tvly.search(query, {
      maxResults: 5,
      searchDepth: 'basic',
      includeAnswer: false,
    });

    return {
      query,
      results: response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    };
  } catch (error) {
    console.error('Tavily news search error:', error);
    throw new Error(`Failed to search company news: ${error}`);
  }
}
