"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Forms", href: "/dashboard/forms", icon: FileText },
    { name: "Team Members", href: "/dashboard/members", icon: Users },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider">OpsFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}>
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => handleLogout()}
          className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
