import FirecrawlApp from '@mendable/firecrawl-js';
import {
  mockScrapeWebsite,
  mockCrawlForJobs,
} from '@/lib/mocks';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});
const MOCK_MODE = process.env.MOCK_MODE === 'true';

export interface FirecrawlPage {
  url: string;
  markdown: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    ogImage?: string;
  };
}

export interface FirecrawlJobPosting {
  title: string;
  department?: string;
  location?: string;
  url: string;
}

export async function scrapeWebsite(url: string): Promise<FirecrawlPage> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Firecrawl scrapeWebsite - returning fake data');
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockScrapeWebsite(url);
  }

  try {
    const result: any = await firecrawl.scrape(url, {
      formats: ['markdown', 'html'],
    });

    // v2 API returns data directly without success wrapper
    if (!result.markdown) {
      const errorMsg = result.error || 'Failed to scrape website';
      throw new Error(`Firecrawl error: ${errorMsg}`);
    }

    return {
      url: result.metadata?.url || result.url || url,
      markdown: result.markdown || '',
      html: result.html,
      metadata: result.metadata,
    };
  } catch (error) {
    console.error('Firecrawl scrape error:', error);
    throw new Error(`Failed to scrape website: ${error}`);
  }
}

export async function crawlForJobs(
  companyUrl: string
): Promise<FirecrawlJobPosting[]> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Firecrawl crawlForJobs - returning fake data');
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCrawlForJobs(companyUrl);
  }

  try {
    // Try common job posting URL patterns
    const jobUrls = [
      `${companyUrl}/careers`,
      `${companyUrl}/jobs`,
      `${companyUrl}/about/careers`,
    ];

    const jobs: FirecrawlJobPosting[] = [];

    for (const jobUrl of jobUrls) {
      try {
        const result: any = await firecrawl.scrape(jobUrl, {
          formats: ['markdown'],
        });

        if (result.markdown) {
          // Simple parsing - look for job titles in the markdown
          const lines = result.markdown.split('\n');
          const jobPattern = /engineer|developer|manager|director|vp|sales|marketing|analyst/i;

          lines.forEach((line) => {
            if (jobPattern.test(line) && line.length < 100) {
              jobs.push({
                title: line.trim(),
                url: jobUrl,
              });
            }
          });

          if (jobs.length > 0) break; // Found jobs, no need to check other URLs
        }
      } catch (err) {
        // Continue to next URL
        continue;
      }
    }

    return jobs.slice(0, 10); // Return max 10 jobs
  } catch (error) {
    console.error('Firecrawl job crawl error:', error);
    return []; // Return empty array on error (non-critical)
  }
}
