"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Link2 } from "lucide-react";
import { LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { BlogPost } from "@/types/portfolio";
import { getBlogBySlug, getPublishedBlogs } from "@/services/blogService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogArticle({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const blogPost = await getBlogBySlug(slug);
        if (!blogPost) {
          router.push("/404");
          return;
        }
        setPost(blogPost);

        // Fetch all published blogs to calculate "Next Article"
        const allBlogs = await getPublishedBlogs();
        if (allBlogs.length > 1) {
          const currentIndex = allBlogs.findIndex((p) => p.id === blogPost.id);
          const nextIndex = (currentIndex + 1) % allBlogs.length;
          setNextPost(allBlogs[nextIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg py-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
      </div>
    );
  }

  if (!post) {
    return null; // Handled by router.push(/404)
  }

  return (
    <div className="min-h-screen bg-main-bg py-20 relative overflow-hidden">
      {/* BACKGROUND monogram */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-grey hover:text-primary-black mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Article Container */}
        <div className="max-w-[800px] mx-auto">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs tracking-wider text-muted-grey mb-6">
            <span className="text-[10px] uppercase font-semibold text-primary-black border border-border-grey px-2.5 py-0.5 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <h1 className="font-display text-4xl md:text-5xl font-extralight text-primary-black tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          <p className="text-base md:text-lg text-dark-grey font-light leading-relaxed mb-12 border-l-2 border-primary-black pl-6">
            {post.excerpt}
          </p>

          {/* Content Body */}
          <div className="space-y-6 text-dark-grey text-sm md:text-base font-light leading-relaxed border-t border-border-grey pt-12 mb-16 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Sharing Actions */}
          <div className="border-y border-border-grey py-6 flex items-center justify-between gap-6 mb-16">
            <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold">
              Share this article
            </span>
            <div className="flex items-center gap-3">
              <button className="p-2 border border-border-grey hover:border-primary-black transition-colors rounded-full bg-white">
                <LinkedinIcon className="w-3.5 h-3.5 text-primary-black" />
              </button>
              <button className="p-2 border border-border-grey hover:border-primary-black transition-colors rounded-full bg-white">
                <TwitterIcon className="w-3.5 h-3.5 text-primary-black" />
              </button>
              <button className="p-2 border border-border-grey hover:border-primary-black transition-colors rounded-full bg-white">
                <Link2 className="w-3.5 h-3.5 text-primary-black" />
              </button>
            </div>
          </div>

          {/* Suggested Next Article */}
          {nextPost && (
            <div className="border border-border-grey bg-white p-8 md:p-10">
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-2">
                Next in Insights
              </span>
              <h4 className="font-display text-xl font-normal text-primary-black mb-4">
                {nextPost.title}
              </h4>
              <p className="text-xs text-dark-grey font-light mb-6 line-clamp-2 leading-relaxed">
                {nextPost.excerpt}
              </p>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group inline-flex items-center gap-1 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-4 py-2.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
              >
                Read Next Article
                <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
