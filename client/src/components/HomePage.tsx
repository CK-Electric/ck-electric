import React from 'react';
import { Bolt, Verified, Timer, Phone, Mail, LocationOn, Check, ArrowRightAlt, FormatQuote, CorporateFare, ElectricBolt, GridView, Light, ChargingStation, Construction, Call } from '@mui/icons-material';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import ServiceCard from './ServiceCard';
import FeaturedProjectCard from './FeaturedProjectCard';
import TestimonialCard from './TestimonialCard';
import CtaBox from './CtaBox';
import EstimateForm from './EstimateForm';
import { fetchWordPressGraphQL } from '../lib/wordpress-graphql';
import { GET_LANDING_PAGE, LandingPageData, GET_OWNERS, OwnersData } from '../lib/wordpress-queries';
import { GET_ALL_SERVICES, GET_ALL_PROJECTS } from '../lib/wordpress-queries';
import { ServicesResponse, ProjectsResponse } from '../lib/wordpress-types';

export default async function HomePage() {
  // Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Fetch landing page data from WordPress
  let landingPageData: LandingPageData | null = null;
  
  try {
    const response = await fetchWordPressGraphQL(GET_LANDING_PAGE);
    landingPageData = response.data as LandingPageData;
  } catch (error) {
    console.error('Error fetching landing page data:', error);
  }

  // Fetch owners data from WordPress
  let ownersData: OwnersData | null = null;
  
  try {
    const response = await fetchWordPressGraphQL(GET_OWNERS);
    ownersData = response.data as OwnersData;
  } catch (error) {
    console.error('Error fetching owners data:', error);
  }

  // Fetch services data from WordPress
  let servicesData: ServicesResponse | null = null;
  
  try {
    const response = await fetchWordPressGraphQL(GET_ALL_SERVICES);
    servicesData = response.data as ServicesResponse;
  } catch (error) {
    console.error('Error fetching services data:', error);
  }

  // Fetch projects data from WordPress
  let projectsData: ProjectsResponse | null = null;
  
  try {
    const response = await fetchWordPressGraphQL(GET_ALL_PROJECTS);
    projectsData = response.data as ProjectsResponse;
  } catch (error) {
    console.error('Error fetching projects data:', error);
  }

  // Use WordPress data if available, otherwise use fallbacks
  const heroTitle = landingPageData?.page.title || "Efficiency and Quality.";
  const heroSubtitle = stripHtml(landingPageData?.page.content || "Talk directly with a licensed electrician. No call centers, no middlemen. Fast response and industrial-grade quality for every project.");
  const tag = landingPageData?.page.landingPage.tag || "Direct Access to Licensed Experts";
  const aboutTitle = landingPageData?.page.landingPage.aboutUs.title || "NO MIDDLEMEN. NO MESS.";
  const aboutSubtitle = landingPageData?.page.landingPage.aboutUs.subtitle || "Locally Owned & Expertly Operated";
  const aboutDescription = landingPageData?.page.landingPage.aboutUs.description || "<p>CK Electric was founded on a simple principle: people deserve to talk to experts doing the work. When you call us, you speak directly with Rob or Matt, not a call center.</p><p>We combine industrial-grade precision with residential-level care. Whether it's a major commercial TI or a home panel upgrade, we bring decades of experience.</p>";
  const feature1Title = landingPageData?.page.landingPage.heroItems.feature1.title1 || "LICENSED & BONDED";
  const feature1Description = landingPageData?.page.landingPage.heroItems.feature1.description1 || "Full Compliance Guaranteed";
  const feature2Title = landingPageData?.page.landingPage.heroItems.item2.title || "FAST RESPONSE";
  const feature2Description = landingPageData?.page.landingPage.heroItems.item2.description || "Same-day Estimates Available";

  // Extract owners data
  const mattOwner = ownersData?.matt || null;
  const robOwner = ownersData?.rob || null;

  return (
    <main className="bg-primary-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-primary-100/60 to-transparent z-10"></div>
          <img 
            alt="Professional electrician working" 
            className="w-full h-full object-cover opacity-40 mix-blend-multiply" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe1RGeqlhyzdm30jYOPD9HCL5yeYkmqTmDP8YHhPde388fuAjj5yUNgcTMi5wM5p-7m2FjEg7REBZKjBYIIvHLiGnl5CoamJanmWrHX-oxIky2gOJ3r8iHWB16MULUGKtMv9knWBq-2s317u7chblbTbQLI2B9Aul3ej42k6uQ8nyfpU7rDA-cqo8o3aeOLx-NqgKY9Nhv2LV0X2lnvNaSfC3CSGeMqLSAmLiZcsyCLXHoXptBMGQpy_UGpCZh1llDd_AnSjUmc6Q"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-positive-100 border border-positive-200 rounded-full text-small-upper text-positive-700 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-positive-500 animate-pulse"></span>
              {tag}
            </div>
            
            <h1 className="hero-title text-neutral-950 leading-[0.9] mb-8 tracking-tighter font-bold">
              {heroTitle.split(' ').map((word, index) => 
                word.includes('Quality') ? (
                  <span key={index} className="text-primary-500 italic underline decoration-primary-400">{word}</span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
            
            <p className="text-base text-neutral-700 mb-10 leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>
            
            <div className="flex flex-wrap flex-col md:flex-row gap-6">
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
                <Verified className="text-primary-500 text-4xl" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">{feature1Title}</p>
                  <p className="text-neutral-700/70 text-small mt-1">{feature1Description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
                <Timer className="text-primary-500 text-4xl" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">{feature2Title}</p>
                  <p className="text-neutral-700/70 text-small mt-1">{feature2Description}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
          
            <div className="relative z-10 bg-white p-10 shadow-2xl">
              <h3 className="text-display-3 text-neutral-950 mb-2">Get a Free Estimate</h3>
              <p className="text-neutral-700/60 text-small mb-8">Professional service within 24 hours.</p>
              
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="relative z-30 -mt-16 skew-panel bg-neutral-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 skew-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-primary-500 text-small-upper mb-2">Experience</p>
              <p className="text-display-4 text-white italic">25+ Yrs</p>
            </div>
            <div>
              <p className="text-primary-500 text-small-upper mb-2">Response</p>
              <p className="text-display-4 text-white italic">&lt;24 Hrs</p>
            </div>
            <div>
              <p className="text-primary-500 text-small-upper mb-2">Satisfied</p>
              <p className="text-display-4 text-white italic">1.2k+</p>
            </div>
            <div>
              <p className="text-primary-500 text-small-upper mb-2">Licensed</p>
              <p className="text-display-4 text-white italic">Direct</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-32 bg-primary-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute top-0 left-0 w-full h-full bg-primary-400 -rotate-3 transition-transform group-hover:rotate-0"></div>
              <img 
                alt="Modern industrial electrical equipment" 
                className="relative z-10 w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANLZ7KGX7PAID37XG0QghBlVd6mx5151hYLtPb__9r9muTE_OVodG09JpjxXC20XbMKiqFvHriC13oTOg-6M-cS8J6wz2Eal1zizA_zFVtzW55ZUOR6THsd7rmYfcIc5nYPnwthvKNH4FP6Ffw6Vyg4tYQsxRcIE8T95B9-KDPdk7YXMDVwYth_u5NKtQpB9-aoG4Fow4jdgYcM5ArO-ogkYwdFWZ04bwSVT4SbBq24kFi8SQo6hN3cF0HEFbcVRVujlc-H9RCPwY"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-primary-500 text-base-upper mb-4">{aboutTitle}</h2>
              <h3 className="about-title text-neutral-950 mb-8 leading-tight">
                {aboutSubtitle}
              </h3>
              
              <div 
                className="space-y-6 text-neutral-700 text-bae leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutDescription }}
              />
                
              <ul className="grid grid-cols-1 gap-4 pt-6">
                <li className="flex items-center gap-4 text-neutral-950 text-base-bold">
                  <span className="w-6 h-6 bg-positive-500 flex items-center justify-center text-white rotate-45">
                    <Check className="text-sm -rotate-45" />
                  </span>
                  Licensed Master Electricians
                </li>
                <li className="flex items-center gap-4 text-neutral-950 text-base-bold">
                  <span className="w-6 h-6 bg-positive-500 flex items-center justify-center text-white rotate-45">
                    <Check className="text-sm -rotate-45" />
                  </span>
                  Zero Outsourcing
                </li>
                <li className="flex items-center gap-4 text-neutral-950 text-base-bold">
                  <span className="w-6 h-6 bg-positive-500 flex items-center justify-center text-white rotate-45">
                    <Check className="text-sm -rotate-45" />
                  </span>
                  Puget Sound Focused
                </li>
              </ul>
                
              <div className="pt-8">
                <Button
                  label="Request Estimate"
                  variant="primary"
                  href="/request-estimate"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-primary-100 md:clip-diagonal-reverse" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center mb-24">
            <h2 className="text-primary-500 text-base-upper mb-4 md:text-lg lg:text-xl">What We Do</h2>
            <h3 className="services-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Full-Spectrum Services</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {servicesData?.services?.nodes?.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                icon={<ElectricBolt className="text-4xl" />}
              />
            )) || (
              <>
                <ServiceCard
                  icon={<CorporateFare className="text-4xl" />}
                  title="Commercial TIs"
                  description="Expert build-outs and improvements for retail, office, and industrial spaces across the corridor."
                  link="#commercial-tis"
                />
                
                <ServiceCard
                  icon={<ElectricBolt className="text-4xl" />}
                  title="Wiring & Rewiring"
                  description="Modernizing outdated electrical systems for safety, efficiency, and code compliance."
                  link="#wiring-rewiring"
                />
                
                <ServiceCard
                  icon={<GridView className="text-4xl" />}
                  title="Panel Upgrades"
                  description="Support high-demand appliances and ensure modern safety standards with panel replacements."
                  link="#panel-upgrades"
                />
                
                <ServiceCard
                  icon={<Light className="text-4xl" />}
                  title="Lighting Solutions"
                  description="Custom LED design, landscape lighting, and smart home lighting controls for security."
                  link="#lighting-solutions"
                />
                
                <ServiceCard
                  icon={<ChargingStation className="text-4xl" />}
                  title="EV Chargers"
                  description="Fast, certified installation of Tesla, JuiceBox, and ChargePoint residential chargers."
                  link="#ev-chargers"
                />
                
                <ServiceCard
                  icon={<Construction className="text-4xl" />}
                  title="Emergency Repair"
                  description="Rapid response for electrical failures and proactive preventative maintenance."
                  link="#emergency-repair"
                />
              </>
            )}
          </div>
          
          <div className="text-center mt-16">
            <Button
              label="View All Services"
              variant="secondary"
              href="/services"
            />
          </div>
        </div>
      </section>



      {/* Meet the Owners Section */}
      <section className="py-32 bg-neutral-50" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 text-center md:text-left">
            <div className="max-w-xl mx-auto md:mx-0">
              <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Experts on Site</h2>
              <h3 className="team-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Meet the Owners</h3>
            </div>
            <p className="text-neutral-700 font-medium max-w-sm border-l-4 border-primary-500 pl-6 mx-auto md:mx-0">Licensed Electrical Contractors with decades of combined experience in Puget Sound.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {robOwner && (
              <div className="relative group">
                {/* Rob Konen */}
                <div className="absolute inset-0 bg-neutral-950 rotate-1 group-hover:rotate-0 transition-transform"></div>
                <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                  <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden skew-x-3">
                    {robOwner.featuredImage?.node?.mediaItemUrl ? (
                      <img 
                        alt={robOwner.owners.fullName} 
                        className="w-full h-full object-cover -skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110" 
                        src={robOwner.featuredImage.node.mediaItemUrl}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-display-4 font-black text-neutral-950">{robOwner.owners.fullName}</h4>
                    <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-6">{robOwner.owners.position}</p>
                    {robOwner.owners.phoneNumber ? (
                      <a 
                        href={`tel:${robOwner.owners.phoneNumber}`}
                        className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all inline-block"
                      >
                        Contact {robOwner.owners.fullName.split(' ')[0]}
                      </a>
                    ) : (
                      <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest px-6 py-3 inline-block">
                        No Contact Info
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {mattOwner && (
              <div className="relative group">
                {/* Matt Cheshier */}
                <div className="absolute inset-0 bg-neutral-950 -rotate-1 group-hover:rotate-0 transition-transform"></div>
                <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                  <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden -skew-x-3">
                    {mattOwner.featuredImage?.node?.mediaItemUrl ? (
                      <img 
                        alt={mattOwner.owners.fullName} 
                        className="w-full h-full object-cover skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110" 
                        src={mattOwner.featuredImage.node.mediaItemUrl}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-display-4 font-black text-neutral-950">{mattOwner.owners.fullName}</h4>
                    <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-6">{mattOwner.owners.position}</p>
                    {mattOwner.owners.phoneNumber ? (
                      <a 
                        href={`tel:${mattOwner.owners.phoneNumber}`}
                        className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all inline-block"
                      >
                        Contact {mattOwner.owners.fullName.split(' ')[0]}
                      </a>
                    ) : (
                      <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest px-6 py-3 inline-block">
                        No Contact Info
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-32 bg-neutral-950" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Our Portfolio</h2>
            <h3 className="portfolio-title text-white italic text-lg md:text-2xl lg:text-3xl">Featured Work</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-0">
            {projectsData?.projects?.nodes
              .filter(project => 
                project.projectFields?.tags?.nodes?.some(tag => 
                  tag.name.toLowerCase() === 'featured'
                )
              )
              .slice(0, 3)
              .map((project, index) => {
                const positions = ['top', 'center', 'bottom'] as const;
                return (
                  <FeaturedProjectCard
                    key={project.id}
                    title={project.title}
                    location={`${project.projectFields?.specifications?.coverageArea || 'Puget Sound'}, WA`}
                    imageUrl={project.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=400&h=300&fit=crop'}
                    position={positions[index]}
                    hasBackground={index === 1}
                    slug={project.slug}
                  />
                );
              }) || (
              // Fallback to hardcoded projects if no featured projects found
              <>
                <FeaturedProjectCard
                  title="Gensco Kirkland"
                  location="Kirkland, WA"
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDMPhChpecZb34tbGDC_MtSdQdv7FiRj4-Mcy5_YPcUql2ypcjlHq90UNrzx3kyQ8BUmvbQeo5KIQqT7udbCYUg3g4F1nFdgoCDrwOgpkuyTZUTv8nu5NHEcpII5IMzh39AVSoqoj83Zlgzx-Egi0zLZIO28wYPe6XWXmGa0pbyyqEx2dbHIr--yJkiJ4aRQapx3Hjkcu524qcTkpWt7u4xuEKecz8cvj_1bCAWvpv0Zg9s_IeTWDaNFNyMmNSb2JsoPIhIIQjGKVM"
                  position="top"
                />
                
                <FeaturedProjectCard
                  title="Gensco Everett"
                  location="Everett, WA"
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAY5Ivnp3HE7wzwBozpfZIERQdtojYsnWyPrawkT9Ouko2tLOS5-zprr_BXQ1S6jlHAD0QA5gyXwHHtDDCG1zGX70BcVic1SXzapft9SQW1OvSBT-fuvlG0bYPwAjQyyzzMseMLXb_WgBIlg8j0G9QmsisWu6Q3DxESoMtTZ7w3kQir4UN50XUywDuoy81EZ4wBNFxnk02PH0Q2Sox67oc-NNHeT_skMrQ5VypSEcfBKjYxZKheOpW_PHe0DMBLU3hdOxhbtdxjldg"
                  position="center"
                  hasBackground
                />
                
                <FeaturedProjectCard
                  title="Park 120"
                  location="Regional WA"
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuB53L9qUBIZfx03xe17JAgCVkqjb8llm-Fwb5K_YB291P5kAD3Sa4RCx1ZQ_lGoZlX76pkTzTyi835SIN622OzekfGmjnfddjo_wRi3k4_tTyqt-mCBwvJWr3N5tBoPpXv8p4q3oZ-975-734XLmktT4VIxDCDjfNntXr4K-7QL5Bq1ISNn-dE_ns_rXqZ0xd1o7ikpXid4vYqyTBhFMmyXRZbYPR_oBOMuEXB4xZ_dyi0gmXbj0exwrVb7TtFskiwLsbKN78313ic"
                  position="bottom"
                />
              </>
            )}
          </div>
          
          <div className="text-center mt-16">
            <Button
              label="See Full Portfolio"
              variant="secondary"
              href="/projects"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Client Feedback</h2>
            <h3 className="testimonials-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">What They Say</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <TestimonialCard
              quote="CK Electric was phenomenal. I didn't have to deal with a dispatcher; I spoke with Matt immediately and he was at our facility the next day. The quality of work on our EV chargers was top-tier."
              clientName="James D."
              clientTitle="Business Owner"
              clientLocation="Tacoma"
              initials="JD"
              borderColor="primary"
            />
            
            <TestimonialCard
              quote="When you're doing a total home rewire, you want someone you can trust. Rob walked us through every step and caught things other contractors missed. Efficiency and Quality isn't just a slogan."
              clientName="Sarah A."
              clientTitle="Homeowner"
              clientLocation="Everett"
              initials="SA"
              borderColor="neutral"
            />
          </div>
        </div>
      </section>

      <CtaBox
        title="Ready to start your electrical project?"
        primaryButtonText="Get a Free Estimate"
        primaryButtonHref="/request-estimate"
        secondaryButtonText="Call Us Now"
        secondaryButtonHref="tel:5550123456"
      />

    </main>
  );
}
