"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/redux/api/authApi";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await register(formData).unwrap();
      router.push("/login?registered=true");
    } catch (err: any) {
      const msg = err?.data?.errors
        ? err.data.errors[0].message
        : err?.data?.message || "Registration failed";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(100,200,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Start managing workflows and automation today.
            </p>
          </div>

          <form
            className="space-y-6 rounded-xl border border-sidebar-border bg-card/50 backdrop-blur-sm p-8"
            onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="off"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-sidebar-accent/20 border border-sidebar-border text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:border-sidebar-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-sidebar-accent/20 border border-sidebar-border text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:border-sidebar-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground">
                  Password (min 6 characters)
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="off"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-sidebar-accent/20 border border-sidebar-border text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:border-sidebar-primary transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-sidebar-primary hover:bg-sidebar-primary/90 disabled:bg-sidebar-primary/50 text-sidebar-primary-foreground font-medium rounded-lg transition-all flex items-center justify-center gap-2 group">
              {isLoading ? "Creating Account..." : "Sign Up"}
              {!isLoading && (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sidebar-primary hover:text-sidebar-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
