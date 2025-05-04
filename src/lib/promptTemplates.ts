// src/lib/promptTemplates.ts

import type { Job } from './fetchJobs';

/**
 * Build a consistent prompt for ranking jobs
 * based on user roles, skills, and minimum salary.
 */
export function buildRecommendationPrompt(
  skills: string[],
  roles: string[],
  minSalary: number,
  candidates: Job[]
): string {
  const skillsPart  = skills.length ? skills.join(', ') : 'None';
  const rolesPart   = roles.length  ? roles.join(', ') : 'None';
  const salaryPart  = minSalary > 0 ? `$${minSalary}` : 'No minimum';

  const jobsList = candidates
    .map(
      (j, i) =>
        `${i + 1}. ${j.job_title} at ${j.employer_name} (${j.job_city || j.job_country || '—'})`
    )
    .join('\n');

  return `
You are an expert career agent specialized in aligning user profiles with job postings.
  
User Profile:
  • Desired Role(s): ${rolesPart}
  • Key Technical Skills: ${skillsPart}
  • Minimum Salary Requirement: ${salaryPart}

Here are the candidate jobs:
${jobsList}

Please rank these jobs in order of best fit and return the top 5 as a JSON array of objects with exactly these keys:
  - job_title
  - employer_name
  - job_city
  - job_country
  - employer_logo
  - job_apply_link

Only output the JSON array—no extra commentary.
`.trim();
}
