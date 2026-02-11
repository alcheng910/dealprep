'use client';

import { useState, useEffect } from 'react';
import { ResearchOutput } from '@/types/research';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [productValue, setProductValue] = useState("CRE deal management system");
  const [personaValue, setPersonaValue] = useState("acquisition associate or analyst");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      company_url: formData.get('url') as string,
      what_we_sell: productValue || undefined,
      target_persona: personaValue || undefined,
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showSettings]);

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            DealPrep
          </h1>
        </div>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Open settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? 'Running Research...' : 'Run Research'}
            </button>
          </form>
        </div>

        {showSettings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSettings(false);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                  aria-label="Close settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="settings-product" className="block text-sm font-medium text-slate-700 mb-2">
                    What we sell
                  </label>
                  <input
                    type="text"
                    id="settings-product"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    placeholder="CRE deal management system"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    This helps personalize the research and messaging
                  </p>
                </div>

                <div>
                  <label htmlFor="settings-persona" className="block text-sm font-medium text-slate-700 mb-2">
                    Target Persona
                  </label>
                  <input
                    type="text"
                    id="settings-persona"
                    value={personaValue}
                    onChange={(e) => setPersonaValue(e.target.value)}
                    placeholder="acquisition associate or analyst"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    The job title or role you&apos;re targeting for outreach
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

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
            {result.messaging.email_hooks && result.messaging.email_hooks.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Email Hooks ({result.messaging.email_hooks.length})</h3>
                <p className="text-sm text-slate-600 mb-4">
                  AI-generated opening lines for personalized outreach
                </p>
                <div className="space-y-3">
                  {result.messaging.email_hooks.map((hook, i) => (
                    <div key={i} className="border-l-4 border-purple-500 pl-4 py-2 bg-slate-50 rounded">
                      <p className="text-sm">
                        <span className="font-semibold text-purple-600">{i + 1}.</span> {hook}
                      </p>
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
