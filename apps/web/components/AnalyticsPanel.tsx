"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import gsap from "gsap";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";

/* ---------------- Chart Colors (semantic, reused everywhere) ---------------- */
const CHART_COLORS = [
  "oklch(0.646 0.222 41.116)", // primary / trend
  "oklch(0.6 0.118 184.704)", // positive
  "oklch(0.828 0.189 84.429)", // warning
  "oklch(0.398 0.07 227.392)", // neutral
];

/* ---------------- Insight helpers ---------------- */
const insightStyles: Record<string, string> = {
  positive: "border-chart-2/30 bg-chart-2/5",
  warning: "border-chart-3/30 bg-chart-3/5",
  trend: "border-chart-1/30 bg-chart-1/5",
};

const insightIcon = (type: string) => {
  if (type === "positive") return <CheckCircle className="w-5 h-5" />;
  if (type === "warning") return <AlertTriangle className="w-5 h-5" />;
  if (type === "trend") return <TrendingUp className="w-5 h-5" />;
  return <Info className="w-5 h-5" />;
};

/* ---------------- Chart decision logic ---------------- */
const getChartType = (field: any, length: number) => {
  if (field.type === "checkbox") return "bar";
  if (["select", "radio"].includes(field.type) && length <= 5) return "pie";
  return "bar";
};

export default function AnalyticsPanel({ formId }: { formId: string }) {
  const { accessToken } = useAppSelector((s) => s.auth);
  const { fields } = useAppSelector((s) => s.builder);

  const containerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  /* ---------------- Fetch analytics ---------------- */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `http://localhost:8761/api/forms/${formId}/analytics`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const json = await res.json();
        if (json.success) setData(json);
      } finally {
        setLoading(false);
      }
    };
    if (formId) fetchAnalytics();
  }, [formId, accessToken]);

  /* ---------------- AI insight ---------------- */
  const handleAiAnalyze = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8761/api/forms/${formId}/ai-insight`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const json = await res.json();
      if (json.success) setInsights(json.insights);
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------------- Animations ---------------- */
  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background p-8 text-foreground">
      {/* ---------------- Header ---------------- */}
      <div className="mb-10" data-animate>
        <h1 className="text-4xl font-bold tracking-tight">Form Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Real-time insights and AI-powered analysis
        </p>
      </div>

      {/* ---------------- Stats ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" data-animate>
        {[
          {
            label: "Total Responses",
            value: data?.total || 0,
            icon: Users,
            color: "text-chart-1",
          },
          {
            label: "Completion Rate",
            value: `${data?.completionRate || 0}%`,
            icon: CheckCircle,
            color: "text-chart-2",
          },
          {
            label: "Avg Time",
            value: data?.avgTime || "-",
            icon: Activity,
            color: "text-chart-4",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className={cn("text-3xl font-bold", stat.color)}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- AI Insights ---------------- */}
      <div
        className="rounded-xl border border-border bg-card/50 p-6 mb-10"
        data-animate>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-sidebar-primary" />
            <h3 className="text-lg font-bold">AI Analysis</h3>
          </div>

          {insights.length === 0 && (
            <button
              onClick={handleAiAnalyze}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate Report
            </button>
          )}
        </div>

        {insights.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((i, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border p-5 transition hover:scale-[1.02]",
                  insightStyles[i.type]
                )}>
                <div className="mb-2">{insightIcon(i.type)}</div>
                <h4 className="font-semibold mb-1">{i.title}</h4>
                <p className="text-sm text-muted-foreground">{i.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-10 text-center text-muted-foreground">
            {aiLoading
              ? "Analyzing patterns in your data…"
              : "Generate AI insights from real responses"}
          </div>
        )}
      </div>

      {/* ---------------- Submission Trend (Smooth Area) ---------------- */}
      <div
        className="rounded-xl border border-border bg-card/50 p-6 mb-10"
        data-animate>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-chart-1" />
          Submission Activity
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.lineChartData || []}>
              <defs>
                <linearGradient
                  id="submissionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS[0]}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS[0]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS[0]}
                strokeWidth={3}
                fill="url(#submissionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- Field Distributions ---------------- */}
      <div className="grid md:grid-cols-2 gap-6">
        {fields.map((field: any) => {
          if (!["select", "radio", "checkbox"].includes(field.type))
            return null;

          const chartData = data?.distribution[field.id] || [];
          if (!chartData.length) return null;

          const chartType = getChartType(field, chartData.length);

          return (
            <div
              key={field.id}
              className="rounded-xl border border-border bg-card/50 p-6"
              data-animate>
              <h4 className="font-semibold mb-4 truncate" title={field.label}>
                {field.label}
              </h4>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "pie" ? (
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}>
                        {chartData.map((_: any, i: number) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal
                        vertical={false}
                      />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={90} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {chartData.map((_: any, i: number) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
