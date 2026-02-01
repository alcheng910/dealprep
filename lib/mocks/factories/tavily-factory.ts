import { TavilyResponse } from '@/lib/integrations/tavily';
import { CRE_COMPANIES } from '../data/cre-companies';
import { NEWS_TEMPLATES } from '../data/tech-news';

export function mockSearchCompanyInfo(
  companyName: string,
  companyUrl: string
): TavilyResponse {
  // Find matching company or create generic one
  const company = CRE_COMPANIES.find(c =>
    companyName.toLowerCase().includes(c.name.toLowerCase()) ||
    companyUrl.includes(c.domain)
  ) || {
    name: companyName,
    url: companyUrl,
    summary: `${companyName} is a commercial real estate company specializing in acquisitions, development, and asset management.`,
    industry: 'Commercial Real Estate',
    domain: new URL(companyUrl).hostname,
  };

  return {
    query: `${companyName} company overview products services`,
    results: [
      {
        title: `${company.name} - Company Overview`,
        url: company.url || companyUrl,
        content: company.summary,
        score: 0.95,
      },
      {
        title: `About ${company.name} | ${company.industry}`,
        url: `${company.url || companyUrl}/about`,
        content: `${company.name} provides comprehensive commercial real estate services including acquisitions, asset management, and investment advisory. The company has a proven track record of value creation through strategic investments and active asset management.`,
        score: 0.88,
      },
      {
        title: `${company.name} - Investment Philosophy`,
        url: `${company.url || companyUrl}/approach`,
        content: `Our investment approach focuses on identifying high-quality assets in growing markets with strong fundamentals. We leverage deep market knowledge and operational expertise to drive returns for our investors.`,
        score: 0.82,
      },
    ],
  };
}

export function mockSearchCompanyNews(companyName: string): TavilyResponse {
  // Select 2-3 random news templates
  const newsCount = 2 + Math.floor(Math.random() * 2);
  const selectedNews = NEWS_TEMPLATES
    .sort(() => Math.random() - 0.5)
    .slice(0, newsCount);

  return {
    query: `${companyName} recent news funding launches 2026`,
    results: selectedNews.map((template, i) => ({
      title: template.titlePattern(companyName),
      url: `https://commercialobserver.com/2026/01/${companyName.toLowerCase().replace(/\s+/g, '-')}-${template.category}-${i + 1}`,
      content: template.contentPattern(companyName),
      score: 0.85 + Math.random() * 0.1,
    })),
  };
}
