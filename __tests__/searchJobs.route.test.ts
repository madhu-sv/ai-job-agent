// __tests__/searchJobs.route.test.ts

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

import { GET } from '../src/app/api/searchJobs/route';
import { NextResponse } from 'next/server';

describe('GET /api/searchJobs', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, RAPIDAPI_KEY: 'test-key' };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(() => {
    jest.unmock('next/server');
  });

  it('returns results on success', async () => {
    const fakeData = { data: [{ job_title: 'Dev' }], totalCount: 1 };
    // @ts-expect-error: Mocking 'global.fetch' for testing purposes, TypeScript does not recognize it.
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(fakeData) });

    const req = new Request('http://localhost/api/searchJobs?query=dev&type=FULLTIME');
    const res = await GET(req);

    // Verify NextResponse.json was called with the correct payload
    expect(NextResponse.json).toHaveBeenCalledWith({
      results: fakeData.data,
      total: 1,
    });

    // And that the returned response has the default 200 status
    expect(res.status).toBe(200);

    // Verify the response body
    const json = await res.json();
    expect(json).toEqual({ results: fakeData.data, total: 1 });
  });

  it('returns error on fetch failure', async () => {
    // @ts-expect-error: Mocking global.fetch for testing purposes
    global.fetch.mockRejectedValue(new Error('network'));

    const req = new Request('http://localhost/api/searchJobs');
    const res = await GET(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch jobs', details: 'network' },
      { status: 500 },
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Failed to fetch jobs');
  });
});
