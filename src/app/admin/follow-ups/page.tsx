"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Phone, Mail, CheckCircle2, MessageSquare, AlertCircle, Plus, X } from "lucide-react";
import { FollowUp, getFollowUps, addFollowUp, updateFollowUp, deleteFollowUp } from "@/services/followUpService";

export default function AdminFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState<FollowUp["type"]>("Call");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<FollowUp["status"]>("Today");
  const [notes, setNotes] = useState("");

  const loadFollowUpsData = async () => {
    try {
      setLoading(true);
      const data = await getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUpsData();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await updateFollowUp(id, { status: "Completed" });
      setFollowUps(prev => prev.map(item => item.id === id ? { ...item, status: "Completed" as const } : item));
    } catch (err) {
      console.error(err);
      alert("Failed to complete task.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { clientName, companyName, type, dueDate, status, notes };
      await addFollowUp(data);
      setShowModal(false);
      loadFollowUpsData();
      
      // Reset form
      setClientName("");
      setCompanyName("");
      setType("Call");
      setDueDate("");
      setStatus("Today");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Failed to add follow up.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteFollowUp(id);
      loadFollowUpsData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  const filteredFollowUps = activeTab === "All"
    ? followUps
    : followUps.filter((item) => item.status === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading follow-ups...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Follow-Up CRM
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Track outstanding action items and meeting appointments in your Firestore database
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-grey pb-4">
        {["All", "Overdue", "Today", "Upcoming", "Completed"].map((tab) => {
          const count = tab === "All" ? followUps.length : followUps.filter((item) => item.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-primary-black text-white"
                  : "bg-white text-muted-grey border border-border-grey hover:border-primary-black"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Follow-Up List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFollowUps.map((item) => (
          <div
            key={item.id}
            className={`bg-white border p-6 flex flex-col justify-between min-h-[220px] transition-all relative ${
              item.status === "Overdue"
                ? "border-red-200"
                : item.status === "Completed"
                ? "border-green-200 opacity-75"
                : "border-border-grey hover:border-primary-black"
            }`}
          >
            {/* Upper */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 border ${
                  item.status === "Overdue"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : item.status === "Completed"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-soft-bg border-border-grey text-muted-grey"
                }`}>
                  {item.status}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-grey">
                    {item.dueDate}
                  </span>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                    title="Delete task"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-1">
                {item.companyName}
              </span>
              <h3 className="font-display text-lg font-normal text-primary-black mb-3">
                {item.clientName}
              </h3>
              <p className="text-xs text-dark-grey leading-relaxed font-light mb-6">
                {item.notes}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-border-grey/50 pt-4 mt-4">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-primary-black flex items-center gap-1.5">
                Type: {item.type}
              </span>

              {item.status !== "Completed" && (
                <button
                  onClick={() => handleComplete(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black text-[10px] uppercase tracking-widest transition-colors font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredFollowUps.length === 0 && (
          <div className="col-span-full py-16 border border-dashed border-border-grey text-center">
            <p className="text-xs text-muted-grey uppercase tracking-widest">
              No active tasks in this tab.
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white border border-border-grey p-8 max-w-md w-full relative">
            <div className="flex justify-between items-center border-b border-border-grey pb-4 mb-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black">
                Schedule Follow-up Task
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-grey hover:text-primary-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Client Name *</label>
                  <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Ramesh" className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Company Name *</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Metro Care" className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Due Date *</label>
                  <input type="text" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="e.g. 2026-06-25" className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Task Type *</label>
                  <select value={type} onChange={(e) => setType(e.target.value as FollowUp["type"])} className="border border-border-grey bg-main-bg py-2 px-3 text-xs font-light focus:outline-none">
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Proposal Reminder">Proposal Reminder</option>
                    <option value="General Follow-up">General Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Initial Status *</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as FollowUp["status"])} className="border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none">
                  <option value="Today">Today</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Task Description Notes *</label>
                <textarea rows={3} required value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Action items to do..." className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
