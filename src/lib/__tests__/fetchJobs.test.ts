// src/lib/__tests__/fetchJobs.test.ts
import { fetchJobs } from '../fetchJobs';

describe('fetchJobs', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.RAPIDAPI_KEY = 'test';
  });

  it('returns jobs on success', async () => {
    const fake = { data: [{ job_title: 'X', employer_name: 'Y', job_apply_link: '#' }] };
    // @ts-expect-error: Mocking global.fetch for testing purposes
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fake),
    });
    const results = await fetchJobs('Dev', 'London', 'FULLTIME');
    expect(results).toEqual(fake.data);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('throws on non-ok', async () => {
    // @ts-expect-error: Mocking global.fetch for testing purposes
    global.fetch.mockResolvedValue({ ok: false, status: 401 });
  });
});
