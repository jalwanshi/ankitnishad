import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaseStudy } from "@/types/portfolio";

interface CaseStudyCardProps {
  project: CaseStudy;
  imageSizes?: string;
}

export default function CaseStudyCard({
  project,
  imageSizes = "(max-width: 768px) 100vw, 33vw"
}: CaseStudyCardProps) {
  const imageSource =
    project.coverImageUrl || "/assets/hospital-automation-cover.png";
  const timeSaved = project.timeSaved || project.actualResults?.timeSaved;
  const workReduced =
    project.manualWorkReduction || project.actualResults?.workReduced;
  const accuracy =
    project.dataAccuracyImprovement ||
    project.actualResults?.accuracyImprovement;
  const metrics = [
    timeSaved ? { label: "Time Saved", value: timeSaved } : null,
    workReduced ? { label: "Work Reduced", value: workReduced } : null,
    accuracy ? { label: "Accuracy", value: accuracy } : null
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-border-grey bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-black hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border-grey bg-soft-bg">
        <Image
          src={imageSource}
          alt={`${project.title} case study`}
          fill
          unoptimized={imageSource.startsWith("data:")}
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
          sizes={imageSizes}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/45 via-transparent to-transparent" />

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
          <span className="max-w-[75%] truncate rounded-full border border-white/30 bg-primary-black/70 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {project.projectType || project.industry}
          </span>
          {project.featured && (
            <span className="rounded-full border border-white/30 bg-white/90 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-widest text-primary-black">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-grey">
            {project.industry}
            {project.year ? ` · ${project.year}` : ""}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-grey transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-black" />
        </div>

        <h3 className="line-clamp-2 font-display text-xl font-normal leading-tight text-primary-black">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-xs font-light leading-relaxed text-dark-grey">
          {project.businessChallenge || project.clientContext}
        </p>

        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-border-grey bg-soft-bg px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-muted-grey"
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-5">
          {metrics.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 border-t border-border-grey pt-4">
              {metrics.slice(0, 2).map((metric) => (
                <div key={metric.label}>
                  <span className="block text-[8px] uppercase tracking-widest text-muted-grey">
                    {metric.label}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold text-primary-black">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-t border-border-grey pt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary-black">
              View Case Study
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
