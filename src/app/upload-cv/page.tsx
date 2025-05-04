'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import RecommendationsCarousel from '@/components/RecommendationsCarousel';
import { Job } from '@/lib/fetchJobs';

type SkillResponse = {
  technicalSkills?: string[];
  softSkills?: string[];
};

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<SkillResponse>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [location, setLocation] = useState<string>('London');
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSkills({});
    setJobs([]);
    setFile(e.target.files?.[0] || null);
  };

  const extractSkills = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setError(null);
    setLoadingSkills(true);
    setSkills({});
    setJobs([]);

    try {
      const fd = new FormData();
      fd.append('cv', file);
      const res = await fetch('/api/extractCVSkills', {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      if (json.skills && typeof json.skills === 'object' && !Array.isArray(json.skills)) {
        setSkills(json.skills);
      } else if (Array.isArray(json.skills)) {
        setSkills({ technicalSkills: json.skills });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to extract skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const getRecommendations = async () => {
    const tech = skills.technicalSkills || [];
    if (tech.length === 0) {
      setError('No skills to base recommendations on');
      return;
    }

    setError(null);
    setLoadingRecs(true);

    try {
      // Send only the raw skills array
      const payload = { skills: tech, roles, minSalary, location };
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { recommended } = await res.json();
      setJobs(recommended || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <main className="p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">📄 Upload Your CV</h1>

      {error && <p className="text-red-500">⚠️ {error}</p>}

      <form onSubmit={extractSkills} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onFileChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={!file || loadingSkills}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loadingSkills ? 'Extracting…' : 'Extract Skills'}
        </button>
      </form>

      {/* Skills */}
      {(skills.technicalSkills?.length || skills.softSkills?.length) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔧 Extracted Skills</h2>
          {skills.technicalSkills && (
            <div>
              <h3 className="font-medium">Technical</h3>
              <ul className="list-disc pl-5">
                {skills.technicalSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {skills.softSkills && (
            <div>
              <h3 className="font-medium">Soft</h3>
              <ul className="list-disc pl-5">
                {skills.softSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preferences */}
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">🎯 Fine-tune Recommendations</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Location (e.g., London)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-2 border rounded flex-1"
              />
              <input
                type="text"
                placeholder="Desired roles, comma-separated"
                onChange={(e) =>
                  setRoles(e.target.value.split(',').map((r) => r.trim()))
                }
                className="p-2 border rounded flex-1"
              />
              <input
                type="number"
                placeholder="Min salary"
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="p-2 border rounded w-32"
              />
            </div>
            <button
              onClick={getRecommendations}
              disabled={loadingRecs}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
            >
              {loadingRecs ? 'Recommending…' : 'Get Recommendations'}
            </button>
          </div>
        </section>
      )}

      {/* Carousel */}
      {jobs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">🚀 Recommended for You</h2>
          <RecommendationsCarousel jobs={jobs} />
        </section>
      )}
    </main>
  );
}
