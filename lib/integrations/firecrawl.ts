import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});

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
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['markdown', 'html'],
    });

    if (!result.success) {
      throw new Error('Failed to scrape website');
    }

    return {
      url: result.url || url,
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
        const result = await firecrawl.scrapeUrl(jobUrl, {
          formats: ['markdown'],
        });

        if (result.success && result.markdown) {
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
