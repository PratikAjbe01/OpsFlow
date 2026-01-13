'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from "@/components/DashBoardHeader" // Check casing (DashBoardHeader vs DashboardHeader)

// 👇 This layout accepts 'children', which will be the specific page content
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 1. Shared Sidebar */}
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2. Shared Header */}
        <DashboardHeader />
        
        {/* 3. The Page Content (Dashboard Overview OR My Forms) */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}