# DealPrep - Product Specification

## One-Sentence Pitch
A lightweight web tool that turns a company URL into a complete outbound research + prep packet—company intel, buying signals, target personas, contacts, and ready-to-send messaging.

## Target User
AEs and SDRs who want fast, consistent prospect research without setup, onboarding, or login.

---

## Core Workflow (No Auth)

### 1. Input
- **Company website URL** (required)
- **"What we sell"** (optional, defaults to "CRE deal management")
- **Region / market focus** (optional)

### 2. Research & Signal Extraction
The system automatically gathers:
- **Company overview** (what they do, who they serve)
- **Strategic initiatives** (from site + recent news)
- **Recent events** (funding, leadership changes, product launches)
- **Tech stack inference** (from site analysis + job postings)
- **Hiring signals** that indicate buying intent

### 3. ICP Fit Check
Evaluate against a predefined ICP (hardcoded in application logic)

**Result:**
- Provides fit assessment with reasons and disqualifiers
- Displayed alongside all research results
- **Does not gate contact enrichment** (always continues to persona discovery)
- Helps users prioritize prospects based on fit criteria

### 4. Persona + Contact Discovery
- Identify 2–3 relevant personas
- Find candidate people + LinkedIn URLs
- Enrich contacts (email required; phone optional)
- Verify emails before output

### 5. Prep Pack Output
Generate analyst-style research packet:
- Company brief
- Buying signals (tech + hiring + triggers)
- Contact list (clean + verified)
- Draft cold emails referencing real initiatives
- Cold call opener + discovery questions

---

## UI Design (Simple Single Page)

### Layout
- **Single page application**
- URL input + optional fields
- "Run Research" button
- Loading / progress state (show current step)
- Results rendered as expandable sections
- Download buttons:
  - JSON (full output)
  - CSV (contacts only)
  - Markdown / PDF (prep brief)

### UX Principles
- No user accounts
- No history
- Each run is **stateless**
- Fast and frictionless

---

## Output Schema (Strict)

```json
{
  "company": {
    "name": "",
    "url": "",
    "summary": "",
    "industry": "",
    "size_estimate": "",
    "evidence": []
  },
  "initiatives": [
    {
      "title": "",
      "why_it_matters": "",
      "source_url": ""
    }
  ],
  "tech_stack": [
    {
      "tech": "",
      "confidence": "high|medium|low",
      "source_url": ""
    }
  ],
  "hiring_signals": [
    {
      "role": "",
      "signal": "",
      "source_url": ""
    }
  ],
  "icp_fit": {
    "fit": true,
    "reasons": [],
    "disqualifiers": []
  },
  "personas": [
    {
      "persona": "",
      "why": ""
    }
  ],
  "contacts": [
    {
      "name": "",
      "title": "",
      "linkedin_url": "",
      "email": "",
      "email_verified": true,
      "phone": ""
    }
  ],
  "messaging": {
    "emails": [
      {
        "subject": "",
        "body": "",
        "personalization_points": []
      }
    ],
    "call_script": {
      "opener": "",
      "discovery_questions": [],
      "objections": []
    }
  }
}
```

---

## Technical Architecture

### Recommended Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Routes:** Next.js serverless functions
- **Deployment:** Vercel (recommended) or similar

### API Integrations (MVP)
1. **Tavily** – Company + news research
2. **Firecrawl** – Deep page + job scraping
3. **Apollo.io** – Contact enrichment (recommended for MVP)

### Configuration
- **API Keys:** Environment variables (`.env.local`)
- **ICP Criteria:** Hardcoded in application logic (can refactor to config later)

---

## Guardrails & Quality Standards

### Must-Haves
- ✅ Always provide ICP fit assessment with research results
- ✅ Cite sources for every initiative, signal, and tech claim
- ✅ Clearly label uncertainty (confidence levels)
- ✅ No hallucinated revenue or headcount
- ✅ Email verification required before output
- ✅ Graceful degradation if APIs fail

### Error Handling
- Display clear error messages to user
- Log errors for debugging
- Continue with partial results when possible
- Show which data sources succeeded/failed

---

## Explicit Non-Goals

These are **intentionally excluded** from MVP scope:

- ❌ No authentication
- ❌ No user accounts or saved history
- ❌ No sequencing or sending emails
- ❌ No CRM integration
- ❌ No slash commands
- ❌ No multi-user support
- ❌ No API rate limit management UI

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Next.js project setup
- [ ] Basic UI (URL input form)
- [ ] API route structure
- [ ] Environment variable configuration

### Phase 2: Research Pipeline
- [ ] Tavily integration (company research)
- [ ] Firecrawl integration (page scraping)
- [ ] Data extraction logic
- [ ] Tech stack inference
- [ ] Hiring signal detection

### Phase 3: ICP & Enrichment
- [ ] ICP evaluation logic (hardcoded criteria)
- [ ] Apollo.io integration
- [ ] Email verification
- [ ] Persona identification

### Phase 4: Output Generation
- [ ] Messaging generation (emails + call scripts)
- [ ] JSON output formatter
- [ ] CSV export (contacts)
- [ ] Markdown/PDF export (prep brief)

### Phase 5: Polish
- [ ] Loading states & progress indicators
- [ ] Error handling & user feedback
- [ ] UI refinements
- [ ] Testing & validation

---

## ICP Criteria (Hardcoded for MVP)

Define these in code (can be extracted to config later):

```typescript
const ICP_CRITERIA = {
  industries: ['Technology', 'SaaS', 'Financial Services'],
  company_size: {
    min_employees: 50,
    max_employees: 5000
  },
  required_tech: ['react', 'node', 'aws', 'salesforce'], // any match
  disqualifiers: ['government', 'non-profit', 'education'],
  hiring_signals: {
    min_open_roles: 3,
    relevant_departments: ['Engineering', 'Sales', 'Marketing']
  }
}
```

---

## Default Targeting Configuration

The system defaults to CRE (Commercial Real Estate) targeting:

```typescript
const DEFAULT_CONFIG = {
  what_we_sell: "CRE deal management",
  target_personas: [
    "Acquisitions Associate",  // Primary decision-maker
    "Acquisitions Analyst",    // Entry-level support role
    "Director of Acquisitions" // Executive oversight
  ]
}
```

**Behavior**:
- If user provides `what_we_sell` → uses their value
- If user provides `target_persona` → overrides persona detection
- If neither provided → defaults to CRE targeting

**Rationale**:
CRE is the primary use case for DealPrep, optimizing for this vertical by default improves out-of-box experience.

---

## API Cost Considerations

- **Tavily:** ~$0.005/request
- **Firecrawl:** Varies by pages scraped
- **Apollo.io:** Credits per enrichment

**Optimization:**
- ICP fit assessment helps users prioritize high-value prospects
- Cache results temporarily (optional future enhancement)
- Rate limit requests if needed

---

## Success Metrics (Future)

- Time saved per prospect (target: <5 min manual → <30 sec automated)
- ICP accuracy (% of auto-qualified that convert)
- Contact email deliverability
- User adoption (if tracking added)

---

## Next Steps

1. ✅ Review and approve this spec
2. Set up Next.js project structure
3. Integrate Tavily API
4. Build research pipeline
5. Add Apollo.io enrichment
6. Create UI and output formatters

---

**Last Updated:** 2026-01-15
