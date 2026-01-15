import { Contact, Persona } from '@/types/research';
import { searchPeople, verifyEmail } from '@/lib/integrations/apollo';
import { mapPersonaToSearchTitles } from './persona-mapper';

export async function findContacts(
  companyUrl: string,
  personas: Persona[]
): Promise<Contact[]> {
  try {
    const domain = extractDomain(companyUrl);
    const contacts: Contact[] = [];

    for (const persona of personas) {
      const titles = mapPersonaToSearchTitles(persona.persona);

      try {
        const people = await searchPeople({
          organization_domain: domain,
          person_titles: titles,
          page: 1,
          per_page: 3, // Get max 3 per persona
        });

        for (const person of people.slice(0, 2)) {
          // Max 2 per persona
          if (!person.email) continue;

          // Verify email
          const isVerified = await verifyEmail(person.email);

          contacts.push({
            name: person.name,
            title: person.title,
            linkedin_url: person.linkedin_url || '',
            email: person.email,
            email_verified: isVerified,
            phone: person.phone_numbers?.[0]?.raw_number || '',
          });
        }
      } catch (error) {
        console.error(`Error finding contacts for persona ${persona.persona}:`, error);
        continue; // Continue with next persona
      }
    }

    // Return only verified contacts, max 6 total
    const verifiedContacts = contacts.filter((c) => c.email_verified);
    return verifiedContacts.slice(0, 6);
  } catch (error) {
    console.error('Contact finder error:', error);
    return []; // Return empty array on error
  }
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    // If URL parsing fails, try to extract domain manually
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1] : url;
  }
}
