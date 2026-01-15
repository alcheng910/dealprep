import { ICPEvaluation } from '@/types/icp';
import { CompanyData, TechStack, HiringSignal } from '@/types/research';
import { ICP_CRITERIA } from './criteria';

export function evaluateICP(
  company: CompanyData,
  techStack: TechStack[],
  hiringSignals: HiringSignal[]
): ICPEvaluation {
  const reasons: string[] = [];
  const disqualifiers: string[] = [];
  let score = 0;

  // Check for disqualifiers first (immediate fail)
  const companyText = (
    company.summary +
    ' ' +
    company.industry +
    ' ' +
    company.name
  ).toLowerCase();

  for (const disqualifier of ICP_CRITERIA.disqualifiers) {
    if (companyText.includes(disqualifier.toLowerCase())) {
      disqualifiers.push(
        `Company appears to be in ${disqualifier} sector (excluded from ICP)`
      );
    }
  }

  if (disqualifiers.length > 0) {
    return {
      fit: false,
      reasons: [],
      disqualifiers,
      score: 0,
    };
  }

  // Check industry fit
  const industryFit = ICP_CRITERIA.industries.some((industry) =>
    company.industry.toLowerCase().includes(industry.toLowerCase())
  );

  if (industryFit) {
    reasons.push(`Industry (${company.industry}) matches ICP criteria`);
    score += 30;
  } else {
    disqualifiers.push(
      `Industry (${company.industry}) does not match target industries`
    );
  }

  // Check company size
  const sizeMatch = checkCompanySize(company.size_estimate);
  if (sizeMatch.fit) {
    reasons.push(sizeMatch.reason);
    score += 20;
  } else {
    disqualifiers.push(sizeMatch.reason);
  }

  // Check tech stack alignment
  const techMatches = techStack.filter((tech) =>
    ICP_CRITERIA.required_tech.some((reqTech) =>
      tech.tech.toLowerCase().includes(reqTech.toLowerCase())
    )
  );

  if (techMatches.length > 0) {
    reasons.push(
      `Tech stack includes ${techMatches.length} relevant technologies (${techMatches
        .slice(0, 3)
        .map((t) => t.tech)
        .join(', ')})`
    );
    score += Math.min(techMatches.length * 10, 30);
  }

  // Check hiring signals
  if (hiringSignals.length >= ICP_CRITERIA.hiring_signals.min_open_roles) {
    reasons.push(
      `Active hiring (${hiringSignals.length} relevant roles) indicates growth`
    );
    score += 20;
  }

  // Determine overall fit
  // Must have industry fit OR strong tech + hiring signals
  const fit =
    disqualifiers.length === 0 &&
    (industryFit || (techMatches.length >= 2 && hiringSignals.length >= 2));

  return {
    fit,
    reasons,
    disqualifiers,
    score,
  };
}

function checkCompanySize(sizeEstimate: string): { fit: boolean; reason: string } {
  const { min_employees, max_employees } = ICP_CRITERIA.company_size;

  // Parse size estimate
  const sizeMatch = sizeEstimate.match(/(\d+)[-\s]*(\d+)?/);

  if (!sizeMatch) {
    return {
      fit: false,
      reason: 'Company size unknown - cannot verify fit',
    };
  }

  const minSize = parseInt(sizeMatch[1]);
  const maxSize = sizeMatch[2] ? parseInt(sizeMatch[2]) : minSize;

  if (maxSize < min_employees) {
    return {
      fit: false,
      reason: `Company too small (${sizeEstimate}) - ICP targets ${min_employees}+ employees`,
    };
  }

  if (minSize > max_employees) {
    return {
      fit: false,
      reason: `Company too large (${sizeEstimate}) - ICP targets under ${max_employees} employees`,
    };
  }

  return {
    fit: true,
    reason: `Company size (${sizeEstimate}) fits ICP range (${min_employees}-${max_employees} employees)`,
  };
}
