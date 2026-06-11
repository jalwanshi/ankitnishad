"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save, Eye, EyeOff } from "lucide-react";
import { BlogPost } from "@/types/portfolio";
import { getAllBlogs, addBlog, updateBlog, deleteBlog } from "@/services/blogService";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setDate("");
    setReadingTime("");
    setCategory("");
    setPublished(true);
    setEditingId(null);
    setShowModal(false);
  };

  const openEditModal = (post: BlogPost) => {
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content || "");
    setDate(post.date);
    setReadingTime(post.readingTime);
    setCategory(post.category);
    setPublished(post.published);
    setEditingId(post.id);
    setShowModal(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      date,
      readingTime,
      category,
      published
    };

    try {
      if (editingId) {
        await updateBlog(editingId, postData);
      } else {
        await addBlog(postData);
      }
      await fetchBlogs();
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog post.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteBlog(id);
      await fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post.");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await updateBlog(post.id, { published: !post.published });
      await fetchBlogs();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6 flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Manage Blog Articles
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Write, edit, publish, or schedule thoughts and insights
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {/* Grid of posts list */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="text-center py-12 border border-border-grey bg-white">
            <p className="text-sm text-muted-grey">No blog posts found. Create your first article.</p>
          </div>
        ) : (
          blogs.map((post) => (
            <div
              key={post.id}
              className={`bg-white border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                post.published ? "border-border-grey hover:border-primary-black" : "border-dashed border-muted-grey opacity-75"
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-muted-grey">
                    {post.date}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold px-2 py-0.5 border border-border-grey rounded-full">
                    {post.category}
                  </span>
                  {!post.published && (
                    <span className="text-[9px] uppercase tracking-widest text-red-500 font-semibold px-2 py-0.5 border border-red-200 bg-red-50 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-normal text-primary-black mt-2">
                  {post.title}
                </h3>
                <p className="text-xs text-dark-grey font-light leading-relaxed mt-1 line-clamp-2 max-w-xl">
                  {post.excerpt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="p-2 border border-border-grey hover:border-primary-black text-dark-grey hover:text-primary-black transition-colors flex items-center justify-center bg-soft-bg"
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => openEditModal(post)}
                  className="p-2 border border-border-grey hover:border-primary-black text-dark-grey hover:text-primary-black transition-colors flex items-center justify-center bg-soft-bg"
                  title="Edit Post"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="p-2 border border-border-grey hover:border-red-500 text-dark-grey hover:text-red-500 transition-colors flex items-center justify-center bg-soft-bg"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-primary-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl flex flex-col max-h-[90vh] border border-border-grey shadow-2xl relative">
            <div className="sticky top-0 bg-white border-b border-border-grey px-6 py-4 flex justify-between items-center z-10 shrink-0">
              <h2 className="font-display text-xl uppercase tracking-wider text-primary-black">
                {editingId ? "Edit Article" : "Write New Article"}
              </h2>
              <button onClick={resetForm} className="text-muted-grey hover:text-primary-black transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to Qualify a Custom Software Lead" className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Category *</label>
                  <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. IT Sales" className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Date *</label>
                  <input type="text" required value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. June 05, 2026" className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Reading Time *</label>
                  <input type="text" required value={readingTime} onChange={(e) => setReadingTime(e.target.value)} placeholder="e.g. 5 min read" className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold">Short Excerpt (Preview) *</label>
                <textarea rows={3} required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the article..." className="w-full border border-border-grey bg-main-bg py-2.5 px-4 text-xs font-light focus:outline-none resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold flex items-center justify-between">
                  <span>Full Content body *</span>
                  <span className="text-[8px] font-normal lowercase tracking-normal text-dark-grey bg-soft-bg px-2 py-0.5 border border-border-grey rounded-sm">Supports line breaks</span>
                </label>
                <textarea rows={15} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full article here. Paragraph breaks will be preserved." className="w-full border border-border-grey bg-main-bg py-3 px-4 text-sm font-light focus:outline-none resize-y" />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border-grey">
                <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-primary-black cursor-pointer" />
                <label htmlFor="published" className="text-xs uppercase tracking-widest text-primary-black font-semibold cursor-pointer select-none">
                  Publish Article Immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border-grey">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-dark-grey hover:text-primary-black transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Article" : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
