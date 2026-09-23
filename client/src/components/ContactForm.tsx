import { Facebook, CheckCircle, Phone, Mail, LocationOn, AccessTime } from '@mui/icons-material';
import HousecallProLeadForm from '@/components/HousecallProLeadForm';
import SocialLinks from '@/components/SocialLinks';

interface ContactFormProps {
  pageData: {
    title?: string;
    content?: string;
    seo?: {
      metaDesc?: string;
      metaKeywords?: string;
    };
    contactInformation?: {
      businessHours?: string;
      facebookLink?: string;
      extraInfo?: {
        subtitle?: string;
        title?: string;
      };
      forwardedTo?: {
        mattEmail?: string;
        robEmail?: string;
      };
      googleMapsRating?: {
        locationLink?: string;
        rating?: string;
      };
      mattPhoneNumber?: string;
      principalEmail?: string;
      robPhoneNumber?: string;
      location?: string;
    };
  } | null;
}

export default function ContactForm({ pageData }: ContactFormProps) {
  const socialLinks = [
    ...(pageData?.contactInformation?.facebookLink
      ? [{ icon: <Facebook className="text-xl" />, href: pageData.contactInformation.facebookLink, label: "Facebook" }]
      : []),
  ];

  return (
    <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_502px] gap-12">
                {/* Left: Contact Information */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h2 className="text-display-5-upper text-primary-800 mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Phone className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Phone Support</p>
                          <p className="text-base text-neutral-600">Rob: {pageData?.contactInformation?.robPhoneNumber || "(555) 012-3456"}</p>
                          <p className="text-base text-neutral-600">Matt: {pageData?.contactInformation?.mattPhoneNumber || "(555) 012-3456"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Mail className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Email Us</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.principalEmail || "hello@ckelectricps.com"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <LocationOn className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Location</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.location || "Serving Tacoma to Skagit Valley, WA"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <AccessTime className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Business Hours</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.businessHours || "Mon-Fri: 8:00am - 6:00pm"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-neutral-200">
                    <CheckCircle className="text-4xl text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-base-bold text-neutral-950 font-black leading-tight">{pageData?.contactInformation?.extraInfo?.title || "Fully Licensed & Insured"}</p>
                      <p className="text-small-upper text-neutral-600">{pageData?.contactInformation?.extraInfo?.subtitle || "Certified Professional"}</p>
                    </div>
                  </div>
                  
                  {/* Social Icons */}
                  <SocialLinks
                    socialLinks={socialLinks}
                    titleAs="h3"
                    titleClassName="text-base-bold text-neutral-950"
                    linkClassName="w-12 h-12 bg-warning-500 text-white hover:bg-warning-600 rounded-full flex items-center justify-center transition-colors"
                  />
                </div>
                
                {/* Right: Contact Form */}
                <div className="min-w-0">
                  <HousecallProLeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
