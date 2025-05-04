// src/lib/fetchJobs.ts

export type Job = {
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  employer_logo?: string;
  job_apply_link: string;
  salary?: number;
  job_description?: string;
  id?: number;
  job_type?: string;

  // any other fields you need…
};

/**
 * Fetch a page of jobs via your existing JSearch wrapper.
 */
export async function fetchJobs(query: string, location: string, type: string): Promise<Job[]> {
  const params = new URLSearchParams({
    query: `${query}${location ? ' in ' + location : ''}`,
    page: '1',
    num_pages: '1',
  });
  if (type) params.append('employment_types', type);

  const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });
  if (!res.ok) throw new Error(`JSearch API ${res.status}`);
  const data = await res.json();
  return data.data ?? [];
}

/** Overload signatures */
export function fetchAllJobs(): Promise<Job[]>;
export function fetchAllJobs(query: string, location?: string, type?: string): Promise<Job[]>;

/**
 * Fetch a broader set of jobs to seed your in-memory “index.”
 * 👉 In production you’d page through everything or pull from your DB.
 * Here we stub by doing a single “software” search; adjust as needed.
 */
export async function fetchAllJobs(
  query = 'Software',
  location = 'London',
  type = ''
): Promise<Job[]> {
  try {
    return await fetchJobs(query, location, type);
  } catch (e) {
    console.error('fetchAllJobs failed:', e);
    return [];
  }
}

