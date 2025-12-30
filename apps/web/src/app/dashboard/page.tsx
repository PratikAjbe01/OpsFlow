'use client';
import { useAppSelector } from '@/lib/redux/hooks';

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p>Welcome, {user?.name} (Role: {user?.role})</p>
    </div>
  );
}