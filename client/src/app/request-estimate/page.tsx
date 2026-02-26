import { Metadata } from 'next';
import { Facebook, LinkedIn, Star, CheckCircle, Phone, Mail, LocationOn, AccessTime } from '@mui/icons-material';
import HeroSection from '@/components/HeroSection';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLinks from '@/components/SocialLinks';

// Generate metadata for the request estimate page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Request a Free Estimate | CK Electric - Puget Sound',
    description: 'Request a free estimate for electrical services from CK Electric. Professional electrical contractors serving Tacoma to Skagit Valley.',
    keywords: 'free electrical estimate, electrical services quote, CK Electric estimate, electrical contractor Tacoma, electrical services Puget Sound',
  };
}

export default function RequestEstimatePage() {
  const socialLinks = [
    { icon: <Facebook className="text-xl" />, href: "#facebook", label: "Facebook" },
    { icon: <LinkedIn className="text-xl" />, href: "#linkedin", label: "LinkedIn" },
  ];
  return (
    <>
      <HeroSection
        title="Request a Free Estimate for electrical services"
        subtitle="We specialize in Commercial TIs, Panel Upgrades, and EV Chargers throughout Tacoma and nearby areas. If you're searching for a trusted contractor offering fair pricing and professional results, our team is ready to help."
        hideCTA={true}
        backgroundImage="https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop"
      />
      
      <section className="py-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Estimate Process */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h3 className="text-display-5-upper text-primary-500 mb-6">How our estimate process works</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">1</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Submit your request</p>
                          <p className="text-base text-neutral-600">Fill out our estimate form with your project details and contact information</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">2</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">We review your project details</p>
                          <p className="text-base text-neutral-600">Our team analyzes your requirements and prepares for consultation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">3</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Schedule a consultation (if needed)</p>
                          <p className="text-base text-neutral-600">We may schedule a site visit to better understand your project scope</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">4</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Receive a clear, written estimate</p>
                          <p className="text-base text-neutral-600">Get detailed pricing and timeline for your electrical project</p>
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
                <div>
                  <form className="grid grid-cols-1 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your full name"
                      type="text"
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="(555) 000-0000"
                      type="tel"
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      placeholder="email@example.com"
                      type="email"
                      required
                    />
                    <div className="space-y-2">
                      <label htmlFor="project" className="text-base-bold text-neutral-950">
                        Tell us about your project
                      </label>
                      <textarea
                        id="project"
                        name="project"
                        rows={4}
                        placeholder="Describe your electrical project needs, timeline, and any specific requirements..."
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl resize-none"
                        required
                      />
                    </div>
                    <Input
                      label="Project Address"
                      name="address"
                      placeholder="Enter the project location address"
                      type="text"
                      required
                    />
                    <div className="mt-4">
                      <Button
                        label="Request Free Estimate"
                        variant="primary"
                        type="submit"
                        className="w-full"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  );
}
