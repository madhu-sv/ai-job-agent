// src/components/JobSearchForm.tsx
'use client';

import { FormEvent, useState } from 'react';

export type WorkMode = 'all' | 'remote' | 'onsite' | 'hybrid';

type Job = {
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  employer_logo?: string;
  job_apply_link: string;
};

type Props = {
  /** Called with the array of jobs returned from the API */
  onResults: (jobs: Job[]) => void;
};

export default function JobSearchForm({ onResults }: Props) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState<WorkMode>('all');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build the API URL
      const apiUrl = new URL('/api/searchJobs', window.location.origin);
      apiUrl.searchParams.append('query', query);
      if (type) apiUrl.searchParams.append('type', type);

      // Remote / On-site / Hybrid logic
      if (mode === 'remote') {
        apiUrl.searchParams.append('remote_jobs_only', '1');
      } else if (mode === 'onsite') {
        apiUrl.searchParams.append('remote_jobs_only', '0');
      } else if (mode === 'hybrid') {
        apiUrl.searchParams.set('query', `${query} hybrid`);
      }

      const res = await fetch(apiUrl.toString());
      const json = await res.json();
      onResults(json.results || []);
    } catch (err) {
      console.error('JobSearchForm error:', err);
      onResults([]); // fail gracefully
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
      <input
        aria-label="query"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. React Developer"
        className="p-2 border rounded"
      />

      <select
        aria-label="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Types</option>
        <option value="FULLTIME">Full-time</option>
        <option value="PARTTIME">Part-time</option>
        <option value="CONTRACTOR">Contractor</option>
        <option value="INTERN">Intern</option>
      </select>

      <fieldset className="flex gap-4 items-center">
        <legend className="sr-only">Work mode</legend>
        {(['all', 'remote', 'onsite', 'hybrid'] as WorkMode[]).map((m) => (
          <label key={m} className="flex items-center gap-1">
            <input
              type="radio"
              name="mode"
              value={m}
              checked={mode === m}
              onChange={() => setMode(m)}
              className="form-radio"
            />
            <span className="capitalize">{m === 'all' ? 'All' : m}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Searching…' : 'Search Jobs'}
      </button>
    </form>
  );
}
