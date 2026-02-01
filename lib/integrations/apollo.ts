import axios from 'axios';
import {
  mockSearchPeople,
  mockEnrichContact,
  mockVerifyEmail,
} from '@/lib/mocks';

const APOLLO_API_URL = 'https://api.apollo.io/v1';
const APOLLO_API_KEY = process.env.APOLLO_API_KEY || '';
const MOCK_MODE = process.env.MOCK_MODE === 'true';

export interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  email: string;
  email_status: string;
  linkedin_url: string;
  phone_numbers: { raw_number: string }[];
  organization: {
    name: string;
    website_url: string;
  };
}

export interface ApolloSearchParams {
  organization_domain: string;
  person_titles: string[];
  page: number;
  per_page: number;
}

export async function searchPeople(
  params: ApolloSearchParams
): Promise<ApolloContact[]> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Apollo searchPeople - returning fake data');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return mockSearchPeople(params.organization_domain, params.person_titles);
  }

  try {
    const response = await axios.post(
      `${APOLLO_API_URL}/mixed_people/search`,
      {
        q_organization_domains: [params.organization_domain],
        person_titles: params.person_titles,
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': APOLLO_API_KEY,
        },
      }
    );

    return response.data.people || [];
  } catch (error: any) {
    console.error('Apollo search error:', error.response?.data || error.message);
    throw new Error(`Failed to search contacts: ${error.message}`);
  }
}

export async function enrichContact(email: string): Promise<ApolloContact | null> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Apollo enrichContact - returning fake data');
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEnrichContact(email);
  }

  try {
    const response = await axios.post(
      `${APOLLO_API_URL}/people/match`,
      {
        email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': APOLLO_API_KEY,
        },
      }
    );

    return response.data.person || null;
  } catch (error: any) {
    console.error('Apollo enrichment error:', error.response?.data || error.message);
    return null;
  }
}

export async function verifyEmail(email: string): Promise<boolean> {
  // Mock mode check
  if (MOCK_MODE) {
    console.log('[MOCK MODE] Apollo verifyEmail - returning fake verification');
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockVerifyEmail(email);
  }

  try {
    const response = await axios.post(
      `${APOLLO_API_URL}/email_status`,
      {
        email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': APOLLO_API_KEY,
        },
      }
    );

    const status = response.data.email_status;
    return status === 'verified' || status === 'valid';
  } catch (error) {
    console.error('Email verification error:', error);
    return false; // Default to false if verification fails
  }
}
