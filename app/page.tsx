export default function Home() {
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

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6">
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
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Run Research
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>No login required. Each research run is stateless.</p>
        </div>
      </div>
    </main>
  );
}
