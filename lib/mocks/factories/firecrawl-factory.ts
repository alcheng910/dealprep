import { CRE_COMPANIES } from '../data/cre-companies';
import { CRE_JOB_TITLES } from '../data/job-postings';

export interface FirecrawlPage {
  url: string;
  markdown: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
  };
}

export interface FirecrawlJobPosting {
  title: string;
  url: string;
}

export function mockScrapeWebsite(url: string): FirecrawlPage {
  // Extract domain from URL
  let domain = '';
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch {
    domain = url;
  }

  const company = CRE_COMPANIES.find(c => domain.includes(c.domain)) || CRE_COMPANIES[0];

  return {
    url,
    markdown: company.websiteMarkdown || `# ${company.name}\n\n${company.summary}\n\n## Services\n- Acquisitions\n- Asset Management\n- Development\n\n## About Us\nWe are a leading commercial real estate firm with expertise across all major property types.`,
    html: `<html><body><h1>${company.name}</h1><p>${company.summary}</p></body></html>`,
    metadata: {
      title: `${company.name} - ${company.industry}`,
      description: company.summary,
      language: 'en',
    },
  };
}

export function mockCrawlForJobs(companyUrl: string): FirecrawlJobPosting[] {
  // Return 3-7 random CRE job postings
  const jobCount = 3 + Math.floor(Math.random() * 5);
  const selectedJobs = CRE_JOB_TITLES
    .sort(() => Math.random() - 0.5)
    .slice(0, jobCount);

  return selectedJobs.map(title => ({
    title,
    url: `${companyUrl}/careers/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
  }));
}
