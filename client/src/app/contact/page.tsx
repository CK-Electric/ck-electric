import { Metadata } from 'next';
import { Facebook, LinkedIn, Star, CheckCircle, Phone, Mail, LocationOn, AccessTime } from '@mui/icons-material';
import HeroSection from '@/components/HeroSection';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLinks from '@/components/SocialLinks';

// Generate metadata for the contact page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact | CK Electric - Puget Sound',
    description: 'Get in touch with CK Electric for professional electrical services across Puget Sound. Call us or fill out our contact form.',
    keywords: 'contact electrician, electrical contractor contact, CK Electric phone, electrical services Tacoma',
  };
}

export default function ContactPage() {
  const socialLinks = [
    { icon: <Facebook className="text-xl" />, href: "#facebook", label: "Facebook" },
    { icon: <LinkedIn className="text-xl" />, href: "#linkedin", label: "LinkedIn" },
  ];
  return (
    <>
      <HeroSection
        title="Get in Touch"
        subtitle="Ready to start your electrical project? Contact our team for expert service and competitive pricing across Puget Sound."
        hideCTA={true}
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop"
      />
      
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Contact Information */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h3 className="text-display-5-upper text-primary-500 mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Phone className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Phone Support</p>
                          <p className="text-base text-neutral-600">Rob: (555) 012-3456</p>
                          <p className="text-base text-neutral-600">Matt: (555) 012-3456</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Mail className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Email Us</p>
                          <p className="text-base text-neutral-600">hello@ckelectricps.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <LocationOn className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Location</p>
                          <p className="text-base text-neutral-600">Serving Tacoma to Skagit Valley, WA</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <AccessTime className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Business Hours</p>
                          <p className="text-base text-neutral-600">Mon-Fri: 8:00am - 6:00pm</p>
                          <p className="text-base text-neutral-600">Emergency support available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-neutral-200">
                      <div className="flex text-primary-500 mb-2">
                        <Star className="text-2xl" />
                        <Star className="text-2xl" />
                        <Star className="text-2xl" />
                        <Star className="text-2xl" />
                        <Star className="text-2xl" />
                      </div>
                      <p className="text-base-bold text-neutral-950 font-black">4.9 Stars</p>
                      <p className="text-small-upper text-neutral-500">Google Rating</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-neutral-200">
                      <CheckCircle className="text-3xl text-primary-500 mb-2 block" />
                      <p className="text-base-bold text-neutral-950 font-black leading-tight">Fully Licensed & Insured</p>
                      <p className="text-small-upper text-neutral-500">Certified Professional</p>
                    </div>
                  </div>
                  
                  {/* Social Icons */}
                  <SocialLinks 
                    socialLinks={socialLinks}
                    linkClassName="w-12 h-12 bg-warning-500 text-white hover:bg-warning-600 rounded-full flex items-center justify-center transition-colors"
                  />
                </div>
                
                {/* Right: Contact Form */}
                <div>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your name"
                      type="text"
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      placeholder="email@example.com"
                      type="email"
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="(555) 000-0000"
                      type="tel"
                    />
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-base-bold text-neutral-950">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl"
                      >
                        <option>General Inquiry</option>
                        <option>Employment</option>
                        <option>Service Request</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="message" className="text-base-bold text-neutral-950">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="How can we help you?"
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl resize-none"
                      />
                    </div>
                    <div className="md:col-span-2 mt-4">
                      <Button
                        label="Send Message"
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
        </div>
      </section>
    </>
  );
}
