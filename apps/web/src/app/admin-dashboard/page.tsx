"use client";
import { useAppSelector } from "@/lib/redux/hooks";

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== "admin") {
    return (
      <div className="p-10 text-red-500">
        Access Denied: You are not an Admin.
      </div>
    );
  }

  return (
    <div className="p-10 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold">🔥 Admin Command Center</h1>
      <p>Welcome, Commander {user?.name}.</p>
    </div>
  );
}
