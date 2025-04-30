// src/app/api/recommendations/route.ts
import { NextResponse } from 'next/server';
import { extractSkills, recommendJobs } from '@/lib/agent';

export async function POST(req: Request) {
  try {
    const { cvText, roles = [], minSalary = 0 } = await req.json();

    // 1) Extract skills from CV text
    const skills = await extractSkills(cvText);

    // 2) Recommend jobs (RAG + LLM + cache)
    const recommended = await recommendJobs(skills, roles, minSalary);

    return NextResponse.json({ recommended });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Recommendation failed', details: errorMessage },
      { status: 500 },
    );
  }
}
