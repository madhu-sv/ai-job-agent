import { NextResponse } from 'next/server';
import { extractSkills, recommendJobs } from '@/lib/agent';
import { normalizeJob, RawJob } from '@/lib/normalize';

type ReqBody =
  | { skills: string[]; roles?: string[]; minSalary?: number; location?: string }
  | { cvText: string; roles?: string[]; minSalary?: number; location?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;

    let skillsArr: string[];
    if ('skills' in body && Array.isArray(body.skills)) {
      skillsArr = body.skills;
    } else if ('cvText' in body && typeof body.cvText === 'string') {
      try {
        skillsArr = await extractSkills(body.cvText);
      } catch (err: unknown) {
        const details = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json(
          { error: 'Failed to extract skills', details },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Missing skills or cvText in request' },
        { status: 400 }
      );
    }

    const roles = body.roles ?? [];
    const minSalary = body.minSalary ?? 0;
    const location = body.location ?? 'London';

    const raw: RawJob[] = await recommendJobs(skillsArr, roles, minSalary, location);

    const recommended = raw.map(normalizeJob);

    return NextResponse.json({ recommended });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Recommendation failed', details },
      { status: 500 }
    );
  }
}
