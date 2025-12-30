"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import Link from "next/link";

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OpsFlow</h1>

      {isAuthenticated ? (
        <div className="text-center">
          <p className="text-xl mb-4">
            Welcome back, <strong>{user?.name}</strong>!
          </p>
          <button
            onClick={() => dispatch(logout())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Register
          </Link>
        </div>
      )}
    </main>
  );
}
