"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Layers,
  Lock,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const problemContainerRef = useRef<HTMLDivElement>(null);
  const problemScrollRef = useRef<HTMLDivElement>(null);
  const bentoContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero heading reveal
      if (heroHeadingRef.current) {
        const letters = heroHeadingRef.current.querySelectorAll("span");
        gsap.fromTo(
          letters,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.04,
            ease: "power3.out",
          }
        );
      }

      // Dashboard float up
      if (dashboardRef.current) {
        gsap.fromTo(
          dashboardRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.5,
            ease: "power2.out",
          }
        );

        gsap.to(dashboardRef.current, {
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.5,
          },
          y: -100,
          opacity: 0.4,
          ease: "none",
        });
      }

      // Marquee animation
      if (marqueeRef.current) {
        const marqueeContent = marqueeRef.current.querySelector(
          "[data-marquee-content]"
        );
        if (marqueeContent) {
          gsap.to(marqueeContent, {
            x: -marqueeContent.scrollWidth / 2,
            duration: 40,
            repeat: -1,
            ease: "linear",
          });
        }
      }

      // Horizontal scroll
      if (problemScrollRef.current) {
        const cards = problemScrollRef.current.querySelectorAll("[data-card]");
        const totalWidth = cards.length * 420;

        gsap.to(problemScrollRef.current, {
          scrollTrigger: {
            trigger: problemContainerRef.current,
            start: "top top",
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            markers: false,
          },
          x: -totalWidth + window.innerWidth,
          ease: "none",
        });
      }

      // Bento cards stagger in
      if (bentoContainerRef.current) {
        const cards =
          bentoContainerRef.current.querySelectorAll("[data-bento-card]");
        gsap.fromTo(
          cards,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bentoContainerRef.current,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background text-foreground overflow-x-hidden">
      {/* HERO SECTION - NO TOP MARGIN */}

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 pt-20 border-b border-border">
        <div className="absolute top-8  left-0 right-0 flex items-center justify-between px-6 md:px-12 max-w-7xl mb-5 mx-auto w-full">
          <span className="text-sm font-mono  tracking-widest text-muted-foreground">
            OpsFlow
          </span>
          <div className="flex gap-5">
            <span className="text-sm font-mono  tracking-widest text-muted-foreground">
              Dahboard
            </span>
            <span className="text-sm font-mono  tracking-widest text-muted-foreground">
              Login
            </span>
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--sidebar-primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0",
            opacity: 0.08,
          }}
        />

        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-sidebar-primary/30 bg-sidebar-primary/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-sidebar-primary animate-pulse" />
              <span className="text-xs font-mono text-sidebar-primary uppercase tracking-wider font-semibold">
                Client Operations Platform
              </span>
            </div>
          </div>

          <h1
            ref={heroHeadingRef}
            className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter mb-6 text-center text-balance">
            {"Workflows Made Simple".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto text-center">
            Manage customer forms, automation, analytics, and workflows in one
            beautiful platform. Perfect for support teams, sales ops, and client
            success.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-sidebar-primary/20 flex items-center gap-2 border border-sidebar-primary text-sm">
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-border hover:border-sidebar-primary/50 rounded-lg font-semibold hover:bg-sidebar-primary/10 transition-all text-sm">
              View Docs
            </button>
          </div>
        </div>

        {/* Dashboard visual - OpsFlow UI mockup */}
        <div ref={dashboardRef} className="relative z-5 w-full max-w-5xl mt-16">
          <div className="relative rounded-xl border border-sidebar-primary/20 bg-card/30 backdrop-blur-xl overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-12 gap-6">
                {/* Left sidebar */}
                <div className="col-span-3 space-y-4">
                  <div className="p-4 rounded-lg border border-sidebar-primary/10 bg-sidebar-primary/5">
                    <div className="text-xs font-mono text-sidebar-primary uppercase tracking-wider font-semibold mb-3">
                      Navigation
                    </div>
                    <div className="space-y-2">
                      {["Forms", "Analytics", "Automation", "Users"].map(
                        (item) => (
                          <div
                            key={item}
                            className="text-sm text-foreground/80 py-2 px-3 rounded hover:bg-sidebar-primary/20 transition-colors cursor-pointer">
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Main content area */}
                <div className="col-span-9 space-y-6">
                  {/* Top stats - bright colored cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: "Active Forms",
                        value: "847",
                        color: "text-chart-1",
                      },
                      {
                        label: "This Month",
                        value: "12.4K",
                        color: "text-chart-3",
                      },
                      {
                        label: "Completion Rate",
                        value: "94%",
                        color: "text-chart-2",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-lg border border-border/50 bg-secondary/20">
                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                          {stat.label}
                        </div>
                        <div className={cn("text-2xl font-bold", stat.color)}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart - bars with bright colors */}
                  <div className="p-4 rounded-lg border border-border/50 bg-secondary/20">
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                      Submissions (Last 7 Days)
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[65, 45, 78, 92, 55, 88, 71].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-sidebar-primary to-chart-3 opacity-80"
                          style={{ height: `${(height / 100) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / MARQUEE */}
      <section className="relative w-full py-12 border-b border-border bg-card/20">
        <div className="overflow-hidden">
          <div
            ref={marqueeRef}
            className="relative whitespace-nowrap"
            data-marquee-content>
            {[...Array(2)].map((_, batch) =>
              [
                "Netflix",
                "Stripe",
                "Vercel",
                "Figma",
                "Notion",
                "Linear",
                "GitHub",
                "Slack",
                "Discord",
              ].map((name, i) => (
                <span
                  key={`${batch}-${i}`}
                  className="inline-block px-8 text-sm font-mono text-muted-foreground/50 tracking-wide">
                  {name}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WORKFLOWS / FEATURES - HORIZONTAL SCROLL */}
      <section
        ref={problemContainerRef}
        className="relative w-full border-b border-border">
        <div className="h-full">
          <div
            ref={problemScrollRef}
            className="flex gap-4 px-6 md:px-12 py-20">
            {[
              {
                title: "Build Custom Forms",
                description:
                  "No-code form builder. Collect leads, feedback, or support tickets instantly.",
                icon: Layers,
              },
              {
                title: "Real-Time Analytics",
                description:
                  "Track submissions, completion rates, and user behavior in beautiful dashboards.",
                icon: BarChart3,
              },
              {
                title: "Automation Rules",
                description:
                  "Trigger emails, webhooks, or database actions based on form responses.",
                icon: Zap,
              },
              {
                title: "Team Collaboration",
                description:
                  "Manage users, roles, and permissions. Assign reviewers and track activity logs.",
                icon: Users,
              },
              {
                title: "Custom Branding",
                description:
                  "White-label your domain, logo, and colors. Make it feel like yours.",
                icon: Activity,
              },
            ].map((item, idx) => (
              <ProblemCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="relative w-full py-20 px-4 md:px-12 border-b border-border">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--sidebar-primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0",
            opacity: 0.04,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
              Platform Features
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Everything you need to automate client operations
            </p>
          </div>

          <div
            ref={bentoContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large card - Analytics */}
            <div
              data-bento-card
              className="md:col-span-2 p-6 rounded-xl border border-border bg-card/50 backdrop-blur group hover:border-sidebar-primary/50 transition-colors">
              <div className="mb-4">
                <BarChart3 className="w-6 h-6 text-sidebar-primary/60" />
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time dashboards show submission trends, user engagement,
                and completion patterns.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {["847", "12.4K", "94%"].map((val, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-border/50 bg-sidebar-primary/5">
                    <div className="text-2xl font-bold">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tall card - AI */}
            <div
              data-bento-card
              className="md:row-span-2 p-6 rounded-xl border border-border bg-card/50 backdrop-blur group hover:border-sidebar-primary/50 transition-colors">
              <Zap className="w-6 h-6 text-sidebar-primary/60 mb-4" />
              <h3 className="text-lg font-bold tracking-tight mb-2">
                Automation Engine
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Trigger actions—emails, webhooks, database updates—automatically
                when forms are submitted.
              </p>
              <div className="space-y-2 mt-6">
                {["Email", "Webhook", "Database", "Slack"].map((action) => (
                  <div
                    key={action}
                    className="text-xs font-mono text-muted-foreground/60 py-2 px-2 rounded border border-border/30">
                    → {action}
                  </div>
                ))}
              </div>
            </div>

            {/* Card - Integrations */}
            <div
              data-bento-card
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur group hover:border-sidebar-primary/50 transition-colors">
              <Layers className="w-6 h-6 text-sidebar-primary/60 mb-4" />
              <h3 className="text-lg font-bold tracking-tight mb-2">
                100+ Integrations
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect to your favorite tools: Slack, Zapier, Make, webhooks,
                and APIs.
              </p>
            </div>

            {/* Card - Speed */}
            <div
              data-bento-card
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur group hover:border-sidebar-primary/50 transition-colors">
              <Activity className="w-6 h-6 text-sidebar-primary/60 mb-4" />
              <h3 className="text-lg font-bold tracking-tight mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-muted-foreground">
                Instant form loads, sub-second submissions, and real-time
                updates powered by edge servers.
              </p>
            </div>

            {/* Card - Security */}
            <div
              data-bento-card
              className="md:col-span-2 p-6 rounded-xl border border-border bg-card/50 backdrop-blur group hover:border-sidebar-primary/50 transition-colors">
              <Lock className="w-6 h-6 text-sidebar-primary/60 mb-4" />
              <h3 className="text-lg font-bold tracking-tight mb-2">
                Enterprise Security
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bank-grade encryption, GDPR compliance, SSO, and audit logs for
                teams that need security.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "256-bit AES",
                  "SOC 2 Type II",
                  "GDPR Ready",
                  "SSO Support",
                ].map((badge) => (
                  <div
                    key={badge}
                    className="text-xs font-mono text-muted-foreground/60 py-1.5 px-2 rounded border border-border/30">
                    ✓ {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative w-full py-20 px-4 md:px-12 border-b border-border">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--sidebar-primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0",
            opacity: 0.04,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Ready to automate?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join engineering teams at Netflix, Stripe, and Vercel who trust
            OpsFlow to manage customer operations.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="px-8 py-3 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 border border-sidebar-primary">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-card transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative w-full py-12 px-4 md:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4">OpsFlow</h4>
              <p className="text-sm text-muted-foreground">
                Client operations made simple.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 OpsFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Problem/Feature Card Component
function ProblemCard({
  item,
}: {
  item: { title: string; description: string; icon: any };
}) {
  const Icon = item.icon;
  return (
    <div
      data-card
      className={cn(
        "flex-shrink-0 w-96 p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:border-sidebar-primary/50 transition-colors"
      )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg bg-sidebar-primary/10")}>
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">{item.title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}
