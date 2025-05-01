// src/lib/agent.ts
import { getOpenAIClient } from './openaiClient';
import { makeKey, getCache, setCache } from './cache';
import { fetchAllJobs } from './fetchJobs';
import { initJobIndex, retrieveJobs } from './retriever';
import type { Job } from './fetchJobs';

/** Extract skills from a CV text (cached) */
export async function extractSkills(text: string): Promise<string[]> {
  const key = makeKey('skills', text);
  const fromCache = getCache<string[]>(key);
  if (fromCache) return fromCache;

  const client = getOpenAIClient();
  const res = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Extract a JSON array of technical and soft skills from this CV:\n\n${text}`,
      },
    ],
    temperature: 0.2,
  });

  let skills: string[] = [];
  try {
    skills = JSON.parse(res.choices[0].message.content ?? '[]');
  } catch {
    skills = [];
  }

  setCache(key, skills);
  return skills;
}

/** Recommend jobs given extracted skills, optional roles & minSalary */
export async function recommendJobs(
  skills: string[],
  roles: string[] = [],
  minSalary = 0,
): Promise<Job[]> {
  // 1) Seed corpus
  const allJobs = await fetchAllJobs();
  await initJobIndex(allJobs);

  // 2) RAG: retrieve top 25 candidates by simple embedding similarity
  const query = [...skills.slice(0, 5), ...roles].join(' ');
  const candidates = await retrieveJobs(query, 25);

  // 3) Filter by salary if present
  const filtered = candidates.filter((j) => !j['salary'] || j['salary'] >= minSalary);

  // 4) Cached LLM reranking
  const key = makeKey('recs', {
    skills,
    roles,
    minSalary,
    ids: filtered.map((j) => j.job_apply_link),
  });
  const fromCache = getCache<Job[]>(key);
  if (fromCache) return fromCache;

  const client = getOpenAIClient();
  const list = filtered
    .map(
      (j, i) =>
        `${i + 1}. ${j.job_title} at ${j.employer_name} – ${j.job_city || j.job_country || '—'}`,
    )
    .join('\n');
  const prompt = `
You are a job‐matching assistant.
User skills: ${skills.join(', ')}
Desired roles: ${roles.join(', ') || 'none'}
Min salary: ${minSalary}

Here are candidate jobs:
${list}

Please rank and return the top 5 job postings in JSON array of objects with keys:
  - job_title
  - employer_name
  - job_city
  - job_country
  - employer_logo
  - job_apply_link

Only output the JSON array.
`;

  const aiRes = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  let recs: Job[] = [];
  try {
    recs = JSON.parse(aiRes.choices[0].message.content ?? '[]');
  } catch {
    recs = filtered.slice(0, 5);
  }

  setCache(key, recs);
  return recs;
}
export async function resetCache() {
  setCache('skills', {});
  setCache('recs', {});
}
export async function resetJobIndex() {
  const allJobs = await fetchAllJobs();
  await initJobIndex(allJobs);
}
export async function resetAll() {
  await resetCache();
  await resetJobIndex();
}
export async function resetAllJobs() {
  const allJobs = await fetchAllJobs();
  await initJobIndex(allJobs);
}
export async function resetAllSkills() {
  setCache('skills', {});
}
export async function resetAllRecommendations() {
  setCache('recs', {});
}
export async function resetAllJobsAndSkills() {
  await resetAllJobs();
  await resetAllSkills();
}
export async function resetAllJobsAndRecommendations() {
  await resetAllJobs();
  await resetAllRecommendations();
}
