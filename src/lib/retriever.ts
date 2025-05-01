// src/lib/retriever.ts
import { getOpenAIClient } from './openaiClient';
import { cosineSimilarity } from './utils';
import type { Job } from './fetchJobs';

type JobEmbedding = { job: Job; embedding: number[] };
const jobIndex: JobEmbedding[] = [];

/** Load embeddings for a list of jobs into memory (call once) */
export async function initJobIndex(jobs: Job[]) {
  if (jobIndex.length) return;
  const client = getOpenAIClient();
  for (const job of jobs) {
    const text = `${job.job_title} at ${job.employer_name}: ${job['job_description'] ?? ''}`;
    const resp = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    jobIndex.push({ job, embedding: resp.data[0].embedding });
  }
}

/** Retrieve top-k jobs by cosine similarity against the query */
export async function retrieveJobs(query: string, k = 10): Promise<Job[]> {
  const client = getOpenAIClient();
  const resp = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const qEmb = resp.data[0].embedding;

  return jobIndex
    .map(({ job, embedding }) => ({ job, score: cosineSimilarity(qEmb, embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.job);
}
