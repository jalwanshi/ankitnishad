import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-main-bg py-20 relative overflow-hidden">
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-grey hover:text-primary-black mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Content Box */}
        <div className="max-w-[800px] mx-auto bg-white border border-border-grey p-8 md:p-12">
          <h1 className="font-display text-3xl font-light text-primary-black mb-8 border-b border-border-grey pb-4">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-xs md:text-sm text-dark-grey font-light leading-relaxed">
            <p>
              Last Updated: June 11, 2026
            </p>
            <p>
              This Privacy Policy describes how your personal information is collected, used, and shared when you visit my portfolio website and submit consulting discovery questionnaires.
            </p>
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black font-semibold mt-8">
              1. Information I Collect
            </h3>
            <p>
              When you submit a discovery questionnaire through the contact form, I collect the personal data you explicitly provide: your full name, company name, work email address, phone number, LinkedIn profile link, company website, industry, and descriptions of your workflow challenges.
            </p>
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black font-semibold mt-8">
              2. How I Use Your Information
            </h3>
            <p>
              I use the collected data solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analyze your company's operational workflow challenges before our discovery call.</li>
              <li>Reach out to schedule and conduct consultation sessions.</li>
              <li>Coordinate requirement specifications if we enter into a business relationship.</li>
            </ul>
            <p>
              Your personal details are treated with strict confidentiality and are never shared with, sold to, or distributed to third-party marketing networks.
            </p>
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black font-semibold mt-8">
              3. Data Retention and Safety
            </h3>
            <p>
              I maintain contact form submissions in a secure cloud database (Firestore). Access is restricted exclusively to authenticated administrators with Super Admin roles. We apply strict security rules to prevent unauthorized reads.
            </p>
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black font-semibold mt-8">
              4. Contact Consent
            </h3>
            <p>
              By checking the form boxes or submitting inquiries, you consent to receiving follow-up business emails or calls from me regarding your workflow consultation request.
            </p>
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black font-semibold mt-8">
              5. Contact Me
            </h3>
            <p>
              If you have any questions regarding this privacy notice, please reach out directly via email at: <strong>ankitnishad703@gmail.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
