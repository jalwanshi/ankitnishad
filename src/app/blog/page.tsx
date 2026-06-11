"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/types/portfolio";
import { getPublishedBlogs } from "@/services/blogService";

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg py-32 relative overflow-hidden flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
      </div>
    );
  }

  // Find featured post (usually the first one, or one marked featured. For now we just use the first published post)
  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  const remainingPosts = blogs.slice(1);

  return (
    <div className="min-h-screen bg-main-bg py-32 relative overflow-hidden">
      {/* BACKGROUND monogram */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header Section */}
        <div className="mb-24 md:mb-32 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-primary-black" />
            <span className="text-xs font-sans uppercase tracking-widest font-semibold text-primary-black">
              Insights & Articles
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-primary-black tracking-tight leading-tight mb-8">
            Blog & Thoughts.
          </h1>
          <p className="text-base md:text-lg text-dark-grey font-light leading-relaxed max-w-2xl">
            My personal thoughts on enterprise sales, requirement discovery, operational bottlenecks, and why most custom software projects fail before they even start.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-border-grey bg-white">
            <h3 className="font-display text-2xl font-normal text-primary-black mb-2">No Articles Found</h3>
            <p className="text-sm text-dark-grey font-light">Check back later for new insights.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-24">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-widest text-muted-grey font-semibold">
                    Latest Article
                  </h2>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="group block bg-white border border-border-grey hover:border-primary-black transition-colors duration-300 p-8 md:p-16 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-soft-bg translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-4 text-xs tracking-wider text-muted-grey mb-6">
                      <span className="text-[10px] uppercase font-semibold text-primary-black border border-primary-black px-2.5 py-0.5 rounded-full">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredPost.readingTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-display text-4xl md:text-5xl font-normal text-primary-black leading-tight mb-6 group-hover:text-primary-black transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-sm md:text-base text-dark-grey font-light leading-relaxed max-w-3xl mb-12">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-primary-black">
                      Read Article 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid of Remaining Posts */}
            {remainingPosts.length > 0 && (
              <div>
                <div className="mb-8 flex items-center justify-between border-b border-border-grey pb-4">
                  <h2 className="text-xs uppercase tracking-widest text-primary-black font-semibold">
                    More Articles
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block bg-white border border-border-grey hover:border-primary-black transition-colors duration-300 p-8 relative flex flex-col h-full"
                    >
                      <div className="absolute inset-0 bg-soft-bg scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] uppercase font-semibold text-primary-black border border-border-grey group-hover:border-primary-black px-2.5 py-0.5 rounded-full transition-colors">
                            {post.category}
                          </span>
                        </div>
                        
                        <h3 className="font-display text-2xl font-normal text-primary-black leading-snug mb-4 group-hover:text-primary-black transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-xs text-dark-grey font-light leading-relaxed mb-8 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs tracking-wider text-muted-grey pt-6 border-t border-border-grey group-hover:border-primary-black transition-colors mt-auto">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
