export interface CompanyData {
  name: string;
  url: string;
  summary: string;
  industry: string;
  size_estimate: string;
  evidence: string[];
}

export interface Initiative {
  title: string;
  why_it_matters: string;
  source_url: string;
}

export interface TechStack {
  tech: string;
  confidence: 'high' | 'medium' | 'low';
  source_url: string;
}

export interface HiringSignal {
  role: string;
  signal: string;
  source_url: string;
}

export interface ICPFit {
  fit: boolean;
  reasons: string[];
  disqualifiers: string[];
}

export interface Persona {
  persona: string;
  why: string;
}

export interface Contact {
  name: string;
  title: string;
  linkedin_url: string;
  email: string;
  email_verified: boolean;
  phone: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  personalization_points: string[];
}

export interface CallScript {
  opener: string;
  discovery_questions: string[];
  objections: string[];
}

export interface Messaging {
  emails: EmailDraft[];
  call_script: CallScript;
  email_hooks: string[];
}

export interface ResearchOutput {
  company: CompanyData;
  initiatives: Initiative[];
  tech_stack: TechStack[];
  hiring_signals: HiringSignal[];
  icp_fit: ICPFit;
  personas: Persona[];
  contacts: Contact[];
  messaging: Messaging;
}
