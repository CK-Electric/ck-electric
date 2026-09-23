import { Facebook } from '@mui/icons-material';
import HousecallProLeadForm from '@/components/HousecallProLeadForm';
import SocialLinks from '@/components/SocialLinks';
import type { RequestEstimatePageData } from '@/lib/wordpress-types';

interface RequestEstimateFormProps {
  pageData: RequestEstimatePageData | null;
}

export default function RequestEstimateForm({ pageData }: RequestEstimateFormProps) {
  const socialLinks = [
    { icon: <Facebook className="text-xl" />, href: "#facebook", label: "Facebook" },
  ];

  return (
    <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_502px] gap-12">
                {/* Left: Estimate Process */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h2 className="text-display-5-upper text-primary-800 mb-6">How our estimate process works</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">1</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">{pageData?.page?.requestEstimate?.step1?.title || "Submit your request"}</p>
                          <p className="text-base text-neutral-600">{pageData?.page?.requestEstimate?.step1?.description || "Fill out our estimate form with your project details and contact information"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">2</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">{pageData?.page?.requestEstimate?.step2?.title || "We review your project details"}</p>
                          <p className="text-base text-neutral-600">{pageData?.page?.requestEstimate?.step2?.description || "Our team analyzes your requirements and prepares for consultation"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">3</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">{pageData?.page?.requestEstimate?.step3?.title || "Schedule a consultation (if needed)"}</p>
                          <p className="text-base text-neutral-600">{pageData?.page?.requestEstimate?.step3?.subtitle || "We may schedule a site visit to better understand your project scope"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">4</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">{pageData?.page?.requestEstimate?.step4?.title || "Receive a clear, written estimate"}</p>
                          <p className="text-base text-neutral-600">{pageData?.page?.requestEstimate?.step4?.subtitle || "Get detailed pricing and timeline for your electrical project"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <SocialLinks 
                    socialLinks={socialLinks}
                    title="Connect With Us"
                    titleClassName="text-base-bold text-neutral-950"
                    linkClassName="w-12 h-12 bg-warning-500 text-white hover:bg-warning-600 rounded-full flex items-center justify-center transition-colors"
                  />
                </div>
                
                {/* Right: Estimate Form */}
                <div className="min-w-0">
                  <HousecallProLeadForm />
                </div>
              </div>
            </div>
        </div>
    </section>
  );
}
