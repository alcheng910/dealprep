'use client';

import { useState } from 'react';
import { ResearchOutput } from '@/types/research';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      company_url: formData.get('url') as string,
      what_we_sell: formData.get('product') as string || undefined,
      region: formData.get('region') as string || undefined,
    };

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete research');
      }

      const data: ResearchOutput = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.company.name}-research.json`;
    a.click();
  };

  const downloadCSV = () => {
    if (!result || result.contacts.length === 0) return;

    const headers = ['Name', 'Title', 'Email', 'Email Verified', 'Phone', 'LinkedIn URL'];
    const rows = result.contacts.map(c => [
      c.name,
      c.title,
      c.email,
      c.email_verified ? 'Yes' : 'No',
      c.phone,
      c.linkedin_url,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.company.name}-contacts.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            DealPrep
          </h1>
          <p className="text-xl text-slate-600">
            Turn any company URL into a complete sales prep packet
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
                Company Website URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-2">
                What we sell (optional)
              </label>
              <input
                type="text"
                id="product"
                name="product"
                placeholder="Sales enablement software for B2B teams"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-2">
                Region / Market (optional)
              </label>
              <input
                type="text"
                id="region"
                name="region"
                placeholder="North America"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? 'Running Research...' : 'Run Research'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Analyzing company data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={downloadJSON}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Download JSON
              </button>
              {result.contacts.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Download Contacts CSV
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">{result.company.name}</h2>
              <p className="text-slate-600 mb-4">{result.company.summary}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Industry:</span> {result.company.industry}
                </div>
                <div>
                  <span className="font-semibold">Size:</span> {result.company.size_estimate}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">ICP Fit</h3>
              <div className={`inline-block px-4 py-2 rounded-full ${result.icp_fit.fit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result.icp_fit.fit ? 'Fits ICP' : 'Does Not Fit ICP'}
              </div>
              {result.icp_fit.reasons.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Reasons:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.icp_fit.reasons.map((reason, i) => (
                      <li key={i} className="text-slate-600">{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.icp_fit.disqualifiers.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Disqualifiers:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.icp_fit.disqualifiers.map((disq, i) => (
                      <li key={i} className="text-red-600">{disq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.initiatives.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Strategic Initiatives</h3>
                <div className="space-y-4">
                  {result.initiatives.map((init, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">{init.title}</p>
                      <p className="text-sm text-slate-600">{init.why_it_matters}</p>
                      <a href={init.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Source
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.contacts.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Contacts ({result.contacts.length})</h3>
                <div className="space-y-4">
                  {result.contacts.map((contact, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <p className="font-semibold text-lg">{contact.name}</p>
                      <p className="text-slate-600">{contact.title}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Email:</span> {contact.email}
                          {contact.email_verified && <span className="ml-2 text-green-600">✓ Verified</span>}
                        </p>
                        {contact.phone && <p><span className="font-semibold">Phone:</span> {contact.phone}</p>}
                        {contact.linkedin_url && (
                          <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.messaging.emails.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Email Templates</h3>
                <div className="space-y-6">
                  {result.messaging.emails.map((email, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <p className="font-semibold mb-2">Subject: {email.subject}</p>
                      <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded">{email.body}</pre>
                      <div className="mt-2 text-xs text-slate-500">
                        Personalization: {email.personalization_points.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>No login required. Each research run is stateless.</p>
        </div>
      </div>
    </main>
  );
}
