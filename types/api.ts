export interface ResearchRequest {
  company_url: string;
  what_we_sell?: string;
  region?: string;
}

export interface APIError {
  error: string;
  details?: string;
  step?: string;
}

export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: APIError };
