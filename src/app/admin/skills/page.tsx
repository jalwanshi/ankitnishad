"use client";

import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

export default function AdminSkills() {
  const [skills, setSkills] = useState([
    { name: "Business Process Understanding", percentage: 90, group: "Business Development" },
    { name: "Sales & Solution Strategy", percentage: 85, group: "Business Development" },
    { name: "Process Mapping", percentage: 90, group: "Process Automation" },
    { name: "Automation Strategy", percentage: 90, group: "Process Automation" },
    { name: "CRM / ERP / Odoo / Reporting", percentage: 85, group: "Process Automation" }
  ]);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Manage Skills
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Update capability groups, percentages, and labels
          </p>
        </div>
        <button className="flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white border border-border-grey p-8 space-y-6">
        {skills.map((skill, index) => (
          <div
            key={index}
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
                <button className="p-1.5 border border-border-grey text-muted-grey hover:text-primary-black transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
