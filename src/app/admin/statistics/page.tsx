"use client";

import { useEffect, useState } from "react";
import { getMetrics, saveMetrics } from "@/services/profileService";
import { ProfileMetrics } from "@/types/portfolio";
import { Sliders, Check, AlertCircle } from "lucide-react";

export default function AdminStatistics() {
  const [metrics, setMetrics] = useState<ProfileMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error loading metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metrics) return;
    setSaving(true);
    setMessage({ text: "", type: "success" });

    try {
      await saveMetrics(metrics);
      setMessage({ text: "Statistics counters updated successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save changes: ${err.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading counter metrics...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="border border-border-grey bg-white p-8 text-center text-xs text-muted-grey uppercase tracking-widest">
        Counter metrics could not be loaded. Please seed the database first.
      </div>
    );
  }

  const metricKeys: (keyof ProfileMetrics)[] = [
    "projectsDelivered",
    "businessConsultations",
    "toolsHandled",
    "industryDomains",
    "happyClients",
    "automationsBuilt"
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6">
        <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
          Manage Statistics
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
          Configure numerical counters and statistics shown in the Hero, About, and Capabilities sections
        </p>
      </div>

      {message.text && (
        <div className={`text-xs py-3 px-4 text-center border font-light ${
          message.type === "error" 
            ? "bg-red-50 border-red-200 text-red-600" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-border-grey p-8 space-y-8">
          {metricKeys.map((key) => {
            const item = metrics[key];
            return (
              <div
                key={key}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-grey/50 pb-6 last:border-0 last:pb-0 gap-6"
              >
                <div className="flex-grow space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-black">
                    {key.replace(/([A-Z])/g, " $1")} Field
                  </span>
                  <p className="text-[9px] uppercase tracking-widest text-muted-grey font-light">
                    Manage the public display label and switch display state.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-grow md:max-w-md w-full">
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase tracking-widest text-muted-grey font-semibold mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      required
                      value={item.label}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          [key]: { ...item, label: e.target.value }
                        })
                      }
                      className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] uppercase tracking-widest text-muted-grey font-semibold mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      required
                      value={item.value}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          [key]: { ...item, value: e.target.value }
                        })
                      }
                      className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none"
                    />
                  </div>
                </div>

                {/* Enabled Toggle */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">
                    {item.enabled ? "Active" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMetrics({
                        ...metrics,
                        [key]: { ...item, enabled: !item.enabled }
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      item.enabled ? "bg-black" : "bg-[#D4D4D4]"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                        item.enabled ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Statistics..." : "Save Statistics"}
        </button>
      </form>
    </div>
  );
}
