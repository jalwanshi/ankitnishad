"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import { Skill } from "@/types/portfolio";
import { getSkills, addSkill, updateSkill, deleteSkill } from "@/services/skillsService";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(90);
  const [group, setGroup] = useState("Process Automation");

  const loadSkillsData = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillsData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setPercentage(90);
    setGroup("Process Automation");
    setShowModal(true);
  };

  const openEditModal = (item: Skill) => {
    setEditingItem(item);
    setName(item.name || "");
    setPercentage(item.percentage || 90);
    setGroup(item.group || "Process Automation");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { name, percentage: Number(percentage), group };
      if (editingItem) {
        await updateSkill(editingItem.id, data);
      } else {
        await addSkill(data);
      }
      setShowModal(false);
      loadSkillsData();
    } catch (err) {
      console.error(err);
      alert("Failed to save skill.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      loadSkillsData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading skills...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Manage Skills
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Update capability groups, percentages, and labels in your Firestore database
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white border border-border-grey p-8 space-y-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-grey/50 pb-4 last:border-b-0 last:pb-0 gap-4"
          >
            <div className="flex-grow">
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                {skill.group}
              </span>
              <span className="text-sm font-medium text-primary-black">{skill.name}</span>
              <div className="w-full max-w-md h-[3px] bg-border-grey mt-2 overflow-hidden">
                <div className="h-full bg-primary-black" style={{ width: `${skill.percentage}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-primary-black">{skill.percentage}%</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 border border-border-grey text-muted-grey hover:text-primary-black transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white border border-border-grey p-8 max-w-md w-full relative">
            <div className="flex justify-between items-center border-b border-border-grey pb-4 mb-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black">
                {editingItem ? "Edit Skill Capability" : "Add Skill Capability"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-grey hover:text-primary-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Capability Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Process Mapping" 
                  className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Capability Group *</label>
                <select 
                  value={group} 
                  onChange={(e) => setGroup(e.target.value)} 
                  className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none"
                >
                  <option value="Business Development">Business Development</option>
                  <option value="Process Automation">Process Automation</option>
                  <option value="Custom Software Solutioning">Custom Software Solutioning</option>
                  <option value="Other Capabilities">Other Capabilities</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Percentage Level ({percentage}%) *</label>
                <input 
                  type="range" 
                  min={10} 
                  max={100} 
                  step={5}
                  value={percentage} 
                  onChange={(e) => setPercentage(Number(e.target.value))} 
                  className="w-full h-1 bg-border-grey rounded-lg appearance-none cursor-pointer accent-primary-black" 
                />
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
