// src/lib/normalizeJob.ts
export type RawJob = Partial<{
  job_title: string;
  title: string;
  employer_name: string;
  company: string;
  job_city: string;
  location: string;
  job_country: string;
  employer_logo: string;
  logoUrl: string;
  job_apply_link: string;
  url: string;
}>;

/**
 * Normalize a raw job object—whether it came from your DB/FAISS index
 * or from an LLM prompt—into the exact shape your UI needs.
 */
export function normalizeJob(r: RawJob) {
  // split on the last comma in location
  const locParts = (r.location ?? '').split(',');
  const city =
    locParts.length > 1
      ? locParts.slice(0, -1).join(',').trim()
      : locParts[0].trim();
  const country =
    locParts.length > 1 ? locParts[locParts.length - 1].trim() : '';

  return {
    job_title:      r.job_title     ?? r.title       ?? '',
    employer_name:  r.employer_name ?? r.company     ?? '',
    job_city:       r.job_city      ?? city                   ,
    job_country:    r.job_country   ?? country                ,
    employer_logo:  r.employer_logo ?? r.logoUrl     ?? '',
    job_apply_link: r.job_apply_link?? r.url         ?? '',
  };
}
