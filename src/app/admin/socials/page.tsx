"use client";

import { useEffect, useState } from "react";
import { getSocialLinks, saveSocialLinks } from "@/services/profileService";
import { SocialLink } from "@/types/portfolio";
import { Plus, Trash2, Edit, Save, X, Share2, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminSocials() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  // Modal and new link fields
  const [showModal, setShowModal] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const data = await getSocialLinks();
        setLinks(data);
      } catch (err) {
        console.error("Error loading socials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocials();
  }, []);

  const handleSaveAll = async (updatedLinks: SocialLink[]) => {
    setSaving(true);
    setMessage({ text: "", type: "success" });
    try {
      const sorted = [...updatedLinks].sort((a, b) => a.displayOrder - b.displayOrder);
      await saveSocialLinks(sorted);
      setLinks(sorted);
      setMessage({ text: "Social links saved successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save: ${err.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnable = (id: string) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, isEnabled: !link.isEnabled } : link
    );
    handleSaveAll(updated);
  };

  const handleDisplayOrderChange = (id: string, newOrder: number) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, displayOrder: newOrder } : link
    );
    setLinks(updated);
  };

  const handleUrlChange = (id: string, newUrl: string) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, url: newUrl } : link
    );
    setLinks(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this social link?")) return;
    const updated = links.filter((link) => link.id !== id);
    handleSaveAll(updated);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;

    const newLink: SocialLink = {
      id: platform.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      platform: platform.trim(),
      url: url.trim(),
      isEnabled: true,
      displayOrder: Number(displayOrder)
    };

    const updated = [...links, newLink];
    handleSaveAll(updated);
    setShowModal(false);
    setPlatform("");
    setUrl("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading social links...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Social Links
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Configure social profiles, telephone channels, and B2B communication destinations
          </p>
        </div>
        <button
          onClick={() => {
            setDisplayOrder(links.length + 1);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
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

      {/* Socials List Form */}
      <div className="bg-white border border-border-grey p-8 space-y-6">
        {links.length > 0 ? (
          <div className="space-y-6">
            {links.map((link) => (
              <div
                key={link.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-grey/50 pb-4 last:border-0 last:pb-0 gap-4 ${
                  !link.isEnabled ? "opacity-60" : ""
                }`}
              >
                <div className="flex-grow space-y-1 w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-black">
                    {link.platform}
                  </span>
                  <div className="flex gap-2 w-full max-w-lg mt-1">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUrlChange(link.id, e.target.value)}
                      className="w-full border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none focus:border-primary-black"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex flex-col items-center">
                    <label className="text-[8px] uppercase tracking-widest text-muted-grey font-semibold mb-1">
                      Sort
                    </label>
                    <input
                      type="number"
                      value={link.displayOrder}
                      onChange={(e) => handleDisplayOrderChange(link.id, Number(e.target.value))}
                      className="w-12 border border-border-grey bg-main-bg py-1 px-2 text-xs font-light text-center focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase tracking-widest text-muted-grey font-semibold mb-1">
                      Status
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(link.id)}
                      className="p-1 border border-border-grey hover:border-primary-black text-muted-grey hover:text-primary-black text-xs uppercase tracking-wider transition-colors font-semibold"
                    >
                      {link.isEnabled ? "Active" : "Hidden"}
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-end h-full pt-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      className="p-2 border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => handleSaveAll(links)}
              disabled={saving}
              className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Links & Order"}
            </button>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-grey uppercase tracking-widest">
            No social links configured. Click "Add Social Link" to configure.
          </div>
        )}
      </div>

      {/* Add Social Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white border border-border-grey p-8 max-w-sm w-full relative">
            <div className="absolute inset-0 border border-primary-black translate-x-2 translate-y-2 -z-10" />

            <div className="flex justify-between items-center border-b border-border-grey pb-3 mb-6">
              <h3 className="font-display text-lg uppercase tracking-wider text-primary-black">
                Add Social Link
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-grey hover:text-primary-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Platform Name</label>
                <input
                  type="text"
                  placeholder="e.g. GitHub, Twitter"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Profile URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-border-grey hover:border-primary-black py-2.5 text-[10px] uppercase tracking-widest font-semibold text-muted-grey hover:text-primary-black transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
