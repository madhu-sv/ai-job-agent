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
  /** Called when a search is initiated */
  onSearch?: ({ query, type, mode }: { query: string; type: string; mode: WorkMode }) => Promise<void>;
};

export default function JobSearchForm({ onResults, onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState<WorkMode>('all');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSearch) {
        await onSearch({ query, type, mode });
      }

      const res = await fetch(`/api/jobs?query=${query}&type=${type}&mode=${mode}`);
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
    <form onSubmit={handleSubmit}>
      <input
        aria-label="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Job title or keyword"
      />
      <select aria-label="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select job type</option>
        <option value="FULLTIME">Full-time</option>
        <option value="PARTTIME">Part-time</option>
      </select>
      <label htmlFor="remote">
        <input
          id="remote"
          type="radio"
          name="mode"
          value="remote"
          checked={mode === 'remote'}
          onChange={() => setMode('remote')}
        />
        Remote
      </label>
      <button type="submit" disabled={loading}>
        Search Jobs
      </button>
    </form>
  );
}
