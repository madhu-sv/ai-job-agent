// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Job Agent',
  description: 'Search jobs, tailor your CV, land your dream career',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              AI Job Agent
            </Link>
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/job-recommendations"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/upload-cv"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Upload CV
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} AI Job Agent. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
