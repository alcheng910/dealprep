import { HiringSignal } from '@/types/research';
import { crawlForJobs } from '@/lib/integrations/firecrawl';

export async function detectHiringSignals(
  companyUrl: string
): Promise<HiringSignal[]> {
  try {
    const jobs = await crawlForJobs(companyUrl);
    const signals: HiringSignal[] = [];

    for (const job of jobs) {
      const signal = analyzeJobForSignal(job.title, job.url);
      if (signal) {
        signals.push(signal);
      }
    }

    // Deduplicate by department
    const uniqueSignals = deduplicateByDepartment(signals);

    return uniqueSignals.slice(0, 5); // Return top 5 signals
  } catch (error) {
    console.error('Hiring signal detection error:', error);
    return []; // Return empty array on error
  }
}

function analyzeJobForSignal(title: string, sourceUrl: string): HiringSignal | null {
  const lowerTitle = title.toLowerCase();

  // Sales-related roles (high priority for sales prep)
  if (
    lowerTitle.includes('sales') ||
    lowerTitle.includes('revenue') ||
    lowerTitle.includes('account executive') ||
    lowerTitle.includes('business development')
  ) {
    return {
      role: title,
      signal: 'Sales team expansion indicates growth and potential budget for sales tools',
      source_url: sourceUrl,
    };
  }

  // Engineering roles
  if (
    lowerTitle.includes('engineer') ||
    lowerTitle.includes('developer') ||
    lowerTitle.includes('software')
  ) {
    return {
      role: title,
      signal: 'Engineering hiring suggests product development and tech stack growth',
      source_url: sourceUrl,
    };
  }

  // Marketing roles
  if (
    lowerTitle.includes('marketing') ||
    lowerTitle.includes('growth') ||
    lowerTitle.includes('demand gen')
  ) {
    return {
      role: title,
      signal: 'Marketing expansion indicates go-to-market investment',
      source_url: sourceUrl,
    };
  }

  // Leadership roles
  if (
    lowerTitle.includes('vp') ||
    lowerTitle.includes('director') ||
    lowerTitle.includes('head of') ||
    lowerTitle.includes('chief')
  ) {
    return {
      role: title,
      signal: 'Leadership hire often signals strategic priorities and budget allocation',
      source_url: sourceUrl,
    };
  }

  // Operations roles
  if (
    lowerTitle.includes('operations') ||
    lowerTitle.includes('ops') ||
    lowerTitle.includes('analyst')
  ) {
    return {
      role: title,
      signal: 'Ops team growth indicates scaling and process improvement focus',
      source_url: sourceUrl,
    };
  }

  return null;
}

function deduplicateByDepartment(signals: HiringSignal[]): HiringSignal[] {
  const seen = new Set<string>();
  const unique: HiringSignal[] = [];

  for (const signal of signals) {
    const department = extractDepartment(signal.role);
    if (!seen.has(department)) {
      seen.add(department);
      unique.push(signal);
    }
  }

  return unique;
}

function extractDepartment(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sales') || lowerTitle.includes('revenue')) return 'sales';
  if (lowerTitle.includes('engineer') || lowerTitle.includes('developer')) return 'engineering';
  if (lowerTitle.includes('marketing') || lowerTitle.includes('growth')) return 'marketing';
  if (lowerTitle.includes('product')) return 'product';
  if (lowerTitle.includes('operations') || lowerTitle.includes('ops')) return 'operations';

  return title;
}
