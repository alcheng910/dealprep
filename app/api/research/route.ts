import { NextRequest, NextResponse } from 'next/server';
import { ResearchOutput } from '@/types/research';
import { extractCompanyIntel } from '@/lib/research/company-intel';
import { extractInitiatives } from '@/lib/research/initiatives';
import { inferTechStack } from '@/lib/research/tech-stack';
import { detectHiringSignals } from '@/lib/research/hiring-signals';
import { evaluateICP } from '@/lib/icp/evaluator';
import { identifyTargetPersonas } from '@/lib/enrichment/persona-mapper';
import { findContacts } from '@/lib/enrichment/contact-finder';
import { generateEmails } from '@/lib/messaging/email-generator';
import { generateCallScript } from '@/lib/messaging/call-script-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_url, what_we_sell, target_persona, region } = body;

    // Validate input
    if (!company_url || typeof company_url !== 'string') {
      return NextResponse.json(
        { error: 'company_url is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(company_url);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('Starting research for:', company_url);

    // Step 1: Extract company intel
    console.log('Step 1: Extracting company intel...');
    const company = await extractCompanyIntel(company_url);

    // Step 2: Run research pipeline in parallel
    console.log('Step 2: Running research pipeline...');
    const [initiatives, techStack, hiringSignals] = await Promise.all([
      extractInitiatives(company.name),
      inferTechStack(company_url),
      detectHiringSignals(company_url),
    ]);

    // Step 3: Evaluate ICP fit
    console.log('Step 3: Evaluating ICP fit...');
    const icpEvaluation = evaluateICP(company, techStack, hiringSignals);

    const icpFit = {
      fit: icpEvaluation.fit,
      reasons: icpEvaluation.reasons,
      disqualifiers: icpEvaluation.disqualifiers,
    };

    // Step 4: If not ICP fit, return early (no contact enrichment)
    if (!icpFit.fit) {
      console.log('Not ICP fit. Stopping before enrichment.');

      const result: ResearchOutput = {
        company,
        initiatives,
        tech_stack: techStack,
        hiring_signals: hiringSignals,
        icp_fit: icpFit,
        personas: [],
        contacts: [],
        messaging: {
          emails: [],
          call_script: {
            opener: '',
            discovery_questions: [],
            objections: [],
          },
        },
      };

      return NextResponse.json(result);
    }

    // Step 5: Identify target personas
    console.log('Step 4: Identifying target personas...');
    const personas = identifyTargetPersonas(company.industry, what_we_sell, target_persona);

    // Step 6: Find and enrich contacts
    console.log('Step 5: Finding and enriching contacts...');
    const contacts = await findContacts(company_url, personas);

    // Step 7: Generate messaging
    console.log('Step 6: Generating personalized messaging...');
    const emails = generateEmails(
      company,
      contacts,
      initiatives,
      hiringSignals,
      what_we_sell
    );

    const callScript = generateCallScript(
      company,
      initiatives,
      hiringSignals,
      what_we_sell
    );

    // Step 8: Return full result
    const result: ResearchOutput = {
      company,
      initiatives,
      tech_stack: techStack,
      hiring_signals: hiringSignals,
      icp_fit: icpFit,
      personas,
      contacts,
      messaging: {
        emails,
        call_script: callScript,
      },
    };

    console.log('Research complete!');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Research API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete research',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
