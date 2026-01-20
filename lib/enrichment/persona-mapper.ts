import { Persona } from '@/types/research';

export function identifyTargetPersonas(
  industry: string,
  whatWeSell?: string,
  targetPersona?: string
): Persona[] {
  // Define personas based on what we're selling
  const personas: Persona[] = [];

  // If custom persona is provided, use it as the primary target
  if (targetPersona) {
    // Check if it's a CRE-focused persona
    const lowerPersona = targetPersona.toLowerCase();

    if (lowerPersona.includes('acquisition') && (lowerPersona.includes('associate') || lowerPersona.includes('analyst'))) {
      // CRE deal management personas
      personas.push({
        persona: 'Acquisitions Associate',
        why: 'Handles deal sourcing, analysis, and due diligence for property acquisitions',
      });

      personas.push({
        persona: 'Acquisitions Analyst',
        why: 'Analyzes investment opportunities and manages deal pipeline data',
      });

      personas.push({
        persona: 'Director of Acquisitions',
        why: 'Oversees acquisition strategy and team, evaluates deal management tools',
      });
    } else {
      // Generic custom persona
      personas.push({
        persona: targetPersona,
        why: 'Target decision maker based on your specified criteria',
      });

      // Add related personas based on the custom persona
      if (lowerPersona.includes('vp') || lowerPersona.includes('director') || lowerPersona.includes('head')) {
        personas.push({
          persona: `Manager reporting to ${targetPersona}`,
          why: 'Potential influencer or user of the solution',
        });
      }
    }
  } else if (whatWeSell && whatWeSell.toLowerCase().includes('cre')) {
    // CRE deal management system (default)
    personas.push({
      persona: 'Acquisitions Associate',
      why: 'Handles deal sourcing, analysis, and due diligence for property acquisitions',
    });

    personas.push({
      persona: 'Acquisitions Analyst',
      why: 'Analyzes investment opportunities and manages deal pipeline data',
    });

    personas.push({
      persona: 'Director of Acquisitions',
      why: 'Oversees acquisition strategy and team, evaluates deal management tools',
    });
  } else {
    // Sales tool personas (fallback)
    personas.push({
      persona: 'VP of Sales / Chief Revenue Officer',
      why: 'Decision maker for sales tools and processes, owns revenue targets',
    });

    personas.push({
      persona: 'Head of Revenue Operations',
      why: 'Manages sales tech stack, evaluates tools for efficiency and data quality',
    });

    personas.push({
      persona: 'Sales Enablement Manager',
      why: 'Responsible for training and tools that improve sales team productivity',
    });
  }

  return personas.slice(0, 3); // Return top 3
}

export function mapPersonaToSearchTitles(persona: string): string[] {
  const lowerPersona = persona.toLowerCase();

  // CRE Acquisitions personas
  if (lowerPersona.includes('acquisition') && lowerPersona.includes('associate')) {
    return [
      'Acquisitions Associate',
      'Acquisition Associate',
      'Real Estate Acquisitions Associate',
      'Acquisitions Coordinator',
      'Acquisitions Specialist',
    ];
  }

  if (lowerPersona.includes('acquisition') && lowerPersona.includes('analyst')) {
    return [
      'Acquisitions Analyst',
      'Acquisition Analyst',
      'Real Estate Acquisitions Analyst',
      'Investment Analyst',
      'Deal Analyst',
    ];
  }

  if (lowerPersona.includes('acquisition') && (lowerPersona.includes('director') || lowerPersona.includes('head'))) {
    return [
      'Director of Acquisitions',
      'Head of Acquisitions',
      'VP of Acquisitions',
      'SVP Acquisitions',
      'Chief Investment Officer',
    ];
  }

  // Sales personas
  if (lowerPersona.includes('vp') && lowerPersona.includes('sales')) {
    return [
      'VP of Sales',
      'Vice President of Sales',
      'Chief Revenue Officer',
      'CRO',
      'SVP Sales',
    ];
  }

  if (lowerPersona.includes('revenue operations')) {
    return [
      'Head of Revenue Operations',
      'Director of Revenue Operations',
      'VP Revenue Operations',
      'RevOps Manager',
    ];
  }

  if (lowerPersona.includes('sales enablement')) {
    return [
      'Sales Enablement Manager',
      'Director of Sales Enablement',
      'Head of Sales Enablement',
      'VP Sales Enablement',
    ];
  }

  // Generic fallback
  return [persona];
}
