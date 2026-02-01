export interface MockCRECompany {
  domain: string;
  name: string;
  url: string;
  summary: string;
  industry: string;
  size_estimate: string;
  websiteMarkdown: string;
  techStack: string[];
  jobTitles: string[];
  newsTopics: string[];
}

export const CRE_COMPANIES: MockCRECompany[] = [
  {
    domain: 'greystone.com',
    name: 'Greystone',
    url: 'https://greystone.com',
    summary: 'Leading commercial real estate lending, investment, and advisory company with over $150 billion in assets under management. Specializes in multifamily, healthcare, and seniors housing financing.',
    industry: 'Commercial Real Estate',
    size_estimate: '500-1000 employees',
    websiteMarkdown: '# Greystone\n\nGreystone is a leading commercial real estate lending, investment, and advisory company. We specialize in multifamily housing, healthcare facilities, and seniors housing financing.\n\n## Services\n- Commercial Real Estate Lending\n- Investment Sales\n- Asset Management\n- Property Management\n\n## Markets\nWe operate across the United States with offices in major markets including New York, Los Angeles, Dallas, and Washington DC.',
    techStack: ['Salesforce', 'Microsoft Azure', 'React', 'Node.js', 'PostgreSQL'],
    jobTitles: ['Acquisitions Associate', 'VP of Acquisitions', 'Investment Analyst', 'Underwriter'],
    newsTopics: ['expansion', 'partnership', 'funding'],
  },
  {
    domain: 'lpc.com',
    name: 'Lincoln Property Company',
    url: 'https://lpc.com',
    summary: 'One of the largest private real estate firms in the United States. Lincoln Property Company specializes in multifamily, office, retail, and industrial properties with a portfolio exceeding $80 billion.',
    industry: 'Commercial Real Estate',
    size_estimate: '5000-10000 employees',
    websiteMarkdown: '# Lincoln Property Company\n\nFounded in 1965, Lincoln Property Company is one of the largest private real estate firms in the United States.\n\n## Capabilities\n- Multifamily Development and Management\n- Office Properties\n- Retail Centers\n- Industrial and Logistics\n\n## Portfolio\nOver $80 billion in assets under management across residential and commercial properties.',
    techStack: ['Yardi', 'Salesforce', 'Microsoft 365', 'Power BI'],
    jobTitles: ['Acquisitions Manager', 'Development Associate', 'Asset Manager', 'Leasing Director'],
    newsTopics: ['acquisition', 'development', 'expansion'],
  },
  {
    domain: 'cresmithgroup.com',
    name: 'CRE Smith Group',
    url: 'https://cresmithgroup.com',
    summary: 'Boutique commercial real estate investment firm focused on value-add multifamily and mixed-use developments in secondary markets across the Southeast and Southwest United States.',
    industry: 'Commercial Real Estate',
    size_estimate: '50-200 employees',
    websiteMarkdown: '# CRE Smith Group\n\nBoutique commercial real estate investment firm specializing in value-add opportunities.\n\n## Focus Areas\n- Multifamily Value-Add\n- Mixed-Use Developments\n- Secondary Market Investments\n\n## Geographic Focus\nSoutheast and Southwest United States including Atlanta, Nashville, Austin, and Phoenix.',
    techStack: ['Juniper Square', 'Salesforce', 'Slack', 'Argus Enterprise'],
    jobTitles: ['Acquisitions Analyst', 'Acquisitions Associate', 'Director of Acquisitions'],
    newsTopics: ['funding', 'acquisition', 'partnership'],
  },
  {
    domain: 'benchmark.com',
    name: 'Benchmark Real Estate',
    url: 'https://benchmark.com',
    summary: 'National commercial real estate services firm providing brokerage, property management, and investment advisory services. Benchmark specializes in office, industrial, and retail properties.',
    industry: 'Commercial Real Estate',
    size_estimate: '1000-5000 employees',
    websiteMarkdown: '# Benchmark Real Estate\n\nNational commercial real estate services firm with expertise across all property types.\n\n## Services\n- Tenant Representation\n- Landlord Representation\n- Investment Sales\n- Property Management\n- Valuation and Advisory\n\n## Expertise\nOffice, industrial, retail, and healthcare properties nationwide.',
    techStack: ['CoStar', 'Microsoft Dynamics', 'Tableau', 'DocuSign'],
    jobTitles: ['Investment Sales Associate', 'Senior Underwriter', 'Portfolio Analyst'],
    newsTopics: ['expansion', 'hiring', 'partnership'],
  },
  {
    domain: 'horizonequity.com',
    name: 'Horizon Equity Partners',
    url: 'https://horizonequity.com',
    summary: 'Private equity real estate firm focused on opportunistic and value-add investments in multifamily, office, and industrial properties. $5 billion in assets under management.',
    industry: 'Commercial Real Estate Private Equity',
    size_estimate: '100-500 employees',
    websiteMarkdown: '# Horizon Equity Partners\n\nPrivate equity real estate firm pursuing opportunistic investments nationwide.\n\n## Investment Strategy\n- Value-Add Multifamily\n- Office Repositioning\n- Industrial Development\n- Opportunistic Acquisitions\n\n## Track Record\n$5 billion in assets under management with investments across 25+ markets.',
    techStack: ['Juniper Square', 'Yardi', 'Salesforce', 'AWS', 'Python'],
    jobTitles: ['Acquisitions Associate', 'VP of Acquisitions', 'Deal Analyst', 'Investment Analyst'],
    newsTopics: ['funding', 'acquisition', 'expansion'],
  },
];
