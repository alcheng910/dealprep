import { CompanyData } from '@/types/research';
import { scrapeWebsite } from '@/lib/integrations/firecrawl';
import { searchCompanyInfo } from '@/lib/integrations/tavily';

export async function extractCompanyIntel(
  companyUrl: string
): Promise<CompanyData> {
  try {
    // Scrape the company website
    const websiteData = await scrapeWebsite(companyUrl);

    // Get company name from URL
    const urlObj = new URL(companyUrl);
    const domain = urlObj.hostname.replace('www.', '');
    const companyName = domain.split('.')[0];

    // Search for company information
    const tavilyResults = await searchCompanyInfo(companyName, companyUrl);

    // Extract company summary from website and search results
    const summary = extractSummary(websiteData.markdown, tavilyResults.results);
    const industry = extractIndustry(websiteData.markdown, tavilyResults.results);
    const sizeEstimate = extractSizeEstimate(websiteData.markdown, tavilyResults.results);

    return {
      name: companyName.charAt(0).toUpperCase() + companyName.slice(1),
      url: companyUrl,
      summary,
      industry,
      size_estimate: sizeEstimate,
      evidence: [
        websiteData.url,
        ...tavilyResults.results.slice(0, 3).map((r) => r.url),
      ],
    };
  } catch (error) {
    console.error('Company intel extraction error:', error);
    throw new Error(`Failed to extract company intel: ${error}`);
  }
}

function extractSummary(markdown: string, searchResults: any[]): string {
  // Try to find a clear summary in the first few lines of markdown
  const lines = markdown.split('\n').filter((l) => l.trim().length > 50);

  if (lines.length > 0) {
    return lines[0].substring(0, 300);
  }

  // Fallback to search results
  if (searchResults.length > 0) {
    return searchResults[0].content.substring(0, 300);
  }

  return 'No summary available';
}

function extractIndustry(markdown: string, searchResults: any[]): string {
  const combined = markdown + ' ' + searchResults.map((r) => r.content).join(' ');
  const lowerText = combined.toLowerCase();

  // Industry keywords detection
  const industries: Record<string, string[]> = {
    'Technology': ['software', 'saas', 'platform', 'api', 'cloud', 'ai', 'machine learning'],
    'SaaS': ['saas', 'subscription', 'cloud-based', 'software as a service'],
    'Financial Services': ['fintech', 'banking', 'finance', 'payment', 'lending', 'investment'],
    'E-commerce': ['ecommerce', 'e-commerce', 'online store', 'marketplace', 'retail'],
    'Healthcare': ['health', 'medical', 'healthcare', 'hospital', 'patient'],
    'Education': ['education', 'learning', 'school', 'university', 'training'],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return industry;
      }
    }
  }

  return 'Technology';
}

function extractSizeEstimate(markdown: string, searchResults: any[]): string {
  const combined = markdown + ' ' + searchResults.map((r) => r.content).join(' ');

  // Look for employee count mentions
  const employeePatterns = [
    /(\d+)\+?\s*employees?/i,
    /team\s+of\s+(\d+)/i,
    /(\d+)\s*people/i,
  ];

  for (const pattern of employeePatterns) {
    const match = combined.match(pattern);
    if (match && match[1]) {
      const count = parseInt(match[1]);
      if (count < 50) return '1-50 employees';
      if (count < 200) return '50-200 employees';
      if (count < 1000) return '200-1000 employees';
      if (count < 5000) return '1000-5000 employees';
      return '5000+ employees';
    }
  }

  // Look for size indicators
  if (combined.match(/startup|early.?stage/i)) return '1-50 employees';
  if (combined.match(/enterprise|fortune|large.?company/i)) return '1000+ employees';

  return 'Unknown';
}
