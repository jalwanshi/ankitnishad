"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen, ChevronRight, Search, Sparkles } from "lucide-react";
import { BlogPost } from "@/types/portfolio";
import { getPublishedBlogs } from "@/services/blogService";
import { addSubscriber } from "@/services/subscriberService";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Newsletter State
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState({ text: "", type: "success" });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const publishedBlogs = await getPublishedBlogs();
        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    setSubscribing(true);
    setSubscribeMsg({ text: "", type: "success" });

    try {
      await addSubscriber(subscriberEmail.trim());
      setSubscribeMsg({ text: "Thank you for subscribing to my newsletter!", type: "success" });
      setSubscriberEmail("");
      setTimeout(() => setSubscribeMsg({ text: "", type: "success" }), 4000);
    } catch (err: any) {
      setSubscribeMsg({ text: err.message || "Failed to subscribe.", type: "error" });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg py-32 relative overflow-hidden flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-black border-t-transparent"></div>
          <span className="text-[10px] uppercase tracking-widest text-muted-grey font-medium">Loading Insights...</span>
        </div>
      </div>
    );
  }

  // Sort blogs in-memory by date (descending)
  const sortedBlogs = [...blogs].sort((a, b) => {
    const timeA = a.createdAt?.toMillis 
      ? a.createdAt.toMillis() 
      : (a.date ? Date.parse(a.date) : 0);
    const timeB = b.createdAt?.toMillis 
      ? b.createdAt.toMillis() 
      : (b.date ? Date.parse(b.date) : 0);
    return timeB - timeA;
  });

  // Unique categories list
  const categories = ["All", ...Array.from(new Set(sortedBlogs.map(b => b.category)))];

  // Filtering logic
  const filteredBlogs = sortedBlogs.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isFilteringActive = searchQuery !== "" || selectedCategory !== "All";

  // If no filters are active, separate the top post as featured
  const featuredPost = !isFilteringActive && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const displayTimelinePosts = !isFilteringActive ? filteredBlogs.slice(1) : filteredBlogs;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-main-bg py-32 relative overflow-hidden">
      {/* BACKGROUND monogram */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 space-y-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-primary-black" />
            <span className="text-[10px] font-sans uppercase tracking-widest font-bold text-primary-black">
              Insights & Strategy
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-primary-black tracking-tight leading-tight mb-8 uppercase">
            Blog & Insights.
          </h1>
          <p className="text-sm md:text-base text-dark-grey font-light leading-relaxed max-w-2xl">
            Thoughts, frameworks, and deep dives on business automation, workflow architecture, custom CRM/ERP roadmap designs, and how to identify operational bottlenecks before writing a single line of code.
          </p>
        </motion.div>

        {/* Filters & Search Bar Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-y border-border-grey/75 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[9px] uppercase tracking-wider font-semibold border transition-all duration-300 rounded-md cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary-black text-white border-primary-black"
                    : "bg-white text-muted-grey border-border-grey hover:border-primary-black hover:text-primary-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <input 
              type="text" 
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-border-grey text-[10px] uppercase tracking-widest py-3 pl-10 pr-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors rounded-lg font-medium"
            />
            <Search className="w-4 h-4 text-muted-grey absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-grey bg-white rounded-xl">
            <BookOpen className="w-8 h-8 mx-auto text-muted-grey mb-3" />
            <h3 className="font-display text-xl font-normal text-primary-black mb-1 uppercase">No Articles Found</h3>
            <p className="text-xs text-dark-grey font-light">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Featured Post (Only when no filtering is active) */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6"
              >
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block bg-white border border-border-grey hover:border-primary-black transition-all duration-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-[0_15px_40px_rgba(0,0,0,0.02)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-grey/55">
                    {/* Content Column */}
                    <div className="p-8 md:p-12 lg:p-16 lg:col-span-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-soft-bg/35 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-wider text-muted-grey">
                          <span className="font-semibold text-primary-black border border-primary-black px-2.5 py-0.5 rounded-full uppercase text-[9px]">
                            {featuredPost.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {featuredPost.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {featuredPost.readingTime}
                          </span>
                        </div>

                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-primary-black leading-tight group-hover:text-accent-gold transition-colors duration-300">
                          {featuredPost.title}
                        </h3>

                        <p className="text-xs md:text-sm text-dark-grey font-light leading-relaxed max-w-2xl line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="relative z-10 pt-10 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary-black group-hover:text-accent-gold transition-colors mt-auto">
                        Read Full Insight
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Graphic Column */}
                    <div className="p-8 md:p-12 lg:col-span-4 bg-soft-bg/20 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:bg-soft-bg/40 transition-colors duration-500">
                      <div className="absolute inset-0 border-t border-border-grey lg:border-t-0" />
                      
                      <div className="w-full flex items-center justify-center p-4">
                        <svg className="w-full max-w-[200px] text-primary-black/10 group-hover:text-primary-black/20 transition-colors duration-500" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <motion.path 
                            d="M30 40 H170 V100 H30 V160 H170" 
                            stroke="currentColor" 
                            strokeWidth="1" 
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                          <motion.path 
                            d="M30 40 H100 V100 H170" 
                            stroke="#c89f7c" 
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                          />
                          <circle cx="30" cy="40" r="5" fill="#111111" />
                          <circle cx="100" cy="40" r="3.5" fill="#c89f7c" />
                          <circle cx="170" cy="40" r="5" fill="#111111" />
                          <circle cx="100" cy="100" r="5.5" fill="#111111" />
                          <circle cx="30" cy="100" r="3.5" fill="#c89f7c" />
                          <circle cx="170" cy="100" r="7" stroke="#111111" strokeWidth="1.5" fill="#FCFCFA" />
                          <circle cx="30" cy="160" r="5" fill="#111111" />
                          <circle cx="170" cy="160" r="5" fill="#c89f7c" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Sequence Timeline List */}
            {displayTimelinePosts.length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-border-grey pb-3">
                  <h2 className="text-[10px] uppercase tracking-widest text-primary-black font-bold">
                    {isFilteringActive ? `Results found (${displayTimelinePosts.length})` : "Chronological Insights Index"}
                  </h2>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative pl-6 md:pl-10 border-l border-border-grey/70 ml-2 md:ml-4 space-y-1"
                >
                  {displayTimelinePosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      className="relative group py-6 first:pt-2 last:pb-2"
                    >
                      {/* Timeline Dot Node */}
                      <div className="absolute -left-[31px] md:-left-[47px] top-1/2 -translate-y-1/2 flex items-center justify-center z-25">
                        <motion.div 
                          whileHover={{ scale: 1.4 }}
                          className="w-2.5 h-2.5 rounded-full bg-border-grey border-2 border-main-bg group-hover:bg-accent-gold group-hover:border-primary-black transition-all duration-300 shadow-xs"
                        />
                      </div>

                      {/* Row Card */}
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 border border-transparent hover:border-border-grey hover:bg-white transition-all duration-300 rounded-xl group/row relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-soft-bg/20 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 lg:w-4/5">
                          {/* Date and Category column */}
                          <div className="shrink-0 flex items-center md:flex-col md:items-start gap-3 md:gap-1.5 md:w-32">
                            <span className="text-[10px] font-medium text-muted-grey uppercase tracking-wider">
                              {post.date}
                            </span>
                            <span className="text-[8px] font-bold text-primary-black border border-border-grey px-2 py-0.5 rounded-sm uppercase bg-soft-bg">
                              {post.category}
                            </span>
                          </div>

                          {/* Title and Excerpt column */}
                          <div className="space-y-1.5">
                            <h3 className="font-display text-lg md:text-xl font-normal text-primary-black group-hover/row:text-accent-gold transition-colors duration-300">
                              {post.title}
                            </h3>
                            <p className="text-xs text-dark-grey font-light leading-relaxed line-clamp-1">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Read time and glide arrow */}
                        <div className="relative z-10 shrink-0 flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-grey group-hover/row:text-primary-black transition-colors self-end lg:self-center">
                          <span className="flex items-center gap-1 font-medium text-[9px] lowercase tracking-normal">
                            <Clock className="w-3 h-3 text-muted-grey" />
                            {post.readingTime}
                          </span>
                          <span className="flex items-center justify-center p-1.5 border border-border-grey group-hover/row:border-primary-black bg-main-bg rounded-full transition-all duration-300 group-hover/row:bg-primary-black group-hover/row:text-white">
                            <ChevronRight className="w-3.5 h-3.5 group-hover/row:translate-x-0.5 transition-transform duration-300" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Newsletter Subscription Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border-grey bg-white p-8 md:p-16 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-soft-bg/50 rounded-full blur-2xl -z-10" />
          
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent-gold flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Newsletter
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-light text-primary-black uppercase tracking-wide">
              Operations & Automation Insights
            </h3>
            <p className="text-xs text-dark-grey font-light leading-relaxed">
              Sign up to receive case study breakdowns, technical system roadmaps, and automation guides. Direct to your inbox. No fluff, no spam.
            </p>
          </div>

          <div className="w-full md:max-w-md shrink-0">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address..."
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="w-full bg-soft-bg border border-border-grey text-xs py-3.5 px-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors rounded-lg font-light"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold cursor-pointer disabled:opacity-50 shrink-0 rounded-lg"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {subscribeMsg.text && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-medium ${
                    subscribeMsg.type === "error" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {subscribeMsg.text}
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
