"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save, X, Eye, FileText, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from "lucide-react";
import {
  getAllCareerTimeline,
  createCareerMilestone,
  updateCareerMilestone,
  deleteCareerMilestone
} from "@/services/careerService";
import { uploadAsset } from "@/services/assetService";
import { CareerMilestone } from "@/types/portfolio";

export default function AdminCareer() {
  const [list, setList] = useState<CareerMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "success" });

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerMilestone | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  // Form Fields
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrentRole, setIsCurrentRole] = useState(false);
  const [roleSummary, setRoleSummary] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

  // Array inputs
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResp, setNewResp] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAch, setNewAch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState("");

  const loadCareerTimeline = async () => {
    try {
      setLoading(true);
      const data = await getAllCareerTimeline();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareerTimeline();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setCompany("");
    setDesignation("");
    setStartDate("");
    setEndDate("");
    setIsCurrentRole(false);
    setRoleSummary("");
    setDisplayOrder(list.length + 1);
    setPublished(true);
    setCompanyLogoUrl("");
    setResponsibilities([]);
    setAchievements([]);
    setSkills([]);
    setTools([]);
    setShowModal(true);
  };

  const openEditModal = (item: CareerMilestone) => {
    setEditingItem(item);
    setCompany(item.company || "");
    setDesignation(item.designation || "");
    setStartDate(item.startDate || "");
    setEndDate(item.endDate || "");
    setIsCurrentRole(item.isCurrentRole || false);
    setRoleSummary(item.roleSummary || "");
    setDisplayOrder(item.displayOrder || 1);
    setPublished(item.published !== false);
    setCompanyLogoUrl(item.companyLogoUrl || "");
    setResponsibilities(item.responsibilities || []);
    setAchievements(item.achievements || []);
    setSkills(item.skills || []);
    setTools(item.tools || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career milestone?")) return;
    try {
      await deleteCareerMilestone(id);
      setMessage({ text: "Milestone deleted successfully!", type: "success" });
      loadCareerTimeline();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Deletion failed: ${err.message}`, type: "error" });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      // Upload under media/ folder to match storage rules
      const url = await uploadAsset(file, "case-studies");
      setCompanyLogoUrl(url);
      setMessage({ text: "Logo uploaded successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Logo upload failed: ${err.message}`, type: "error" });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<CareerMilestone, "id"> = {
      company,
      designation,
      startDate,
      endDate: isCurrentRole ? "Present" : endDate,
      isCurrentRole,
      roleSummary,
      responsibilities,
      achievements,
      skills,
      tools,
      companyLogoUrl,
      displayOrder: Number(displayOrder),
      published
    };

    try {
      if (editingItem) {
        await updateCareerMilestone(editingItem.id, data);
        setMessage({ text: "Milestone updated successfully!", type: "success" });
      } else {
        await createCareerMilestone(data);
        setMessage({ text: "Milestone created successfully!", type: "success" });
      }
      setShowModal(false);
      loadCareerTimeline();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save: ${err.message}`, type: "error" });
    }
  };

  // Array management helpers (with Bulk / Multi-line support)
  const addResp = () => {
    if (!newResp.trim()) return;
    const items = newResp.split(/\n/).map(item => item.replace(/^[\s\-\*\•\+]+/, "").trim()).filter(item => item.length > 0);
    setResponsibilities([...responsibilities, ...items]);
    setNewResp("");
  };
  const removeResp = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addAch = () => {
    if (!newAch.trim()) return;
    const items = newAch.split(/\n/).map(item => item.replace(/^[\s\-\*\•\+]+/, "").trim()).filter(item => item.length > 0);
    setAchievements([...achievements, ...items]);
    setNewAch("");
  };
  const removeAch = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const items = newSkill.split(/[\n,]/).map(item => item.replace(/^[\s\-\*\•\+]+/, "").trim()).filter(item => item.length > 0);
    const uniqueItems = Array.from(new Set(items));
    setSkills([...skills, ...uniqueItems.filter(i => !skills.includes(i))]);
    setNewSkill("");
  };
  const removeSkill = (tag: string) => {
    setSkills(skills.filter((s) => s !== tag));
  };

  const addTool = () => {
    if (!newTool.trim()) return;
    const items = newTool.split(/[\n,]/).map(item => item.replace(/^[\s\-\*\•\+]+/, "").trim()).filter(item => item.length > 0);
    const uniqueItems = Array.from(new Set(items));
    setTools([...tools, ...uniqueItems.filter(i => !tools.includes(i))]);
    setNewTool("");
  };
  const removeTool = (tag: string) => {
    setTools(tools.filter((t) => t !== tag));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading career timeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Career Timeline
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Configure dynamic B2B job history, responsibilities, and key B2B achievements
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
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

      {/* Career Entries List */}
      <div className="space-y-4">
        {list.length > 0 ? (
          list.map((item) => (
            <div
              key={item.id}
              className={`bg-white border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary-black transition-colors ${
                !item.published ? "border-dashed border-muted-grey opacity-75" : "border-border-grey"
              }`}
            >
              <div className="flex gap-4 items-start">
                {item.companyLogoUrl ? (
                  <img
                    src={item.companyLogoUrl}
                    alt={item.company}
                    className="w-12 h-12 object-contain border border-border-grey p-1 bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-soft-bg border border-border-grey flex items-center justify-center text-[10px] text-muted-grey uppercase tracking-widest">
                    Logo
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-grey font-bold">
                      {item.company} • {item.startDate} - {item.endDate}
                    </span>
                    {!item.published && (
                      <span className="text-[8px] uppercase tracking-widest bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                        Draft
                      </span>
                    )}
                    {item.isCurrentRole && (
                      <span className="text-[8px] uppercase tracking-widest bg-black text-white px-2 py-0.5 font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-normal text-primary-black mt-1">
                    {item.designation}
                  </h3>
                  <p className="text-xs text-dark-grey font-light leading-relaxed mt-2 max-w-2xl">
                    {item.roleSummary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-[9px] uppercase tracking-widest text-muted-grey self-center mr-1">Order: {item.displayOrder}</span>
                    {item.skills?.map((s) => (
                      <span key={s} className="text-[9px] uppercase tracking-wider bg-soft-bg border border-border-grey px-2 py-0.5 text-muted-grey">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 border border-border-grey text-muted-grey hover:text-primary-black hover:border-primary-black transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-border-grey bg-white py-16 text-center text-xs text-muted-grey uppercase tracking-widest">
            Career details are being updated. Click "Add Milestone" to populate.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white border border-border-grey p-8 max-w-3xl w-full relative my-8">
            <div className="absolute inset-0 border border-primary-black translate-x-2.5 translate-y-2.5 -z-10" />

            <div className="flex justify-between items-center border-b border-border-grey pb-4 mb-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black">
                {editingItem ? "Edit Career Entry" : "Add Career Entry"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-grey hover:text-primary-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Company / Organization *</label>
                  <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Designation / Role Title *</label>
                  <input type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Start Date (e.g. 2023 or July 2023) *</label>
                  <input type="text" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">End Date (or 'Present') *</label>
                  <input type="text" required={!isCurrentRole} disabled={isCurrentRole} value={isCurrentRole ? "Present" : endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none disabled:opacity-50" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-grey font-semibold mb-3 cursor-pointer select-none">
                    <input type="checkbox" checked={isCurrentRole} onChange={(e) => setIsCurrentRole(e.target.checked)} className="border border-border-grey" />
                    This is my current role
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Display Order (Sorting) *</label>
                  <input type="number" required min={1} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Publishing Status *</label>
                  <select value={published ? "true" : "false"} onChange={(e) => setPublished(e.target.value === "true")} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none">
                    <option value="true">Published</option>
                    <option value="false">Save as Draft</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Company Logo (Optional)</label>
                  <div className="flex gap-2">
                    <input type="text" value={companyLogoUrl} onChange={(e) => setCompanyLogoUrl(e.target.value)} placeholder="URL or upload logo..." className="flex-grow border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none" />
                    <label className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-3 py-2 text-[9px] uppercase tracking-widest font-semibold transition-colors cursor-pointer flex items-center justify-center">
                      {logoUploading ? "..." : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Brief Role Summary *</label>
                <textarea rows={3} required value={roleSummary} onChange={(e) => setRoleSummary(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              {/* Responsibilities list input */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Key Responsibilities</label>
                <div className="flex gap-2">
                  <textarea rows={2} placeholder="Paste multiple bullet points or type a single one..." value={newResp} onChange={(e) => setNewResp(e.target.value)} className="flex-grow border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none resize-none" />
                  <button type="button" onClick={addResp} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <ul className="space-y-1.5 pt-2">
                  {responsibilities.map((resp, i) => (
                    <li key={i} className="flex justify-between items-center text-xs bg-soft-bg border border-border-grey py-1.5 px-3">
                      <span className="font-light text-dark-grey">{resp}</span>
                      <button type="button" onClick={() => removeResp(i)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements list input */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Key Achievements / Quantified Outcomes</label>
                <div className="flex gap-2">
                  <textarea rows={2} placeholder="Paste multiple bullet points or type a single one..." value={newAch} onChange={(e) => setNewAch(e.target.value)} className="flex-grow border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none resize-none" />
                  <button type="button" onClick={addAch} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <ul className="space-y-1.5 pt-2">
                  {achievements.map((ach, i) => (
                    <li key={i} className="flex justify-between items-center text-xs bg-soft-bg border border-border-grey py-1.5 px-3">
                      <span className="font-light text-dark-grey">{ach}</span>
                      <button type="button" onClick={() => removeAch(i)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills Tags Input */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Skills (Tags)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. Sales, Proposal Writing (comma separated)..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-grow border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none" />
                  <button type="button" onClick={addSkill} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skills.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-soft-bg border border-border-grey px-2.5 py-1 text-muted-grey">
                      {tag}
                      <button type="button" onClick={() => removeSkill(tag)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools Tags Input */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Tools / Software Used (Tags)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. Hubspot, Salesforce (comma separated)..." value={newTool} onChange={(e) => setNewTool(e.target.value)} className="flex-grow border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none" />
                  <button type="button" onClick={addTool} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tools.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-soft-bg border border-border-grey px-2.5 py-1 text-muted-grey">
                      {tag}
                      <button type="button" onClick={() => removeTool(tag)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-t border-border-grey pt-6 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-border-grey hover:border-primary-black py-3 text-xs uppercase tracking-widest font-semibold text-muted-grey hover:text-primary-black transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  {editingItem ? "Save Milestone" : "Create Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
