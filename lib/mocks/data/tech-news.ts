export interface MockNewsTemplate {
  titlePattern: (companyName: string) => string;
  contentPattern: (companyName: string) => string;
  category: 'funding' | 'expansion' | 'partnership' | 'hiring' | 'acquisition';
}

export const NEWS_TEMPLATES: MockNewsTemplate[] = [
  {
    titlePattern: (c) => `${c} announces expansion into new markets with $500M capital deployment`,
    contentPattern: (c) => `${c} has announced plans to expand operations into emerging markets across the Sun Belt region. The company plans to deploy $500 million in capital over the next 18 months, focusing on multifamily and mixed-use developments in high-growth secondary markets.`,
    category: 'expansion',
  },
  {
    titlePattern: (c) => `${c} partners with major institutional investor for multifamily platform`,
    contentPattern: (c) => `${c} announced a strategic partnership with a leading institutional investor to launch a new multifamily investment platform. The joint venture will target value-add opportunities in major metropolitan areas with initial equity commitments exceeding $300 million.`,
    category: 'partnership',
  },
  {
    titlePattern: (c) => `${c} closes $750M fund for opportunistic real estate investments`,
    contentPattern: (c) => `${c} successfully closed its latest opportunistic real estate fund at $750 million, exceeding its initial target of $600 million. The fund will focus on distressed assets, value-add multifamily properties, and office-to-residential conversions in urban markets.`,
    category: 'funding',
  },
  {
    titlePattern: (c) => `${c} acquires 2,500-unit multifamily portfolio in Southeast markets`,
    contentPattern: (c) => `${c} has completed the acquisition of a 2,500-unit multifamily portfolio across Atlanta, Charlotte, and Nashville markets. The $425 million transaction represents one of the largest multifamily deals in the region this year and aligns with the company's strategy to expand in high-growth Sun Belt markets.`,
    category: 'acquisition',
  },
  {
    titlePattern: (c) => `${c} expands acquisitions team with five new hires across US offices`,
    contentPattern: (c) => `${c} is expanding its acquisitions capabilities with the addition of five experienced professionals across its New York, Dallas, and Los Angeles offices. The new hires bring expertise in underwriting, due diligence, and capital markets as the firm scales its investment activities.`,
    category: 'hiring',
  },
  {
    titlePattern: (c) => `${c} launches $1B industrial development platform`,
    contentPattern: (c) => `${c} announced the launch of a new industrial and logistics development platform with $1 billion in committed capital. The platform will focus on last-mile distribution centers and modern industrial facilities in primary and secondary markets across the United States.`,
    category: 'expansion',
  },
  {
    titlePattern: (c) => `${c} forms joint venture with pension fund for office repositioning strategy`,
    contentPattern: (c) => `${c} has formed a joint venture with a major public pension fund to pursue office repositioning and conversion opportunities. The partnership has initial capital commitments of $500 million and will target well-located office assets in need of renovation or conversion to alternative uses.`,
    category: 'partnership',
  },
  {
    titlePattern: (c) => `${c} completes $400M recapitalization to accelerate growth initiatives`,
    contentPattern: (c) => `${c} announced a $400 million recapitalization led by institutional investors to support the company's growth strategy. The capital will be used to expand the firm's acquisitions pipeline, enhance technology infrastructure, and grow the team across key markets.`,
    category: 'funding',
  },
  {
    titlePattern: (c) => `${c} acquires competitor in $850M deal to expand market presence`,
    contentPattern: (c) => `${c} has entered into a definitive agreement to acquire a regional competitor for $850 million. The strategic acquisition will expand the company's geographic footprint and add approximately 5,000 multifamily units to its portfolio.`,
    category: 'acquisition',
  },
  {
    titlePattern: (c) => `${c} opens new regional office and expands investment team`,
    contentPattern: (c) => `${c} announced the opening of a new regional office and the expansion of its investment team with eight experienced professionals. The new office will serve as a hub for sourcing and executing deals in high-growth markets across the region.`,
    category: 'hiring',
  },
  {
    titlePattern: (c) => `${c} targets student housing sector with new $350M fund`,
    contentPattern: (c) => `${c} has launched a dedicated student housing investment fund with $350 million in capital commitments. The fund will acquire and develop purpose-built student housing communities near major universities across the United States.`,
    category: 'expansion',
  },
  {
    titlePattern: (c) => `${c} partners with technology provider to modernize operations`,
    contentPattern: (c) => `${c} announced a strategic partnership with a leading real estate technology provider to digitize and streamline its acquisitions and asset management processes. The technology implementation will enhance data analytics capabilities and improve operational efficiency across the platform.`,
    category: 'partnership',
  },
  {
    titlePattern: (c) => `${c} raises $600M for healthcare real estate investment platform`,
    contentPattern: (c) => `${c} successfully raised $600 million for a new healthcare real estate investment platform. The fund will target medical office buildings, ambulatory surgery centers, and seniors housing properties in partnership with leading healthcare systems.`,
    category: 'funding',
  },
  {
    titlePattern: (c) => `${c} acquires industrial portfolio for $520M in off-market transaction`,
    contentPattern: (c) => `${c} completed the acquisition of a 3.5 million square foot industrial portfolio for $520 million in an off-market transaction. The portfolio consists of modern distribution facilities in key logistics markets across the United States.`,
    category: 'acquisition',
  },
  {
    titlePattern: (c) => `${c} doubles underwriting team to support growing deal pipeline`,
    contentPattern: (c) => `${c} is doubling the size of its underwriting team with the addition of ten new professionals. The expansion comes as the firm's deal pipeline has grown significantly, with over $2 billion in potential acquisitions under evaluation.`,
    category: 'hiring',
  },
  {
    titlePattern: (c) => `${c} enters self-storage sector with inaugural fund launch`,
    contentPattern: (c) => `${c} announced its entry into the self-storage sector with the launch of a $250 million fund. The fund will pursue development and value-add acquisition opportunities in high-growth suburban markets across the Sun Belt and Mountain West regions.`,
    category: 'expansion',
  },
  {
    titlePattern: (c) => `${c} forms development joint venture with national homebuilder`,
    contentPattern: (c) => `${c} has formed a joint venture with a national homebuilder to develop build-to-rent communities across growth markets. The partnership has initial capital commitments of $400 million and will deliver over 2,000 single-family rental homes.`,
    category: 'partnership',
  },
  {
    titlePattern: (c) => `${c} secures $900M credit facility to support acquisition strategy`,
    contentPattern: (c) => `${c} announced the closing of a $900 million credit facility with a syndicate of banks. The facility will provide flexible capital to support the company's opportunistic acquisition strategy and fund near-term growth initiatives.`,
    category: 'funding',
  },
  {
    titlePattern: (c) => `${c} acquires retail portfolio and announces repositioning plans`,
    contentPattern: (c) => `${c} completed the acquisition of a 15-property retail portfolio for $380 million. The company plans to reposition several properties for mixed-use development, adding residential and entertainment components to drive value creation.`,
    category: 'acquisition',
  },
  {
    titlePattern: (c) => `${c} establishes ESG-focused investment platform with inaugural hires`,
    contentPattern: (c) => `${c} announced the establishment of a dedicated ESG-focused investment platform and the hiring of three sustainability experts. The new platform will pursue net-zero carbon developments and acquisitions of properties with strong environmental performance.`,
    category: 'hiring',
  },
];
