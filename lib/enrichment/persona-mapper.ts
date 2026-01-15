import { Persona } from '@/types/research';

export function identifyTargetPersonas(
  industry: string,
  whatWeSell?: string
): Persona[] {
  // Define personas based on what we're selling
  const personas: Persona[] = [];

  // Sales tool personas (default)
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

  // If what we sell is specified, could adjust personas
  // For MVP, keeping it simple with sales-focused personas

  return personas.slice(0, 3); // Return top 3
}

export function mapPersonaToSearchTitles(persona: string): string[] {
  const lowerPersona = persona.toLowerCase();

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
