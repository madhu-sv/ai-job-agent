// src/lib/skillFilter.ts
import { getOpenAIClient } from './openaiClient';
import { cosineSimilarity } from './utils';

/**
 * Given a list of extracted skills and the user's desired roles,
 * return only the top-K skills most semantically similar to the role text.
 */
export async function filterSkillsForRole(
  skills: string[],
  roles: string[],
  topK = 5,
  similarityThreshold = 0.3
): Promise<string[]> {
  if (!roles.length || !skills.length) {
    return skills;
  }

  const client = getOpenAIClient();
  const roleText = roles.join(' ');

  // Embed both roleText and all skills in one go
  const resp = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: [roleText, ...skills],
  });

  // First embedding is the role
  const roleEmb = resp.data[0].embedding;
  // The rest correspond to each skill in order
  const skillEmbs = resp.data.slice(1).map((d) => d.embedding);

  // Score each skill by cosine similarity to the role
  const scored = skills.map((skill, i) => ({
    skill,
    score: cosineSimilarity(roleEmb, skillEmbs[i]),
  }));

  // Filter out anything below threshold, then pick topK by score
  const filtered = scored
    .filter((s) => s.score >= similarityThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.skill);

  // If filtering is too aggressive (e.g. nothing left), fall back to topK unfiltered
  if (!filtered.length) {
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.skill);
  }

  return filtered;
}
