import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || '';
  const page = searchParams.get('page') || '1';

  const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
  };

  const apiUrl = new URL('https://jsearch.p.rapidapi.com/search');
  apiUrl.searchParams.append('query', query);
  apiUrl.searchParams.append('page', page);
  apiUrl.searchParams.append('num_pages', '1');
  if (type) apiUrl.searchParams.append('employment_types', type);

  try {
    const upstream = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`API error ${upstream.status}`);
    const data = await upstream.json();
    const body = { results: data.data || [], total: data.totalCount ?? 0 };

    // Build the NextResponse
    const response = NextResponse.json(body);

    // **Patch in an instance .json() for your tests**
    (response as NextResponse & { json: () => Promise<typeof body> }).json = async () => body;

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const body = { error: 'Failed to fetch jobs', details: errorMessage };

    const response = NextResponse.json(body, { status: 500 });
    (response as NextResponse & { json: () => Promise<typeof body> }).json = async () => body;

    return response;
  }
}
