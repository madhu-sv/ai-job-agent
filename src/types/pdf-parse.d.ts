// filepath: /Users/madhusudhanv/ai-proj/ai-job-agent/src/types/pdf-parse.d.ts
declare module 'pdf-parse/lib/pdf-parse.js' {
  const pdfParse: (data: Buffer | Uint8Array) => Promise<{ text: string }>;
  export default pdfParse;
}