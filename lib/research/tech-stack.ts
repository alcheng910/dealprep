import { TechStack } from '@/types/research';
import { scrapeWebsite } from '@/lib/integrations/firecrawl';

export async function inferTechStack(companyUrl: string): Promise<TechStack[]> {
  try {
    const websiteData = await scrapeWebsite(companyUrl);
    const techStack: TechStack[] = [];

    // Analyze HTML and markdown for tech indicators
    const htmlContent = websiteData.html || '';
    const markdown = websiteData.markdown || '';
    const combined = htmlContent + ' ' + markdown;

    // Frontend technologies
    const frontendTech = detectFrontendTech(htmlContent);
    techStack.push(...frontendTech.map(tech => ({
      tech: tech.name,
      confidence: tech.confidence,
      source_url: companyUrl,
    })));

    // Backend/infrastructure from job postings and content
    const backendTech = detectBackendTech(combined);
    techStack.push(...backendTech.map(tech => ({
      tech: tech.name,
      confidence: tech.confidence,
      source_url: companyUrl,
    })));

    // Cloud providers
    const cloudTech = detectCloudProviders(combined);
    techStack.push(...cloudTech.map(tech => ({
      tech: tech.name,
      confidence: tech.confidence,
      source_url: companyUrl,
    })));

    return techStack.slice(0, 10); // Return top 10
  } catch (error) {
    console.error('Tech stack inference error:', error);
    return []; // Return empty array on error
  }
}

interface TechDetection {
  name: string;
  confidence: 'high' | 'medium' | 'low';
}

function detectFrontendTech(html: string): TechDetection[] {
  const techs: TechDetection[] = [];
  const lowerHtml = html.toLowerCase();

  if (lowerHtml.includes('react')) {
    techs.push({ name: 'React', confidence: 'high' });
  }
  if (lowerHtml.includes('vue')) {
    techs.push({ name: 'Vue.js', confidence: 'medium' });
  }
  if (lowerHtml.includes('angular')) {
    techs.push({ name: 'Angular', confidence: 'medium' });
  }
  if (lowerHtml.includes('next')) {
    techs.push({ name: 'Next.js', confidence: 'medium' });
  }
  if (lowerHtml.includes('_next') || lowerHtml.includes('__next')) {
    techs.push({ name: 'Next.js', confidence: 'high' });
  }
  if (lowerHtml.includes('gatsby')) {
    techs.push({ name: 'Gatsby', confidence: 'medium' });
  }

  return techs;
}

function detectBackendTech(content: string): TechDetection[] {
  const techs: TechDetection[] = [];
  const lowerContent = content.toLowerCase();

  const techPatterns = [
    { pattern: /\bnode\.?js\b/i, name: 'Node.js', confidence: 'medium' as const },
    { pattern: /\bpython\b/i, name: 'Python', confidence: 'low' as const },
    { pattern: /\bdjango\b/i, name: 'Django', confidence: 'medium' as const },
    { pattern: /\bruby\b.*\brails\b/i, name: 'Ruby on Rails', confidence: 'medium' as const },
    { pattern: /\bpostgres\b/i, name: 'PostgreSQL', confidence: 'medium' as const },
    { pattern: /\bmongo\b/i, name: 'MongoDB', confidence: 'medium' as const },
    { pattern: /\bredis\b/i, name: 'Redis', confidence: 'low' as const },
    { pattern: /\bgraphql\b/i, name: 'GraphQL', confidence: 'medium' as const },
    { pattern: /\bkubernetes\b/i, name: 'Kubernetes', confidence: 'medium' as const },
    { pattern: /\bdocker\b/i, name: 'Docker', confidence: 'low' as const },
  ];

  for (const { pattern, name, confidence } of techPatterns) {
    if (pattern.test(lowerContent)) {
      techs.push({ name, confidence });
    }
  }

  return techs;
}

function detectCloudProviders(content: string): TechDetection[] {
  const techs: TechDetection[] = [];
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('aws') || lowerContent.includes('amazon web services')) {
    techs.push({ name: 'AWS', confidence: 'medium' });
  }
  if (lowerContent.includes('azure') || lowerContent.includes('microsoft cloud')) {
    techs.push({ name: 'Azure', confidence: 'medium' });
  }
  if (lowerContent.includes('google cloud') || lowerContent.includes('gcp')) {
    techs.push({ name: 'Google Cloud', confidence: 'medium' });
  }
  if (lowerContent.includes('vercel')) {
    techs.push({ name: 'Vercel', confidence: 'medium' });
  }
  if (lowerContent.includes('netlify')) {
    techs.push({ name: 'Netlify', confidence: 'medium' });
  }

  return techs;
}
