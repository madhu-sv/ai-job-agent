// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-6">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
        Welcome to <span className="text-blue-600 dark:text-blue-400">AI Job Agent</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
        An AI-powered assistant to search jobs, tailor your CV, and accelerate your career.
      </p>
      <div className="flex gap-4">
        <Link
          href="/job-recommendations"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          🔎 Find Jobs
        </Link>
        <Link
          href="/upload-cv"
          className="px-6 py-3 border border-gray-400 dark:border-gray-600 hover:border-blue-400 rounded-md text-gray-700 dark:text-gray-300"
        >
          📄 Upload CV
        </Link>
      </div>
    </section>
  );
}
