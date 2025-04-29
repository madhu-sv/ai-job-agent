'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
        Your <span className="text-blue-600 dark:text-blue-400">AI Job Agent</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
        Tailor your CV, find relevant jobs, and land your dream career — powered by AI.
      </p>
      <div className="flex gap-6">
        <Link href="/job-recommendations">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            🔎 Find Jobs
          </button>
        </Link>
        <Link href="/upload-cv">
          <button className="px-6 py-3 border border-gray-400 dark:border-gray-600 hover:border-blue-400 rounded-md text-gray-700 dark:text-gray-300">
            📄 Upload CV
          </button>
        </Link>
      </div>
    </main>
  );
}
