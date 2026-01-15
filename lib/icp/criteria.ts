import { ICPCriteria } from '@/types/icp';

// Hardcoded ICP criteria for MVP
// Can be extracted to config file or made dynamic in the future
export const ICP_CRITERIA: ICPCriteria = {
  industries: [
    'Technology',
    'SaaS',
    'Financial Services',
    'E-commerce',
    'Software',
  ],
  company_size: {
    min_employees: 50,
    max_employees: 5000,
  },
  required_tech: [
    'react',
    'node',
    'aws',
    'salesforce',
    'hubspot',
    'postgres',
    'mongodb',
    'python',
    'kubernetes',
  ],
  disqualifiers: [
    'government',
    'non-profit',
    'nonprofit',
    'education',
    'university',
    'school',
  ],
  hiring_signals: {
    min_open_roles: 3,
    relevant_departments: ['Engineering', 'Sales', 'Marketing', 'Operations'],
  },
};
