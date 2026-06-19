"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, X, Files } from "lucide-react";
import {
  getAllCaseStudies,
  createCaseStudy,
  createCaseStudiesBulk,
  updateCaseStudy,
  deleteCaseStudy
} from "@/services/caseStudyService";
import {
  ensureFirestoreSafeImage,
  uploadAsset
} from "@/services/assetService";
import { CaseStudy } from "@/types/portfolio";
import BulkImportModal from "@/components/admin/BulkImportModal";
import {
  BulkImportRecord,
  createSlug,
  getBoolean,
  getNumber,
  getString,
  getStringList,
  requireFields
} from "@/lib/bulkImport";

export default function AdminProjects() {
  const [list, setList] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "success" });

  // Modal and Form States
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientContext, setClientContext] = useState("");
  const [businessChallenge, setBusinessChallenge] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [ankitRole, setAnkitRole] = useState("");
  const [timeSaved, setTimeSaved] = useState("");
  const [manualWorkReduction, setManualWorkReduction] = useState("");
  const [dataAccuracyImprovement, setDataAccuracyImprovement] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Dynamic Array Fields
  const [operationalGaps, setOperationalGaps] = useState<string[]>([]);
  const [newGap, setNewGap] = useState("");
  const [solutionModules, setSolutionModules] = useState<string[]>([]);
  const [newModule, setNewModule] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      const data = await getAllCaseStudies();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const generateSlug = (val: string) => {
    return createSlug(val);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setIndustry("");
    setClientName("");
    setClientContext("");
    setBusinessChallenge("");
    setProposedSolution("");
    setAnkitRole("");
    setTimeSaved("");
    setManualWorkReduction("");
    setDataAccuracyImprovement("");
    setFinalResult("");
    setCoverImageUrl("");
    setFeatured(false);
    setPublished(true);
    setDisplayOrder(list.length + 1);
    setOperationalGaps([]);
    setSolutionModules([]);
    setTechnologies([]);
    setShowModal(true);
  };

  const openEditModal = (item: CaseStudy) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setSlug(item.slug || "");
    setIndustry(item.industry || "");
    setClientName(item.clientName || "");
    setClientContext(item.clientContext || "");
    setBusinessChallenge(item.businessChallenge || "");
    setProposedSolution(item.proposedSolution || "");
    setAnkitRole(item.ankitRole || "");
    setTimeSaved(item.timeSaved || "");
    setManualWorkReduction(item.manualWorkReduction || "");
    setDataAccuracyImprovement(item.dataAccuracyImprovement || "");
    setFinalResult(item.finalResult || "");
    setCoverImageUrl(item.coverImageUrl || "");
    setFeatured(item.featured || false);
    setPublished(item.published !== false);
    setDisplayOrder(item.displayOrder || 1);
    setOperationalGaps(item.operationalGaps || []);
    setSolutionModules(item.solutionModules || []);
    setTechnologies(item.technologies || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await deleteCaseStudy(id);
      setMessage({ text: "Case study deleted successfully!", type: "success" });
      loadCaseStudies();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Deletion failed: ${err.message}`, type: "error" });
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Upload under media/ folder to match storage rules
      const url = await uploadAsset(file, "case-studies");
      setCoverImageUrl(url);
      setMessage({ text: "Cover image uploaded successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Cover upload failed: ${err.message}`, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      alert("Slug is required.");
      return;
    }

    try {
      const safeCoverImageUrl = coverImageUrl.trim()
        ? await ensureFirestoreSafeImage(coverImageUrl)
        : undefined;
      const data: Omit<CaseStudy, "id"> = {
        title,
        slug: slug.trim(),
        industry,
        clientName: clientName.trim() || undefined,
        clientContext,
        businessChallenge,
        proposedSolution,
        ankitRole,
        timeSaved: timeSaved.trim() || undefined,
        manualWorkReduction: manualWorkReduction.trim() || undefined,
        dataAccuracyImprovement: dataAccuracyImprovement.trim() || undefined,
        finalResult,
        coverImageUrl: safeCoverImageUrl,
        featured,
        published,
        displayOrder: Number(displayOrder),
        operationalGaps,
        solutionModules,
        technologies
      };

      if (safeCoverImageUrl && safeCoverImageUrl !== coverImageUrl) {
        setCoverImageUrl(safeCoverImageUrl);
      }

      if (editingItem) {
        await updateCaseStudy(editingItem.id, data);
        setMessage({ text: "Case study updated successfully!", type: "success" });
      } else {
        await createCaseStudy(data);
        setMessage({ text: "Case study created successfully!", type: "success" });
      }
      setShowModal(false);
      loadCaseStudies();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Failed to save: ${err.message}`, type: "error" });
    }
  };

  const handleBulkImport = async (records: BulkImportRecord[]) => {
    const projects = await Promise.all(
      records.map(async (record, index): Promise<Omit<CaseStudy, "id">> => {
        requireFields(
          record,
          [
            "title",
            "industry",
            "clientContext",
            "businessChallenge",
            "proposedSolution",
            "ankitRole",
            "finalResult"
          ],
          index + 2
        );

        const importedTitle = getString(record, "title");
        const importedCoverImage = getString(record, "coverImageUrl");
        return {
          title: importedTitle,
          slug: createSlug(getString(record, "slug") || importedTitle),
          industry: getString(record, "industry"),
          clientName: getString(record, "clientName") || undefined,
          clientContext: getString(record, "clientContext"),
          businessChallenge: getString(record, "businessChallenge"),
          proposedSolution: getString(record, "proposedSolution"),
          ankitRole: getString(record, "ankitRole"),
          timeSaved: getString(record, "timeSaved") || undefined,
          manualWorkReduction: getString(record, "manualWorkReduction") || undefined,
          dataAccuracyImprovement: getString(record, "dataAccuracyImprovement") || undefined,
          finalResult: getString(record, "finalResult"),
          coverImageUrl: importedCoverImage
            ? await ensureFirestoreSafeImage(importedCoverImage)
            : undefined,
          featured: getBoolean(record, "featured", false),
          published: getBoolean(record, "published", true),
          displayOrder: getNumber(record, "displayOrder", list.length + index + 1),
          operationalGaps: getStringList(record, "operationalGaps"),
          solutionModules: getStringList(record, "solutionModules"),
          technologies: getStringList(record, "technologies")
        };
      })
    );

    const imported = await createCaseStudiesBulk(projects);
    setMessage({ text: `${imported} case studies imported successfully!`, type: "success" });
    await loadCaseStudies();
    setTimeout(() => setMessage({ text: "", type: "success" }), 4000);
    return imported;
  };

  // Array item helpers
  const addGap = () => {
    if (!newGap.trim()) return;
    setOperationalGaps([
      ...operationalGaps,
      ...getStringList({ value: newGap }, "value")
    ]);
    setNewGap("");
  };
  const removeGap = (index: number) => {
    setOperationalGaps(operationalGaps.filter((_, i) => i !== index));
  };

  const addModule = () => {
    if (!newModule.trim()) return;
    setSolutionModules([
      ...solutionModules,
      ...getStringList({ value: newModule }, "value")
    ]);
    setNewModule("");
  };
  const removeModule = (index: number) => {
    setSolutionModules(solutionModules.filter((_, i) => i !== index));
  };

  const addTech = () => {
    if (!newTech.trim()) return;
    const items = getStringList({ value: newTech }, "value");
    setTechnologies([
      ...technologies,
      ...items.filter((item) => !technologies.includes(item))
    ]);
    setNewTech("");
  };
  const removeTech = (tag: string) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading case studies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Case Studies
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Publish, edit, or archive detailed custom software case studies and metrics
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 border border-primary-black bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-black transition-colors hover:bg-primary-black hover:text-white"
          >
            <Files className="w-4 h-4" />
            Bulk Add
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        </div>
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

      {/* Grid list of project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.length > 0 ? (
          list.map((project) => (
            <div
              key={project.id}
              className={`bg-white border p-6 flex flex-col justify-between min-h-[220px] hover:border-primary-black transition-colors ${
                !project.published ? "border-dashed border-muted-grey opacity-75" : "border-border-grey"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-widest text-muted-grey">
                    {project.industry} • Order: {project.displayOrder}
                  </span>
                  <div className="flex gap-1.5 items-center">
                    {project.featured && (
                      <span className="text-[8px] uppercase tracking-widest bg-black text-white px-2 py-0.5 font-semibold">
                        Featured
                      </span>
                    )}
                    <span className={`text-[8px] uppercase tracking-widest border px-2 py-0.5 font-semibold ${
                      project.published ? "bg-soft-bg border-border-grey text-primary-black" : "bg-yellow-50 border-yellow-200 text-yellow-700"
                    }`}>
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-normal text-primary-black mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-dark-grey font-light leading-relaxed line-clamp-3">
                  {project.businessChallenge}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-grey/50 pt-4 mt-6">
                <span className="text-[9px] uppercase font-semibold tracking-wider text-muted-grey truncate max-w-[200px]">
                  Slug: {project.slug}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 border border-border-grey text-muted-grey hover:text-primary-black transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 border border-dashed border-border-grey bg-white py-16 text-center text-xs text-muted-grey uppercase tracking-widest">
            Detailed case studies will be published soon. Click "Add Case Study" to create one.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white border border-border-grey p-8 max-w-4xl w-full relative my-8">
            <div className="absolute inset-0 border border-primary-black translate-x-2.5 translate-y-2.5 -z-10" />

            <div className="flex justify-between items-center border-b border-border-grey pb-4 mb-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black">
                {editingItem ? "Edit Case Study" : "Add Case Study"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-grey hover:text-primary-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Title *</label>
                  <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">URL Slug *</label>
                  <input type="text" required value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Industry *</label>
                  <input type="text" required placeholder="e.g. Healthcare, Retail" value={industry} onChange={(e) => setIndustry(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Client Name (Optional)</label>
                  <input type="text" placeholder="e.g. Metro Care Group" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col justify-end gap-3 pb-1">
                  <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-grey font-semibold cursor-pointer select-none">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                    Featured on Home Page
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Display Order *</label>
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
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Cover Image (Optional)</label>
                  <div className="flex gap-2">
                    <input type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="URL or upload..." className="flex-grow border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none font-mono" />
                    <label className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-3 py-2 text-[9px] uppercase tracking-widest font-semibold transition-colors cursor-pointer flex items-center justify-center">
                      {uploading ? "..." : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Client Context / Context *</label>
                <textarea rows={3} required value={clientContext} onChange={(e) => setClientContext(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Business Challenge *</label>
                <textarea rows={4} required value={businessChallenge} onChange={(e) => setBusinessChallenge(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Proposed Solution *</label>
                <textarea rows={4} required value={proposedSolution} onChange={(e) => setProposedSolution(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Your Role / Contribution *</label>
                <textarea rows={3} required value={ankitRole} onChange={(e) => setAnkitRole(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              {/* Gaps List */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Operational Gaps Identified</label>
                <div className="flex gap-2">
                  <textarea rows={2} placeholder="Paste multiple gaps, one per line..." value={newGap} onChange={(e) => setNewGap(e.target.value)} className="flex-grow resize-none border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none" />
                  <button type="button" onClick={addGap} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <ul className="space-y-1.5 pt-2">
                  {operationalGaps.map((gap, i) => (
                    <li key={i} className="flex justify-between items-center text-xs bg-soft-bg border border-border-grey py-1.5 px-3">
                      <span className="font-light text-dark-grey">{gap}</span>
                      <button type="button" onClick={() => removeGap(i)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution Modules List */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Solution Modules Built</label>
                <div className="flex gap-2">
                  <textarea rows={2} placeholder="Paste multiple modules, one per line..." value={newModule} onChange={(e) => setNewModule(e.target.value)} className="flex-grow resize-none border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none" />
                  <button type="button" onClick={addModule} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <ul className="space-y-1.5 pt-2">
                  {solutionModules.map((mod, i) => (
                    <li key={i} className="flex justify-between items-center text-xs bg-soft-bg border border-border-grey py-1.5 px-3">
                      <span className="font-light text-dark-grey">{mod}</span>
                      <button type="button" onClick={() => removeModule(i)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Tags */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Technologies / Software Used</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add multiple technologies separated by comma..." value={newTech} onChange={(e) => setNewTech(e.target.value)} className="flex-grow border border-border-grey bg-main-bg py-2 px-4 text-xs font-light focus:outline-none" />
                  <button type="button" onClick={addTech} className="bg-primary-black text-white px-4 py-2 text-xs uppercase font-semibold cursor-pointer">Add Bulk</button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {technologies.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-soft-bg border border-border-grey px-2.5 py-1 text-muted-grey">
                      {tag}
                      <button type="button" onClick={() => removeTech(tag)} className="text-red-500 hover:text-red-700 cursor-pointer"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Outcome / Result Metrics */}
              <div className="border-t border-border-grey pt-6 space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest text-primary-black font-semibold">Outcome & Result Metrics (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Time Saved (e.g. 40% patient check-in speed)</label>
                    <input type="text" placeholder="e.g. 40% patient check-in saved" value={timeSaved} onChange={(e) => setTimeSaved(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Manual Work Reduction (e.g. 60% manual billing)</label>
                    <input type="text" placeholder="e.g. 60% manual billing work reduced" value={manualWorkReduction} onChange={(e) => setManualWorkReduction(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Data Accuracy (e.g. 98% accuracy)</label>
                    <input type="text" placeholder="e.g. 98% data accuracy achieved" value={dataAccuracyImprovement} onChange={(e) => setDataAccuracyImprovement(e.target.value)} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Final Business Result / Impact *</label>
                  <textarea rows={3} required value={finalResult} onChange={(e) => setFinalResult(e.target.value)} className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
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
                  {editingItem ? "Save Case Study" : "Create Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BulkImportModal
        open={showBulkModal}
        title="Case Studies"
        description="Upload a CSV/JSON file or paste multiple case studies. Required fields are validated before anything is written."
        fields={[
          "title",
          "slug",
          "industry",
          "clientName",
          "clientContext",
          "businessChallenge",
          "operationalGaps",
          "proposedSolution",
          "solutionModules",
          "ankitRole",
          "timeSaved",
          "manualWorkReduction",
          "dataAccuracyImprovement",
          "finalResult",
          "technologies",
          "coverImageUrl",
          "featured",
          "published",
          "displayOrder"
        ]}
        sample={{
          title: "Healthcare Workflow Automation",
          slug: "healthcare-workflow-automation",
          industry: "Healthcare",
          clientName: "Metro Care",
          clientContext: "Multi-location clinic using manual registers.",
          businessChallenge: "Patient and billing data was duplicated across teams.",
          operationalGaps: "Duplicate entry | Delayed reporting",
          proposedSolution: "A unified operations and billing workflow.",
          solutionModules: "Patient intake | Billing | Reports",
          ankitRole: "Discovery, process mapping and solution coordination.",
          timeSaved: "40%",
          manualWorkReduction: "60%",
          dataAccuracyImprovement: "98%",
          finalResult: "Faster operations with reliable reporting.",
          technologies: "CRM | Automation | Reporting",
          coverImageUrl: "",
          featured: false,
          published: true,
          displayOrder: list.length + 1
        }}
        onClose={() => setShowBulkModal(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
}
