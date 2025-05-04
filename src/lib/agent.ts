// src/lib/agent.ts
import { getOpenAIClient } from './openaiClient';
import { makeKey, getCache, setCache } from './cache';
import { fetchAllJobs } from './fetchJobs';
import { initJobIndex, retrieveJobs } from './retriever';
import { buildRecommendationPrompt } from './promptTemplates';
import { filterSkillsForRole } from './skillFilter';
import type { Job } from './fetchJobs';

/**
 * Extract a JSON array of skills from raw CV text.
 */
export async function extractSkills(text: string): Promise<string[]> {
  const key = makeKey('skills', text);
  const fromCache = getCache<string[]>(key);
  if (fromCache) return fromCache;

  const client = getOpenAIClient();
  const aiRes = await client.chat.completions.create({
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
    skills = JSON.parse(aiRes.choices[0].message.content ?? '[]');
  } catch {
    skills = [];
  }

  setCache(key, skills);
  return skills;
}

/**
 * Recommend jobs given skills, roles, salary and location.
 */
export async function recommendJobs(
  skills: string[],
  roles: string[] = [],
  minSalary = 0,
  location = 'London'        // ← new param
): Promise<Job[]> {
  // 1) Narrow skills to those most relevant to the roles
  const relevantSkills = await filterSkillsForRole(skills, roles, 5, 0.3);

  // 2) Seed the index with the desired role(s) in the given location
  const roleQuery = roles.length ? roles.join(' ') : 'Software';
  const allJobs = await fetchAllJobs(roleQuery, location, '');
  await initJobIndex(allJobs);

  // 3) Retrieve a candidate pool
  const query = [...relevantSkills, ...roles].join(' ');
  const candidates = await retrieveJobs(query, 25);

  // 4) Optional salary filter
  const filtered = candidates.filter((j) =>
    !j['salary'] || j['salary'] >= minSalary
  );

  // 5) Cache key now includes location as well
  const cacheKey = makeKey('recs', {
    skills: relevantSkills,
    roles,
    minSalary,
    location,
    ids: filtered.map((j) => j.job_apply_link),
  });
  const fromCache = getCache<Job[]>(cacheKey);
  if (fromCache) return fromCache;

  // 6) Build & send the templated prompt
  const prompt = buildRecommendationPrompt(relevantSkills, roles, minSalary, filtered);
  const client = getOpenAIClient();
  const aiRes = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  // 7) Parse or fallback
  let recs: Job[] = [];
  try {
    recs = JSON.parse(aiRes.choices[0].message.content ?? '[]');
  } catch {
    recs = filtered.slice(0, 5);
  }

  // 8) Cache & return
  setCache(cacheKey, recs);
  return recs;
}
