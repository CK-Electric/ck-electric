import {
  Verified,
  Timer,
  LocationOn,
  Check,
  CorporateFare,
  ElectricBolt,
  GridView,
  Light,
  ChargingStation,
  Construction,
  Email,
} from '@mui/icons-material';
import Button from './Button';
import ServiceCard from './ServiceCard';
import FeaturedProjectCard from './FeaturedProjectCard';
import CtaBox from './CtaBox';
import EstimateForm from './EstimateForm';
import ClientLogo from './ClientLogo';
import TestimonialsSection from './TestimonialsSection';
import type {
  LandingPageData,
  OwnersData,
  TestimonialsData,
  ClientsData,
  ServicesResponse,
  ProjectsResponse,
} from '../lib/wordpress-types';

interface HomePageProps {
  landingPageData: LandingPageData | null;
  ownersData: OwnersData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceAreasData: any;
  testimonialsData: TestimonialsData | null;
  clientsData: ClientsData | null;
  servicesData: ServicesResponse | null;
  projectsData: ProjectsResponse | null;
  contactPhone: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function HomePage({
  landingPageData,
  ownersData,
  serviceAreasData,
  testimonialsData,
  clientsData,
  servicesData,
  projectsData,
  contactPhone,
}: HomePageProps) {
  const serviceAreas = serviceAreasData?.serviceAreas?.nodes || [];

  // Use WordPress data if available, otherwise use fallbacks
  const heroTitle = landingPageData?.page.title || 'Leaders in quality electrical services';
  const heroSubtitle = stripHtml(
    landingPageData?.page.content ||
      'Talk directly with a licensed electrician. No call centers, no middlemen. Fast response and industrial-grade quality for every project.'
  );
  const tag = landingPageData?.page.landingPage.tag || 'Direct Access to Licensed Experts';
  const aboutTitle = landingPageData?.page.landingPage.aboutUs.title || 'NO MIDDLEMEN. NO MESS.';
  const aboutSubtitle =
    landingPageData?.page.landingPage.aboutUs.subtitle || 'Locally Owned & Expertly Operated';
  const aboutDescription =
    landingPageData?.page.landingPage.aboutUs.description ||
    '<p>CK Electric was founded on a simple principle: people deserve to talk to experts doing the work. When you call us, you speak directly with Rob or Matt, not a call center.</p><p>We combine industrial-grade precision with residential-level care. Whether it\'s a major commercial TI or a home panel upgrade, we bring decades of experience.</p>';

  const aboutItems = [
    landingPageData?.page.landingPage.aboutUs.itemsList?.item1 || 'Licensed Master Electricians',
    landingPageData?.page.landingPage.aboutUs.itemsList?.item2 || 'Zero Outsourcing',
    landingPageData?.page.landingPage.aboutUs.itemsList?.item3 || 'Puget Sound Focused',
  ];

  const feature1Title =
    landingPageData?.page.landingPage.heroItems.feature1.title1 || 'LICENSED & BONDED';
  const feature1Description =
    landingPageData?.page.landingPage.heroItems.feature1.description1 ||
    'Full Compliance Guaranteed';
  const feature2Title =
    landingPageData?.page.landingPage.heroItems.item2.title || 'FAST RESPONSE';
  const feature2Description =
    landingPageData?.page.landingPage.heroItems.item2.description ||
    'Same-day Estimates Available';

  const heroFooter = landingPageData?.page.landingPage.heroFooter;

  // Extract owners data
  const mattOwner = ownersData?.matt || null;
  const robOwner = ownersData?.rob || null;

  return (
    <div className="bg-primary-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-primary-100/60 to-transparent z-10"></div>
          <img
            alt="Professional electrician working on electrical panel"
            className="w-full h-full object-cover opacity-40 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe1RGeqlhyzdm30jYOPD9HCL5yeYkmqTmDP8YHhPde388fuAjj5yUNgcTMi5wM5p-7m2FjEg7REBZKjBYIIvHLiGnl5CoamJanmWrHX-oxIky2gOJ3r8iHWB16MULUGKtMv9knWBq-2s317u7chblbTbQLI2B9Aul3ej42k6uQ8nyfpU7rDA-cqo8o3aeOLx-NqgKY9Nhv2LV0X2lnvNaSfC3CSGeMqLSAmLiZcsyCLXHoXptBMGQpy_UGpCZh1llDd_AnSjUmc6Q"
            width={1920}
            height={1080}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-positive-100 border border-positive-200 rounded-full text-small-upper text-positive-700 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-positive-500 animate-pulse" aria-hidden="true"></span>
              {tag}
            </div>

            <h1 className="hero-title text-neutral-950 leading-[0.9] mb-8 tracking-tighter font-bold">
              {heroTitle.split(' ').map((word, index) =>
                index === 0 ? (
                  <span key={index}>
                    <span className="text-primary-500 italic underline decoration-primary-400">{word}</span>
                    <span> </span>
                  </span>
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
                <Verified className="text-primary-500 text-4xl" aria-hidden="true" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">{feature1Title}</p>
                  <p className="text-neutral-700/70 text-small mt-1">{feature1Description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
                <Timer className="text-primary-500 text-4xl" aria-hidden="true" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">{feature2Title}</p>
                  <p className="text-neutral-700/70 text-small mt-1">{feature2Description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 bg-white p-10 shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-display-3 text-neutral-950">Get a Free Estimate</h2>
                  <p className="text-neutral-700 text-small">Professional service within 24 hours.</p>
                </div>
                {landingPageData?.page?.landingPage?.formImage?.node?.mediaItemUrl && (
                  <img
                    src={landingPageData.page.landingPage.formImage.node.mediaItemUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-16 h-16 object-contain flex-shrink-0"
                    width={64}
                    height={64}
                  />
                )}
              </div>

              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="relative z-30 -mt-16 skew-panel bg-neutral-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 skew-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {heroFooter ? (
              <>
                <div>
                  <p className="text-primary-500 text-small-upper mb-2">{heroFooter.feature1.title}</p>
                  <p className="text-display-4 text-white italic">{heroFooter.feature1.subtitle}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-small-upper mb-2">{heroFooter.feature2.title}</p>
                  <p className="text-display-4 text-white italic">{heroFooter.feature2.subtitle}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-small-upper mb-2">{heroFooter.feature3.title}</p>
                  <p className="text-display-4 text-white italic">{heroFooter.feature3.subtitle}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-small-upper mb-2">Licensed</p>
                  <p className="text-display-4 text-white italic">Direct</p>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
                width={800}
                height={600}
              />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="text-primary-500 text-base-upper mb-4">{aboutTitle}</h2>
              <h3 className="about-title text-neutral-950 mb-8 leading-tight">
                {aboutSubtitle}
              </h3>

              <div
                className="space-y-6 text-neutral-700 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutDescription }}
              />

              <ul className="grid grid-cols-1 gap-4 pt-6" aria-label="Key differentiators">
                {aboutItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-neutral-950 text-base-bold">
                    <span className="w-6 h-6 bg-positive-500 flex items-center justify-center text-white rotate-45" aria-hidden="true">
                      <Check className="text-sm -rotate-45" />
                    </span>
                    {item}
                  </li>
                ))}
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
            {servicesData?.services?.nodes && servicesData.services.nodes.length > 0
              ? servicesData.services.nodes.slice(0, 6).map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    icon={<ElectricBolt className="text-4xl" />}
                  />
                ))
              : (
                <>
                  <ServiceCard
                    icon={<CorporateFare className="text-4xl" />}
                    title="Commercial TIs"
                    description="Expert build-outs and improvements for retail, office, and industrial spaces across the corridor."
                    link="/services"
                  />
                  <ServiceCard
                    icon={<ElectricBolt className="text-4xl" />}
                    title="Wiring & Rewiring"
                    description="Modernizing outdated electrical systems for safety, efficiency, and code compliance."
                    link="/services"
                  />
                  <ServiceCard
                    icon={<GridView className="text-4xl" />}
                    title="Panel Upgrades"
                    description="Support high-demand appliances and ensure modern safety standards with panel replacements."
                    link="/services"
                  />
                  <ServiceCard
                    icon={<Light className="text-4xl" />}
                    title="Lighting Solutions"
                    description="Custom LED design, landscape lighting, and smart home lighting controls for security."
                    link="/services"
                  />
                  <ServiceCard
                    icon={<ChargingStation className="text-4xl" />}
                    title="EV Chargers"
                    description="Fast, certified installation of Tesla, JuiceBox, and ChargePoint residential chargers."
                    link="/services"
                  />
                  <ServiceCard
                    icon={<Construction className="text-4xl" />}
                    title="Emergency Repair"
                    description="Rapid response for electrical failures and proactive preventative maintenance."
                    link="/services"
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

      {/* Service Areas Section */}
      <section className="py-20 bg-white" id="service-areas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4">SERVICE AREAS</h2>
            <h3 className="text-display-2 text-neutral-950 text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Serving the Entire Puget Sound Region
            </h3>
            <p className="text-neutral-700 text-lg max-w-3xl mx-auto mb-8">
              From Tacoma to Skagit Valley, we provide professional electrical services to homes and businesses across the greater Seattle area.
            </p>
            <p className="text-sm text-neutral-600 max-w-4xl mx-auto">
              Service areas include: Bellevue, Bothell, Burien, Carnation, Edmonds, Everett, Federal Way, Gold Bar, Issaquah, Kenmore, Kent, Kirkland, Lake Forest Park, Lake Stevens, Lynnwood, Marysville, Medina, Mercer Island, Mill Creek, Mt. Lake Terrace, Mukilteo, Newcastle, North Bend, Redmond, Renton, Sammamish, Seattle, Snohomish, Tacoma, Tukwila, Woodinville
            </p>
          </div>

          {serviceAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceAreas.map((area: {
              id: string; slug: string;
              servicesArea: { location: string; introduction?: string };
              featuredImage?: { node?: { mediaItemUrl?: string } };
            }) => (
                <ServiceCard
                  key={area.id}
                  icon={<LocationOn className="text-4xl" />}
                  title={area.servicesArea.location}
                  description={area.servicesArea.introduction || 'Professional electrical services for this area.'}
                  link={`/service-areas/${area.slug}`}
                  service={{
                    id: area.id,
                    title: area.servicesArea?.location || 'Service Area',
                    slug: area.slug,
                    content: area.servicesArea?.introduction || '',
                    featuredImage: {
                      node: {
                        sourceUrl: area.featuredImage?.node?.mediaItemUrl || '',
                        altText: area.servicesArea?.location || 'Service area',
                      },
                    },
                    servicesFields: {
                      heroSection: {
                        primaryCatText: 'Learn More',
                        primaryCtaLink: `/service-areas/${area.slug}`,
                        secondaryCtaLink: '/request-estimate',
                        secondaryCtaText: 'Get Estimate',
                        tags: { nodes: [] },
                        phoneNumber: contactPhone,
                      },
                      smallDescription: area.servicesArea?.introduction || 'Professional electrical services',
                      specifications: {
                        coverageArea: area.servicesArea?.location || 'Puget Sound',
                        responseTime: 'Fast Response',
                        type: ['Professional Services'],
                        warranty: 'Quality Guaranteed',
                      },
                    },
                    seo: {
                      metaDesc: area.servicesArea?.introduction || 'Professional electrical services for this area.',
                      metaKeywords: 'electrical services, contractor, puget sound',
                      opengraphDescription: area.servicesArea?.introduction || 'Professional electrical services for this area.',
                    },
                  }}
                />
              ))}
            </div>
          ) : null}
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
                <div className="absolute inset-0 bg-neutral-950 rotate-1 group-hover:rotate-0 transition-transform"></div>
                <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                  <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden skew-x-3">
                    {robOwner.featuredImage?.node?.mediaItemUrl ? (
                      <img
                        alt={robOwner.owners.fullName}
                        className="w-full h-full object-cover -skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110"
                        src={robOwner.featuredImage.node.mediaItemUrl}
                        width={160}
                        height={160}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">{robOwner.owners.fullName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-display-4 font-black text-neutral-950">{robOwner.owners.fullName}</h4>
                    <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-2">{robOwner.owners.position}</p>
                    {robOwner.owners.email && (
                      <div className="flex items-center gap-2 mb-4">
                        <Email className="w-3 h-3 text-primary-600" aria-hidden="true" />
                        <a
                          href={`mailto:${robOwner.owners.email}`}
                          className="text-neutral-700 text-small hover:text-primary-600 transition-colors hover:underline decoration-primary-600"
                          aria-label={`Email ${robOwner.owners.fullName}`}
                        >
                          {robOwner.owners.email}
                        </a>
                      </div>
                    )}
                    {robOwner.owners.phoneNumber && (
                      <a
                        href={`tel:${robOwner.owners.phoneNumber}`}
                        className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all inline-block"
                        aria-label={`Call ${robOwner.owners.fullName.split(' ')[0]} at ${robOwner.owners.phoneNumber}`}
                      >
                        Call {robOwner.owners.fullName.split(' ')[0]}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mattOwner && (
              <div className="relative group">
                <div className="absolute inset-0 bg-neutral-950 -rotate-1 group-hover:rotate-0 transition-transform"></div>
                <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                  <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden -skew-x-3">
                    {mattOwner.featuredImage?.node?.mediaItemUrl ? (
                      <img
                        alt={mattOwner.owners.fullName}
                        className="w-full h-full object-cover skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110"
                        src={mattOwner.featuredImage.node.mediaItemUrl}
                        width={160}
                        height={160}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">{mattOwner.owners.fullName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-display-4 font-black text-neutral-950">{mattOwner.owners.fullName}</h4>
                    <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-2">{mattOwner.owners.position}</p>
                    {mattOwner.owners.email && (
                      <div className="flex items-center gap-2 mb-4">
                        <Email className="w-3 h-3 text-primary-600" aria-hidden="true" />
                        <a
                          href={`mailto:${mattOwner.owners.email}`}
                          className="text-neutral-700 text-small hover:text-primary-600 transition-colors hover:underline decoration-primary-600"
                          aria-label={`Email ${mattOwner.owners.fullName}`}
                        >
                          {mattOwner.owners.email}
                        </a>
                      </div>
                    )}
                    {mattOwner.owners.phoneNumber && (
                      <a
                        href={`tel:${mattOwner.owners.phoneNumber}`}
                        className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all inline-block"
                        aria-label={`Call ${mattOwner.owners.fullName.split(' ')[0]} at ${mattOwner.owners.phoneNumber}`}
                      >
                        Call {mattOwner.owners.fullName.split(' ')[0]}
                      </a>
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
            {(() => {
              const featuredProjects = projectsData?.projects?.nodes
                .filter((project) =>
                  project.projectFields?.tags?.nodes?.some(
                    (tag) => tag.name.toLowerCase() === 'featured'
                  )
                )
                .slice(0, 3);

              if (featuredProjects && featuredProjects.length > 0) {
                const positions = ['top', 'center', 'bottom'] as const;
                return featuredProjects.map((project, index) => (
                  <FeaturedProjectCard
                    key={project.id}
                    title={project.title}
                    location={`${project.projectFields?.specifications?.coverageArea || 'Puget Sound'}, WA`}
                    imageUrl={project.featuredImage?.node?.mediaItemUrl || ''}
                    position={positions[index]}
                    hasBackground={index === 1}
                    slug={project.slug}
                  />
                ));
              }

              return (
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
              );
            })()}
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

      {/* Clients Section */}
      {clientsData?.clients?.nodes && clientsData.clients.nodes.length > 0 && (
        <section className="py-24 bg-white" aria-label="Our clients">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Our Clients</h2>
              <h3 className="testimonials-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Trusted by Industry Leaders</h3>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-x items-center" aria-hidden="true">
                {clientsData.clients.nodes.map((client, index) => (
                  <div key={index} className="flex-shrink-0 px-4 flex items-center justify-center">
                    <ClientLogo
                      title={client.title}
                      imageUrl={client.featuredImage?.node?.mediaItemUrl || ''}
                      clientUrl={client.data.clientUrl}
                      tabIndex={-1}
                    />
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {clientsData.clients.nodes.map((client, index) => (
                  <div key={`dup-${index}`} className="flex-shrink-0 px-4 flex items-center justify-center">
                    <ClientLogo
                      title={client.title}
                      imageUrl={client.featuredImage?.node?.mediaItemUrl || ''}
                      clientUrl={client.data.clientUrl}
                      tabIndex={-1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-32 bg-neutral-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Client Feedback</h2>
            <h3 className="testimonials-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">What They Say</h3>
          </div>

          <TestimonialsSection testimonialsData={testimonialsData} />
        </div>
      </section>

      <CtaBox
        title="Ready to start your electrical project?"
        primaryButtonText="Get a Free Estimate"
        primaryButtonHref="/request-estimate"
        secondaryButtonText="Call Us Now"
        secondaryButtonHref={`tel:${contactPhone}`}
      />
    </div>
  );
}
