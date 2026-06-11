"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/services/profileService";
import { Profile } from "@/types/portfolio";
import { Settings, Globe, Shield, RefreshCw } from "lucide-react";

export default function AdminSettings() {
  const [formData, setFormData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [activeTab, setActiveTab] = useState("seo");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setFormData(data);
      } catch (err) {
        console.error("Failed to load settings data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    setMessage({ text: "", type: "success" });

    try {
      await saveProfile(formData);
      setMessage({ text: "Website settings saved successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save settings: ${err.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading settings...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="border border-border-grey bg-white p-8 text-center text-xs text-muted-grey uppercase tracking-widest">
        Settings data could not be loaded. Please try seeding the database first.
      </div>
    );
  }

  const tabs = [
    { id: "seo", label: "Global SEO", icon: <Globe className="w-4 h-4" /> },
    { id: "general", label: "General Configuration", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6">
        <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
          Website Settings
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
          Configure search engine parameters, metadata configurations, and global options
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-grey pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary-black text-white"
                : "bg-white text-muted-grey border border-border-grey hover:border-primary-black hover:text-primary-black"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border border-border-grey bg-white p-8 space-y-6">
        {/* Tab 1: Global SEO */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Homepage SEO Title
              </label>
              <input
                type="text"
                required
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />
              <span className="text-[9px] text-muted-grey mt-1 uppercase tracking-wider">
                Recommended length: 50-60 characters. Shows in search engine listings and browser tabs.
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                SEO Meta Description
              </label>
              <textarea
                rows={4}
                required
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black resize-none"
              />
              <span className="text-[9px] text-muted-grey mt-1 uppercase tracking-wider">
                Recommended length: 150-160 characters. A brief summary of the portfolio page contents.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  System Email (Admin Notifications)
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="border border-border-grey bg-soft-bg py-3 px-4 text-xs font-light focus:outline-none cursor-not-allowed text-muted-grey"
                />
                <span className="text-[9px] text-muted-grey mt-1 uppercase tracking-wider">
                  Configured under Profile details.
                </span>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Default Locality / Country
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
            </div>

            <div className="p-4 bg-soft-bg border border-border-grey flex items-start gap-3 mt-4">
              <Shield className="w-5 h-5 text-muted-grey flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] uppercase font-semibold text-primary-black tracking-wider">
                  Security Check & Storage Scopes
                </h4>
                <p className="text-[10px] text-muted-grey leading-relaxed mt-1">
                  Access token validations, document writes and asset storage are secured by Firebase rules. 
                  Admins must have an active entry inside the `adminUsers` Firestore collection matching their UID.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Settings..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
