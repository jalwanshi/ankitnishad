"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Calendar, Trash2, ArrowUpRight, Check, FileSpreadsheet } from "lucide-react";
import {
  getAllEnquiries,
  updateEnquiryStatus,
  updateEnquiryNotes,
  deleteEnquiry
} from "@/services/enquiryService";
import { ContactEnquiry } from "@/types/portfolio";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllEnquiries();
      setEnquiries(data);
      if (data.length > 0) {
        setSelectedEnquiry((prev) => {
          if (prev) {
            const updated = data.find((e) => e.id === prev.id);
            return updated || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      (enq.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === "All" || enq.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: ContactEnquiry["status"]) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setMessage({ text: "Status updated successfully!", type: "success" });
      loadEnquiries();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Failed to update status: ${err.message}`, type: "error" });
    }
  };

  const handleUpdateNotes = async (id: string) => {
    if (!noteText.trim()) return;
    try {
      await updateEnquiryNotes(id, noteText.trim());
      setMessage({ text: "Notes updated successfully!", type: "success" });
      setNoteText("");
      loadEnquiries();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Failed to save notes: ${err.message}`, type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) return;
    try {
      await deleteEnquiry(id);
      setMessage({ text: "Enquiry deleted successfully!", type: "success" });
      loadEnquiries();
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Deletion failed: ${err.message}`, type: "error" });
    }
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    
    const headers = [
      "Name",
      "Company",
      "Designation",
      "Email",
      "Phone",
      "Service Requested",
      "Challenge Description",
      "Status",
      "Source",
      "Submitted At"
    ];

    const rows = filteredEnquiries.map((e) => {
      const escape = (val: any) => `"${(val || "").toString().replace(/"/g, '""')}"`;
      
      let dateStr = "";
      if (e.createdAt) {
        if (e.createdAt.toDate) {
          dateStr = e.createdAt.toDate().toLocaleString();
        } else if (e.createdAt.seconds) {
          dateStr = new Date(e.createdAt.seconds * 1000).toLocaleString();
        } else {
          dateStr = new Date(e.createdAt).toLocaleString();
        }
      }

      return [
        escape(e.fullName),
        escape(e.companyName),
        escape(e.designation),
        escape(e.email),
        escape(e.phone),
        escape(e.serviceRequired),
        escape(e.challenge),
        escape(e.status),
        escape(e.source),
        escape(dateStr)
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ankit_nishad_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading enquiry CRM...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Contact Enquiries
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Review, qualify, and track business lead entries
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredEnquiries.length === 0}
          className="flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export to CSV
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Enquiries List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-border-grey text-xs uppercase tracking-widest py-3 pl-10 pr-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors"
              />
              <Search className="w-4 h-4 text-muted-grey absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="bg-white border border-border-grey text-xs uppercase tracking-widest px-4 py-3 text-primary-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredEnquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <button
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`w-full text-left p-5 border transition-all duration-300 flex flex-col justify-between min-h-[140px] bg-white cursor-pointer ${
                    isSelected ? "border-primary-black shadow-sm" : "border-border-grey hover:border-primary-black"
                  }`}
                >
                  <div className="w-full flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold">
                        {enq.companyName}
                      </span>
                      <h4 className="font-display text-base font-normal text-primary-black mt-0.5">
                        {enq.fullName}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-grey/50 pt-4 mt-2">
                    <span className="text-[10px] text-muted-grey">{getFormatDate(enq.createdAt)}</span>
                    <span className="text-[9px] uppercase tracking-widest text-primary-black font-semibold">
                      {enq.status}
                    </span>
                  </div>
                </button>
              );
            })}
            {filteredEnquiries.length === 0 && (
              <p className="text-center py-10 text-xs text-muted-grey uppercase tracking-widest">
                No entries match your search
              </p>
            )}
          </div>
        </div>

        {/* Right: Selected Enquiry Detail View */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="border border-border-grey bg-white p-8 md:p-10 space-y-8">
              {/* Head details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-border-grey pb-6 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-1">
                    {selectedEnquiry.designation || "Executive"} @ {selectedEnquiry.companyName}
                  </span>
                  <h2 className="font-display text-2xl font-light text-primary-black">
                    {selectedEnquiry.fullName}
                  </h2>
                  <span className="text-xs text-muted-grey block mt-1">Submitted on {getFormatDate(selectedEnquiry.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as ContactEnquiry["status"])}
                    className="bg-white border border-primary-black text-[10px] uppercase tracking-widest py-2 px-3 text-primary-black font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CRM Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-b border-border-grey/50 pb-6">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-muted-grey" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-primary-black hover:underline font-medium">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-muted-grey" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-primary-black hover:underline font-medium">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                {selectedEnquiry.linkedinUrl && (
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-grey font-semibold" />
                    <a href={selectedEnquiry.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-black hover:underline font-medium">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Requirement details */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-muted-grey font-bold block">
                  Service Requested: {selectedEnquiry.serviceRequired}
                </span>
                <div className="bg-soft-bg p-6 border border-border-grey">
                  <h4 className="text-[9px] uppercase tracking-widest text-muted-grey font-bold mb-2">
                    Client's Process Challenge
                  </h4>
                  <p className="text-xs text-dark-grey leading-relaxed font-light">
                    {selectedEnquiry.challenge}
                  </p>
                </div>
              </div>

              {/* Internal notes log */}
              <div className="border-t border-border-grey pt-6 space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-muted-grey font-bold block">
                  Internal notes
                </span>
                {selectedEnquiry.notes ? (
                  <p className="text-xs text-dark-grey leading-relaxed font-light italic border-l-2 border-primary-black pl-4 bg-soft-bg/50 py-2 pr-2">
                    {selectedEnquiry.notes}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-grey italic">No internal follow-up notes written yet.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Update follow-up notes..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-grow border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors"
                  />
                  <button
                    onClick={() => handleUpdateNotes(selectedEnquiry.id)}
                    className="bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border-grey bg-white p-20 text-center">
              <p className="text-xs text-muted-grey uppercase tracking-widest">
                Select an enquiry from the sidebar to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
