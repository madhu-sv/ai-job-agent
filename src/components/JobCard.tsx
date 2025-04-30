// src/components/JobCard.tsx
'use client';
import { Star } from 'lucide-react';

export interface JobCardProps {
  title: string;
  company: string;
  location: string;
  logoUrl?: string;
  onApply?: () => void;
  onSave?: () => void;
}

export default function JobCard({
  title,
  company,
  location,
  logoUrl,
  onApply,
  onSave,
}: JobCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md bg-white dark:bg-gray-800 flex flex-col justify-between h-full">
      <div className="flex items-center gap-4 mb-4">
        {logoUrl ? (
          <img src={logoUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
            🚀
          </div>
        )}
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400">{company}</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">{location}</p>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
        >
          Apply
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 border border-gray-400 dark:border-gray-600 hover:border-blue-400 rounded-md flex items-center gap-1 text-sm"
        >
          <Star size={16} /> Save
        </button>
      </div>
    </div>
  );
}
