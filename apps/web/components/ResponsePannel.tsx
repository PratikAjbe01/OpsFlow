'use client';

import { useGetSubmissionsQuery } from '@/lib/redux/api/formApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Loader2, Calendar, Mail, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import { useState } from 'react';

export default function ResponsesPanel({ formId }: { formId: string }) {
  const { fields } = useAppSelector((state) => state.builder);
  const { accessToken } = useAppSelector((state) => state.auth); // Get Token
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Strict ID check
  const isValidId = formId && formId.length === 24;

  const { data, isLoading, isError } = useGetSubmissionsQuery(
    { formId, page, limit: 10, search: searchTerm },
    { 
      skip: !isValidId,
      refetchOnMountOrArgChange: true 
    }
  );

  const submissions = data?.submissions || [];
  const pagination = data?.pagination || { page: 1, total: 0, pages: 1 };

  // 1. EXPORT PAGE (Client Side)
  const handleExportPage = () => {
    if (!submissions.length) return;

    const headers = ["Submission Date", ...fields.map(f => f.label), "Respondent Email"];
    
    const rows = submissions.map(sub => {
      const date = new Date(sub.submittedAt).toLocaleDateString();
      const email = sub.respondentEmail || "Anonymous";
      
      const answers = fields.map(field => {
        let val = sub.data[field.id];
        if (typeof val === 'string') {
            val = `"${val.replace(/"/g, '""')}"`; 
        }
        return val || "";
      });

      return [date, ...answers, email].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `responses_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. EXPORT ALL (Server Side)
  const handleExportAll = async () => {
    if (!accessToken) {
        alert("You are logged out. Please refresh.");
        return;
    }

    try {
      // Direct call to the backend export route
      const res = await fetch(`http://localhost:8761/api/forms/${formId}/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}` // Pass the token
        }
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form_export_all.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download CSV. Ensure you have responses.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !submissions) {
     return (
        <div className="flex h-full flex-col items-center justify-center text-red-500">
           Failed to load responses.
        </div>
     );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-400">
        <p className="text-lg font-medium">No responses yet</p>
        <p className="text-sm">Share your form to start collecting data.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50 p-8">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search responses by email…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-0 transition"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportAll} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> Export All
          </button>

          <button 
            onClick={handleExportPage} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> Export Page
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 text-center font-semibold">#</th>
                <th className="px-6 py-3 text-center font-semibold">Date</th>
                {fields.map((field) => (
                  <th key={field.id} className="px-6 py-3 text-center font-semibold whitespace-nowrap">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center font-semibold">Respondent Email</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub, index) => (
                <tr key={sub._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {(pagination.page - 1) * 10 + index + 1}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap flex items-center gap-2 text-gray-500 justify-center">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>

                  {fields.map((field) => (
                    <td key={field.id} className="px-6 py-4 text-center max-w-xs truncate" title={String(sub.data[field.id] || '')}>
                      {typeof sub.data[field.id] === 'boolean'
                        ? sub.data[field.id] ? 'Yes' : 'No'
                        : sub.data[field.id] || <span className="text-gray-300">—</span>}
                    </td>
                  ))}

                  <td className="px-6 py-4 text-center">
                    {sub.respondentEmail ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        <Mail className="h-3 w-3" />
                        {sub.respondentEmail}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 mt-4 rounded-b-xl">
          <div className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{pagination.page}</span> of{' '}
            <span className="font-medium text-gray-900">{pagination.pages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}