"use client"

import { useGetSubmissionsQuery } from "@/lib/redux/api/formApi"
import { useAppSelector } from "@/lib/redux/hooks"
import { Loader2, Calendar, Mail, ChevronLeft, ChevronRight, Search, Download } from "lucide-react"
import { useState } from "react"

export default function ResponsesPanel({ formId }: { formId: string }) {
  const { fields } = useAppSelector((state) => state.builder)
  const { accessToken } = useAppSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const isValidId = formId && formId.length === 24

  const { data, isLoading, isError } = useGetSubmissionsQuery(
    { formId, page, limit: 10, search: searchTerm },
    {
      skip: !isValidId,
      refetchOnMountOrArgChange: true,
    },
  )

  const submissions = data?.submissions || []
  const pagination = data?.pagination || { page: 1, total: 0, pages: 1 }

  const handleExportAll = () => {
    // Placeholder for export all logic
  }

  const handleExportPage = () => {
    // Placeholder for export page logic
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !submissions) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-destructive bg-background">
        Failed to load responses.
      </div>
    )
  }

  if (submissions.length === 0 && !searchTerm) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground bg-background">
        <div className="bg-secondary/30 p-4 rounded-full mb-4">
           <Mail className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-lg font-medium text-foreground">No responses yet</p>
        <p className="text-sm">Share your form to start collecting data.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-8 overflow-hidden">
      
      {/* Top Bar - Responsive Stack */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shrink-0">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportAll}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-primary rounded-lg hover:opacity-90 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> 
            <span className="hidden sm:inline">Export All</span>
            <span className="sm:hidden">All</span>
          </button>

          <button
            onClick={handleExportPage}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/50 active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> 
            <span className="hidden sm:inline">Export Page</span>
            <span className="sm:hidden">Page</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Table with Scroll */}
      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col min-h-0">
        
        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto relative">
          <table className="min-w-full text-sm text-left border-collapse">
            
            {/* Sticky Header */}
            <thead className="bg-secondary/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold text-center w-16">#</th>
                <th className="px-6 py-4 font-semibold w-40">Date</th>
                <th className="px-6 py-4 font-semibold w-64">Respondent</th>
                
                {/* Dynamic Headers */}
                {fields.map((field) => (
                  <th key={field.id} className="px-6 py-4 font-semibold min-w-[200px]">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border bg-card">
              {submissions.map((sub, index) => (
                <tr key={sub._id} className="group hover:bg-secondary/20 transition-colors">
                  
                  {/* Index */}
                  <td className="px-6 py-4 text-center font-mono text-xs text-muted-foreground">
                    {(pagination.page - 1) * 10 + index + 1}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </td>

                  {/* Respondent (Email) */}
                  <td className="px-6 py-4">
                    {sub.respondentEmail ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                           <Mail className="h-3 w-3 text-primary" />
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[180px]" title={sub.respondentEmail}>
                          {sub.respondentEmail}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs italic">Anonymous</span>
                    )}
                  </td>

                  {/* Dynamic Fields Data */}
                  {fields.map((field) => (
                    <td
                      key={field.id}
                      className="px-6 py-4 text-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]"
                      title={String(sub.data[field.id] || "")}
                    >
                      {typeof sub.data[field.id] === "boolean" ? (
                        sub.data[field.id] ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                            No
                          </span>
                        )
                      ) : (
                        sub.data[field.id] || <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination - Fixed at bottom of table card */}
        {pagination.pages > 1 && (
          <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-between shrink-0">
            <div className="text-xs text-muted-foreground">
              Page <span className="font-medium text-foreground">{pagination.page}</span> of{" "}
              <span className="font-medium text-foreground">{pagination.pages}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-1.5 rounded-md text-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}