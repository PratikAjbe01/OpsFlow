'use client';

import { useGetFormsQuery, useDeleteFormMutation } from '@/lib/redux/api/formApi'; // Import delete hook
import { useAppSelector } from '@/lib/redux/hooks';
import Link from 'next/link';
import { Calendar, BarChart, Trash2 } from 'lucide-react';
import CreateFormBtn from './CreateFormBtn';

export default function FormList() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { data: forms, isLoading } = useGetFormsQuery(
    currentWorkspace?._id || '', 
    { skip: !currentWorkspace }
  );
  
  // Delete Hook
  const [deleteForm] = useDeleteFormMutation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent Link navigation
    if (confirm('Are you sure you want to delete this form? This cannot be undone.')) {
        await deleteForm(id);
    }
  };

  if (!currentWorkspace) return null;
  if (isLoading) return <div className="mt-8">Loading forms...</div>;

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CreateFormBtn />

      {forms?.map((form) => (
        <Link 
          key={form._id} 
          href={`/builder/${form._id}`}
          className="group relative block rounded-lg bg-white shadow transition hover:shadow-md"
        >
          {/* DELETE BUTTON (Top Right) */}
          <button
            onClick={(e) => handleDelete(e, form._id)}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 rounded-full transition-all"
            title="Delete Form"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 truncate pr-8">
              {form.name}
            </h3>
            {/* ... rest of the card content remains the same ... */}
             <p className="mt-1 text-sm text-gray-500">
              {form.isPublished ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Published</span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Draft</span>
              )}
            </p>
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <BarChart className="mr-1.5 h-4 w-4 text-gray-400" />
                {form.submissionsCount} submissions
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                {new Date(form.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}