"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPanel({ formId }: { formId: string }) {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { fields } = useAppSelector((state) => state.builder);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]); // <--- Changed from string to Array

  // 1. Fetch Chart Data (Same as before)
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (formId) fetchAnalytics();
  }, [formId, accessToken]);

  // 2. Fetch AI Insight (Updated to expect JSON)
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
      if (json.success) setInsights(json.insights); // Store array
    } catch (err) {
      alert("AI Analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to render icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "positive":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-purple-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "positive":
        return "bg-green-50 border-green-100";
      case "trend":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-purple-50 border-purple-100";
    }
  };

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="h-full overflow-auto bg-gray-50 p-8">
      {/* Header Stats & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-medium">Total Responses</h3>
          <p className="text-5xl font-bold text-gray-900 mt-2">
            {data?.total || 0}
          </p>
        </div>

        {/* AI Insight Section (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 fill-purple-100" />
              AI Analysis
            </h3>
            {insights.length === 0 && (
              <button
                onClick={handleAiAnalyze}
                disabled={aiLoading}
                className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black disabled:opacity-50 flex items-center gap-2 transition-all">
                {aiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Generate Report
              </button>
            )}
          </div>

          {/* INSIGHT CARDS RENDERER */}
          {insights.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${getInsightColor(
                    insight.type
                  )}`}>
                  <div className="mb-2">{getInsightIcon(insight.type)}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm text-gray-500">
                {aiLoading
                  ? "Analyzing data patterns..."
                  : "Click 'Generate Report' to get AI-powered insights."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid (Same as before) */}
      <div className="space-y-8">
        {/* ... Keep your existing Recharts code here ... */}
        {/* If you need me to paste the chart code again, let me know! */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" /> Submission Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.lineChartData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#2563eb",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorical Distributions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field: any) => {
            if (!["select", "radio", "checkbox"].includes(field.type))
              return null;
            const chartData = data?.distribution[field.id] || [];
            if (chartData.length === 0) return null;

            return (
              <div
                key={field.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3
                  className="font-semibold text-gray-800 mb-4 text-sm truncate"
                  title={field.label}>
                  {field.label}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
