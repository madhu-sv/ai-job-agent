// src/app/api/extractCVSkills/route.ts
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import * as mammoth from 'mammoth';
import { OpenAI } from 'openai';

// Turn off Next.js’s default body parsing so we can use formData()
export const config = { api: { bodyParser: false } };

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value; // Extracted text from the .docx file
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const cvFile = form.get('cv');
    if (!cvFile || !(cvFile instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read the file into a Buffer
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = '';

    // Choose parser based on MIME type
    if (cvFile.type === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      (cvFile.name?.endsWith('.docx') ?? false)
    ) {
      text = await extractDocxText(buffer);
    } else {
      text = buffer.toString('utf-8');
    }

    // Call OpenAI to extract skills
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const prompt = `Extract a JSON array of relevant skills (technical + soft) from this CV text:\n\n${text}`;
    const aiRes = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 500,
    });

    let skills: string[] = [];
    try {
      const content = aiRes.choices[0].message.content;
      skills = content ? JSON.parse(content) : [];
    } catch {
      // fallback: just return raw text if parsing fails
      skills = [];
    }

    return NextResponse.json({ skills });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to extract CV skills', details: errorMessage },
      { status: 500 },
    );
  }
}
