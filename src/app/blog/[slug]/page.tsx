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
          <div className="space-y-6 text-dark-grey text-sm md:text-base font-light leading-relaxed border-t border-border-grey pt-12 mb-16">
            {parseMarkdown(post.content || "")}
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

function parseInline(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-primary-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-primary-black">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  
  let currentListType: "bullet" | "ordered" | null = null;
  let currentListItems: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (currentListItems.length > 0) {
      if (currentListType === "bullet") {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-6 space-y-2 text-dark-grey">
            {currentListItems}
          </ul>
        );
      } else if (currentListType === "ordered") {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-6 space-y-2 text-dark-grey">
            {currentListItems}
          </ol>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line is list item
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const isOrdered = /^\d+\.\s/.test(trimmed);
    
    if (isBullet) {
      if (currentListType === "ordered") {
        flushList(i);
      }
      currentListType = "bullet";
      
      const content = trimmed.slice(2);
      currentListItems.push(
        <li key={`li-${i}`} className="text-dark-grey text-sm md:text-base font-light leading-relaxed">
          {parseInline(content)}
        </li>
      );
    } else if (isOrdered) {
      if (currentListType === "bullet") {
        flushList(i);
      }
      currentListType = "ordered";
      
      const match = trimmed.match(/^\d+\.\s/);
      const prefixLength = match ? match[0].length : 3;
      const content = trimmed.slice(prefixLength);
      currentListItems.push(
        <li key={`li-${i}`} className="text-dark-grey text-sm md:text-base font-light leading-relaxed">
          {parseInline(content)}
        </li>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3 key={`h3-${i}`} className="font-display text-lg md:text-xl font-normal text-primary-black uppercase tracking-wide mt-6 mb-2">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(i);
      elements.push(
        <h2 key={`h2-${i}`} className="font-display text-xl md:text-2xl font-light text-primary-black uppercase tracking-wider mt-8 mb-3">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      flushList(i);
      elements.push(
        <h1 key={`h1-${i}`} className="font-display text-2xl md:text-3xl font-light text-primary-black uppercase tracking-widest mt-10 mb-4">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed === "") {
      flushList(i);
    } else {
      flushList(i);
      elements.push(
        <p key={`p-${i}`} className="text-dark-grey text-sm md:text-base font-light leading-relaxed">
          {parseInline(trimmed)}
        </p>
      );
    }
  }

  flushList("end");

  return elements;
}
