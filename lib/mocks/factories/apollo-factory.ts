import { ApolloContact } from '@/lib/integrations/apollo';
import { CRE_COMPANIES } from '../data/cre-companies';
import { CRE_CONTACT_TEMPLATES } from '../data/cre-contacts';

export function mockSearchPeople(
  domain: string,
  titles: string[]
): ApolloContact[] {
  // Find matching company or use first one as fallback
  const company = CRE_COMPANIES.find(c => domain.includes(c.domain)) || CRE_COMPANIES[0];

  // Generate 2-3 contacts matching requested titles
  const contacts: ApolloContact[] = [];
  const numContacts = Math.min(3, Math.max(2, titles.length));

  for (let i = 0; i < numContacts; i++) {
    const template = CRE_CONTACT_TEMPLATES[i % CRE_CONTACT_TEMPLATES.length];
    const title = titles[i % titles.length];

    contacts.push({
      id: `mock_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      first_name: template.firstName,
      last_name: template.lastName,
      name: `${template.firstName} ${template.lastName}`,
      title: title,
      email: `${template.firstName.toLowerCase()[0]}${template.lastName.toLowerCase()}@${company.domain}`,
      email_status: 'verified',
      linkedin_url: `https://linkedin.com/in/${template.firstName.toLowerCase()}-${template.lastName.toLowerCase()}-cre`,
      phone_numbers: [{ raw_number: `+1 (212) 555-0${100 + i}${Math.floor(Math.random() * 90) + 10}` }],
      organization: {
        name: company.name,
        website_url: company.url,
      },
    });
  }

  return contacts;
}

export function mockEnrichContact(email: string): ApolloContact | null {
  // Extract domain from email
  const domain = email.split('@')[1] || '';

  // Find matching company or use first one
  const company = CRE_COMPANIES.find(c => domain.includes(c.domain)) || CRE_COMPANIES[0];

  // Use a random contact template
  const template = CRE_CONTACT_TEMPLATES[Math.floor(Math.random() * CRE_CONTACT_TEMPLATES.length)];

  return {
    id: `mock_enriched_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    first_name: template.firstName,
    last_name: template.lastName,
    name: `${template.firstName} ${template.lastName}`,
    title: template.preferredTitles[0],
    email: email,
    email_status: 'verified',
    linkedin_url: `https://linkedin.com/in/${template.firstName.toLowerCase()}-${template.lastName.toLowerCase()}-cre`,
    phone_numbers: [{ raw_number: `+1 (212) 555-0${Math.floor(Math.random() * 900) + 100}` }],
    organization: {
      name: company.name,
      website_url: company.url,
    },
  };
}

export function mockVerifyEmail(email: string): boolean {
  // 90% of emails are verified in mock mode (realistic)
  return Math.random() < 0.9;
}
