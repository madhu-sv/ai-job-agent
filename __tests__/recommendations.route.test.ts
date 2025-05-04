// __tests__/recommendations.route.test.ts
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

import * as agent from '@/lib/agent';
import { POST } from '../src/app/api/recommendations/route';

jest.mock('@/lib/agent');

const extractSkillsMock = agent.extractSkills as jest.MockedFunction<typeof agent.extractSkills>;
const recommendJobsMock = agent.recommendJobs as jest.MockedFunction<typeof agent.recommendJobs>;

describe('POST /api/recommendations', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, OPENAI_API_KEY: 'test-key' };
    extractSkillsMock.mockReset();
    recommendJobsMock.mockReset();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.unmock('@/lib/agent');
    jest.unmock('next/server');
  });

  it('returns 200 and recommended jobs on success', async () => {
    const fakeSkills = ['JavaScript', 'React'];
    const fakeJobs = [
      {
        job_title: 'Frontend Dev',
        employer_name: 'Acme',
        job_city: 'London',
        job_country: 'UK',
        employer_logo: 'logo.png',
        job_apply_link: 'https://acme.jobs/1',
      },
    ];

    extractSkillsMock.mockResolvedValueOnce(fakeSkills);
    recommendJobsMock.mockResolvedValueOnce(fakeJobs);

    const payload = { cvText: 'dummy cv text', roles: ['Developer'], minSalary: 50000, location: 'London' };
    const req = new Request('http://localhost/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res: Response = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ recommended: fakeJobs });

    expect(extractSkillsMock).toHaveBeenCalledWith(payload.cvText);
    expect(recommendJobsMock).toHaveBeenCalledWith(fakeSkills, payload.roles, payload.minSalary, payload.location);
  });

  it('returns 500 and error message on failure', async () => {
    extractSkillsMock.mockRejectedValueOnce(new Error('extract failed'));

    const payload = { cvText: 'broken', roles: [], minSalary: 0, location: 'London' };
    const req = new Request('http://localhost/api/recommendations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toMatchObject({
      error: 'Failed to extract skills',
      details: 'extract failed',
    });

    expect(recommendJobsMock).not.toHaveBeenCalled();
  });
});
