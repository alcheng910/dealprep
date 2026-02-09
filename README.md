# DealPrep

A lightweight web tool that turns a company URL into a complete outbound research + prep packet—company intel, buying signals, target personas, contacts, and ready-to-send messaging.

## For AEs and SDRs
Fast, consistent prospect research without setup, onboarding, or login.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/alcheng910/dealprep.git
cd dealprep

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Required API Keys

You'll need accounts and API keys for:
- **Tavily** - Company and news research
- **Firecrawl** - Website scraping
- **Apollo.io** - Contact enrichment
- **Anthropic Claude** (optional) - AI-powered email hook generation
  - System works without this key (falls back to template-based hooks)
  - Get your key at: https://console.anthropic.com

Add these to your `.env.local` file.

### Test Mode (Optional)

To test the application without consuming API credits:

1. Set `MOCK_MODE=true` in your `.env.local` file
2. API keys can be set to any value (they won't be used)
3. The app will return realistic fake data for CRE companies

```bash
# .env.local
MOCK_MODE=true
TAVILY_API_KEY=not_needed_in_mock_mode
FIRECRAWL_API_KEY=not_needed_in_mock_mode
APOLLO_API_KEY=not_needed_in_mock_mode
```

To use real APIs, set `MOCK_MODE=false` and provide valid API keys.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Input**: Enter a company website URL (optional: what you sell, target region)
   - Defaults to "CRE deal management" if not specified
2. **Research**: Automatically gathers company intel, tech stack, hiring signals
3. **ICP Check**: Evaluates fit against ideal customer profile
4. **Enrichment**: Finds contacts and enriches with emails (verified)
5. **Output**: Generates prep packet with emails, call scripts, contact list, and ICP assessment

### What You Get
- Analyst-style company brief
- Buying signals (tech + hiring + strategic initiatives)
- Verified contact list (2-3 personas)
- Draft cold emails with real personalization
- 10 AI-generated email hooks (opening lines with variety)
- Cold call opener + discovery questions

### Export Formats
- JSON (full data)
- CSV (contacts only)
- Markdown/PDF (prep brief)

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

---

## Project Structure

```
dealprep/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── research/      # Main research endpoint
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── lib/                   # Core logic
│   ├── research/          # Research pipeline
│   ├── enrichment/        # Contact enrichment
│   ├── icp/              # ICP evaluation
│   └── messaging/         # Email & script generation
├── components/            # React components
├── types/                 # TypeScript types
├── public/               # Static assets
├── .env.example          # Environment variables template
├── SPEC.md              # Detailed specification
└── README.md            # This file
```

---

## Environment Variables

See `.env.example` for all required variables.

```env
TAVILY_API_KEY=your_tavily_key
FIRECRAWL_API_KEY=your_firecrawl_key
APOLLO_API_KEY=your_apollo_key
ANTHROPIC_API_KEY=your_anthropic_key  # Optional - for AI-generated email hooks

# Optional: Enable test mode to avoid consuming API credits
MOCK_MODE=false
```

---

## Features

### Core Features
✅ Stateless (no auth, no database)
✅ ICP evaluation (provides fit assessment for every prospect)
✅ Source citations for all claims
✅ Email verification
✅ Multi-format export

### Guardrails
- Always provide ICP fit assessment alongside results
- Cite sources for every signal
- Label confidence levels
- No hallucinated data

### Explicit Non-Goals
- No authentication
- No saved history
- No email sending
- No CRM integration

---

## Project Research & Personas
This fork includes strategic research to guide skill development and agent capabilities.

- `/research/` — Contains deep-dive persona analyses, competitor notes, pain points, and opportunity maps.
  - [AE SaaS Persona](/research/persona.md) — Detailed breakdown for Account Executives (updated Feb 2026), including workflows, pains, and AI capability ideas to inspire new skills.

These docs help prioritize features that solve real user problems (e.g., automating research, CRM updates, deal risk flagging). Feel free to contribute more personas or use them when building/submitting skills!

---

## Development Roadmap

See `SPEC.md` for full specification and implementation phases.

### Phase 1: Foundation ⏳
- Next.js project setup
- Basic UI
- API route structure

### Phase 2: Research Pipeline
- Tavily integration
- Firecrawl integration
- Data extraction

### Phase 3: ICP & Enrichment
- ICP evaluation
- Apollo.io integration
- Email verification

### Phase 4: Output Generation
- Messaging generation
- Export formatters

### Phase 5: Polish
- Loading states
- Error handling
- UI refinements

---

## Contributing

This is an MVP project. Contributions welcome after initial release.

---

## License

MIT

---

## Support

For issues or questions, open an issue on GitHub.

---

**Built for speed. No friction. Just research.**
