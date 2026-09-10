'use client';
import { useState } from 'react';

export default function ApplicationTracker() {
  const [appId, setAppId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/applications?id=${appId}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch status');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Application</h1>
      <p className="text-gray-500 mb-8">Enter your SamruddhiSetu tracking ID to check the current status.</p>

      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder="e.g. SS-2026-8921" 
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          className="flex-1 border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition"
        >
          Track
        </button>
      </div>

      {error && <p className="text-red-500 font-medium p-4 bg-red-50 rounded-lg">{error}</p>}

      {result && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{result.applicant_name}</h2>
              <p className="text-gray-500 mt-1">ID: {result.application_id}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full">
              {result.status}
            </span>
          </div>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-semibold w-32 inline-block">Partner Node:</span> {result.partner_name}</p>
            <p><span className="font-semibold w-32 inline-block">Submitted:</span> {new Date(result.submitted_date).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}