'use client';

import { useState } from 'react';
import JobSearchForm, { WorkMode } from '@/components/JobSearchForm';
import JobCard from '@/components/JobCard';
import { Job } from '@/lib/fetchJobs';

export default function JobRecommendationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mode, setMode] = useState<WorkMode>('all');

  const handleSearch = async ({
    query,
    type,
    mode: workMode,
  }: {
    query: string;
    type: string;
    mode: WorkMode;
  }) => {
    setMode(workMode);
    // Build URL
    const apiUrl = new URL('/api/searchJobs', window.location.origin);
    apiUrl.searchParams.append('query', query);
    if (type) apiUrl.searchParams.append('type', type);

    // Remote vs On-site: use remote_jobs_only param
    if (workMode === 'remote') {
      apiUrl.searchParams.append('remote_jobs_only', '1');
    } else if (workMode === 'onsite') {
      apiUrl.searchParams.append('remote_jobs_only', '0');
    }

    // Hybrid: tack “hybrid” onto the query string
    if (workMode === 'hybrid') {
      apiUrl.searchParams.set('query', `${query} hybrid`);
    }

    const res = await fetch(apiUrl.toString());
    const json = await res.json();
    setJobs(json.results || []);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔎 Job Recommendations</h1>

      <JobSearchForm onSearch={handleSearch} onResults={() => {}} />

      {/* Mode badge */}
      {mode !== 'all' && (
        <div className="text-sm uppercase text-blue-700 dark:text-blue-300">
          Showing: {mode === 'onsite' ? 'On-site' : mode.charAt(0).toUpperCase() + mode.slice(1)}
        </div>
      )}

      {/* Results */}
      {jobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No results yet—give it a try!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <JobCard
              key={i}
              title={job.job_title}
              company={job.employer_name}
              location={job.job_city || job.job_country || '—'}
              logoUrl={job.employer_logo}
              onApply={() => window.open(job.job_apply_link, '_blank')}
              onSave={() => alert(`Saved: ${job.job_title}`)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
