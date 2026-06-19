"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/services/profileService";
import { Profile } from "@/types/portfolio";
import { Files, Trash2 } from "lucide-react";
import BulkImportModal from "@/components/admin/BulkImportModal";
import {
  BulkImportRecord,
  getString,
  requireFields
} from "@/lib/bulkImport";

export default function AdminProfile() {
  const [formData, setFormData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [activeTab, setActiveTab] = useState("personal");
  const [showLinkedInBulkModal, setShowLinkedInBulkModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setFormData(data);
      } catch (err) {
        console.error(err);
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
      setMessage({ text: "Profile details updated successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save changes: ${err.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLinkedInBulkImport = async (records: BulkImportRecord[]) => {
    if (!formData) throw new Error("Profile data is not available.");

    const importedCodes = records.map((record, index) => {
      requireFields(record, ["embedCode"], index + 2);
      return getString(record, "embedCode");
    });

    setFormData({
      ...formData,
      linkedinEmbedCodes: [
        ...(formData.linkedinEmbedCodes || []),
        ...importedCodes
      ]
    });
    setMessage({
      text: `${importedCodes.length} LinkedIn posts added. Save Changes to publish them.`,
      type: "success"
    });
    return importedCodes.length;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading profile details...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="border border-border-grey bg-white p-8 text-center text-xs text-muted-grey uppercase tracking-widest">
        Profile data could not be loaded. Please try seeding the database first.
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "bio", label: "Bios & Taglines" },
    { id: "hero", label: "Hero Customization" },
    { id: "seo", label: "SEO Settings" }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6">
        <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
          Profile & Bio
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
          Update your public contact info, taglines, biographies, and homepage configuration
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
            className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary-black text-white"
                : "bg-white text-muted-grey border border-border-grey hover:border-primary-black hover:text-primary-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border border-border-grey bg-white p-8 space-y-6">
        {/* Tab 1: Personal Info */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Role Title / Designation
                </label>
                <input
                  type="text"
                  required
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Location
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

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                required
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">
                  LinkedIn Featured Posts (Embed Codes)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLinkedInBulkModal(true)}
                    className="flex items-center gap-1.5 border border-primary-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary-black transition-colors hover:bg-primary-black hover:text-white"
                  >
                    <Files className="h-3.5 w-3.5" />
                    Bulk Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const codes = formData.linkedinEmbedCodes || [];
                      setFormData({ ...formData, linkedinEmbedCodes: [...codes, ""] });
                    }}
                    className="text-[10px] uppercase tracking-widest text-primary-black font-semibold border border-primary-black px-3 py-1.5 hover:bg-primary-black hover:text-white transition-colors"
                  >
                    + Add Post
                  </button>
                </div>
              </div>
              
              {(formData.linkedinEmbedCodes || []).map((code, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    rows={4}
                    value={code}
                    onChange={(e) => {
                      const newCodes = [...(formData.linkedinEmbedCodes || [])];
                      newCodes[index] = e.target.value;
                      setFormData({ ...formData, linkedinEmbedCodes: newCodes });
                    }}
                    placeholder='<iframe src="https://www.linkedin.com/embed/..." ...></iframe>'
                    className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newCodes = [...(formData.linkedinEmbedCodes || [])];
                      newCodes.splice(index, 1);
                      setFormData({ ...formData, linkedinEmbedCodes: newCodes });
                    }}
                    className="p-3 border border-border-grey hover:border-red-500 text-dark-grey hover:text-red-500 transition-colors bg-white shrink-0 flex items-center justify-center"
                    title="Remove Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {(!formData.linkedinEmbedCodes || formData.linkedinEmbedCodes.length === 0) && (
                <div className="text-xs text-muted-grey font-light italic border border-dashed border-border-grey p-4 text-center">
                  No LinkedIn posts added yet. Click "+ Add Post" to embed one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Bios & Taglines */}
        {activeTab === "bio" && (
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Primary Tagline (About / Main)
              </label>
              <input
                type="text"
                required
                value={formData.professionalTagline}
                onChange={(e) => setFormData({ ...formData, professionalTagline: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Short Professional Bio (Hero summary / sidebar)
              </label>
              <textarea
                rows={3}
                required
                value={formData.shortBio}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Detailed Professional Bio (About Section)
              </label>
              <textarea
                rows={10}
                required
                value={formData.detailedBio}
                onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Hero Customization */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Hero Eyebrow Text
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroEyebrow}
                  onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Hero Primary CTA Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroPrimaryCtaText}
                  onChange={(e) => setFormData({ ...formData, heroPrimaryCtaText: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Hero Main Heading
              </label>
              <input
                type="text"
                required
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                Hero Supporting Text
              </label>
              <textarea
                rows={3}
                required
                value={formData.heroSupportingText}
                onChange={(e) => setFormData({ ...formData, heroSupportingText: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                  Hero Secondary CTA Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroSecondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, heroSecondaryCtaText: e.target.value })}
                  className="border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SEO Settings */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                SEO Title Template
              </label>
              <input
                type="text"
                required
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full border border-border-grey bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black"
              />
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
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>

      <BulkImportModal
        open={showLinkedInBulkModal}
        title="LinkedIn Posts"
        description="Add several LinkedIn embed codes together. JSON is recommended because embed HTML can contain commas and line breaks."
        fields={["embedCode"]}
        sample={{
          embedCode: '<iframe src="https://www.linkedin.com/embed/feed/update/..." title="Embedded post"></iframe>'
        }}
        onClose={() => setShowLinkedInBulkModal(false)}
        onImport={handleLinkedInBulkImport}
      />
    </div>
  );
}
