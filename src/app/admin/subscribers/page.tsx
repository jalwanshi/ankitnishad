"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Mail, Sparkles } from "lucide-react";
import { getAllSubscribers, deleteSubscriber } from "@/services/subscriberService";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error("Error loading subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      await deleteSubscriber(id);
      setMessage({ text: "Subscriber removed successfully!", type: "success" });
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Failed to delete subscriber: ${err.message}`, type: "error" });
    }
  };

  const getFormatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : (timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp));
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredSubscribers = subscribers.filter(sub => 
    (sub.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey font-semibold">
          Loading Subscribers Database...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border-grey pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider flex items-center gap-2">
            Newsletter Subscribers <Sparkles className="w-5 h-5 text-accent-gold" />
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            View, search, and manage email newsletter subscriptions
          </p>
        </div>
      </motion.div>

      {message.text && (
        <div className={`text-xs py-3 px-4 text-center border font-light ${
          message.type === "error" 
            ? "bg-red-50 border-red-200 text-red-600" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Card */}
      <div className="border border-border-grey bg-white rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <input 
              type="text" 
              placeholder="Search subscribers email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-soft-bg border border-border-grey text-[10px] uppercase tracking-widest py-3 pl-10 pr-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors rounded-lg font-medium"
            />
            <Search className="w-4 h-4 text-muted-grey absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          
          <span className="text-[10px] uppercase font-bold text-primary-black border border-border-grey px-3 py-1 bg-soft-bg rounded">
            Total: {filteredSubscribers.length} Subscribers
          </span>
        </div>

        {/* Listing */}
        <div className="overflow-x-auto">
          {filteredSubscribers.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-grey text-[10px] uppercase tracking-widest text-muted-grey">
                  <th className="pb-3 font-semibold">Email Address</th>
                  <th className="pb-3 font-semibold">Subscribed Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-grey/50">
                <AnimatePresence mode="popLayout">
                  {filteredSubscribers.map((sub) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={sub.id} 
                      className="hover:bg-soft-bg/30 group/row"
                    >
                      <td className="py-4 font-medium text-primary-black flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-grey" />
                        <span>{sub.email}</span>
                      </td>
                      <td className="py-4 text-dark-grey">{getFormatDate(sub.subscribedAt)}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 border border-red-50 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors rounded cursor-pointer"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="py-14 text-center text-xs text-muted-grey uppercase tracking-widest border border-dashed border-border-grey bg-soft-bg/30 rounded-xl">
              No subscribers found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
