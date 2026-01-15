export interface ICPCriteria {
  industries: string[];
  company_size: {
    min_employees: number;
    max_employees: number;
  };
  required_tech: string[];
  disqualifiers: string[];
  hiring_signals: {
    min_open_roles: number;
    relevant_departments: string[];
  };
}

export interface ICPEvaluation {
  fit: boolean;
  reasons: string[];
  disqualifiers: string[];
  score?: number;
}
