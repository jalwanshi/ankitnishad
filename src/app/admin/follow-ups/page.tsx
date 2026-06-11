"use client";

import { useState } from "react";
import { Search, Calendar, Phone, Mail, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";

interface FollowUp {
  id: string;
  clientName: string;
  companyName: string;
  type: "Call" | "Email" | "LinkedIn" | "WhatsApp" | "Meeting" | "Proposal Reminder" | "General Follow-up";
  dueDate: string;
  status: "Overdue" | "Today" | "Upcoming" | "Completed";
  notes: string;
}

const mockFollowUps: FollowUp[] = [
  {
    id: "f1",
    clientName: "Rajesh Kumar",
    companyName: "Metro Care Hospital",
    type: "Call",
    dueDate: "2026-06-11",
    status: "Today",
    notes: "Call to discuss integration endpoints for billing modules."
  },
  {
    id: "f2",
    clientName: "Amit Sharma",
    companyName: "Apex Manufacturing",
    type: "Proposal Reminder",
    dueDate: "2026-06-10",
    status: "Overdue",
    notes: "Follow up on proposal document. Client wanted to check budget with co-founder."
  },
  {
    id: "f3",
    clientName: "Vikram Malhotra",
    companyName: "Malhotra Logistics",
    type: "Meeting",
    dueDate: "2026-06-15",
    status: "Upcoming",
    notes: "Zoom demonstration of HubSpot CRM pipelines configurations."
  }
];

export default function AdminFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [activeTab, setActiveTab] = useState<string>("All");

  const handleComplete = (id: string) => {
    const updated = followUps.map((item) =>
      item.id === id ? { ...item, status: "Completed" as const } : item
    );
    setFollowUps(updated);
  };

  const filteredFollowUps = activeTab === "All"
    ? followUps
    : followUps.filter((item) => item.status === activeTab);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-border-grey pb-6">
        <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
          Follow-Up CRM
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
          Track outstanding action items and meeting appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-grey pb-4">
        {["All", "Overdue", "Today", "Upcoming", "Completed"].map((tab) => {
          const count = tab === "All" ? followUps.length : followUps.filter((item) => item.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
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
                <span className="text-[9px] uppercase tracking-wider text-muted-grey">
                  {item.dueDate}
                </span>
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
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black text-[10px] uppercase tracking-widest transition-colors font-semibold"
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
    </div>
  );
}
