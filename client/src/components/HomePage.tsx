import React from 'react';
import { Bolt, Verified, Timer, Phone, Mail, LocationOn, Check, ArrowRightAlt, FormatQuote, CorporateFare, ElectricBolt, GridView, Light, ChargingStation, Construction, Call } from '@mui/icons-material';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import ServiceCard from './ServiceCard';
import FeaturedProjectCard from './FeaturedProjectCard';
import TestimonialCard from './TestimonialCard';

export default function HomePage() {
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
              Direct Access to Licensed Experts
            </div>
            
            <h1 className="text-display-1 text-neutral-950 leading-[0.9] mb-8 tracking-tighter">
              Efficiency and <br/>
              <span className="text-primary-500 italic underline decoration-primary-400">Quality.</span>
            </h1>
            
            <p className="text-base text-neutral-700 mb-10 leading-relaxed max-w-xl">
              Talk directly with a licensed electrician. No call centers, no middlemen. Fast response and industrial-grade quality for every project.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
                <Verified className="text-primary-500 text-4xl" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">Licensed & Bonded</p>
                  <p className="text-neutral-700/70 text-small mt-1">Full Compliance Guaranteed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
                <Timer className="text-primary-500 text-4xl" />
                <div>
                  <p className="text-neutral-950 text-base-upper mb-1">Fast Response</p>
                  <p className="text-neutral-700/70 text-small mt-1">Same-day Estimates Available</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
          
            <div className="relative z-10 bg-white p-10 shadow-2xl">
              <h3 className="text-display-3 text-neutral-950 mb-2">Get a Free Estimate</h3>
              <p className="text-neutral-700/60 text-small mb-8">Professional service within 24 hours.</p>
              
              <form className="space-y-5" method="POST" action="/api/estimate">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Your Name"
                    type="text"
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    placeholder="(555) 000-0000"
                    type="tel"
                    required
                  />
                </div>
                
                <Input
                  label="Email"
                  name="email"
                  placeholder="your.email@example.com"
                  type="email"
                  required
                />
                
                <Textarea
                  label="Message"
                  name="message"
                  placeholder="How can we help?"
                  rows={3}
                />
                
                <Button
                  label="Request Immediate Estimate"
                  type="submit"
                  className="w-full"
                />
              </form>
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
              <h2 className="text-primary-500 text-base-upper mb-4">No Middlemen. No Mess.</h2>
              <h3 className="text-display-2 text-neutral-950 mb-8 leading-tight">
                Locally Owned & <br/>Expertly Operated
              </h3>
              
              <div className="space-y-6 text-neutral-700 text-bae leading-relaxed">
                <p>CK Electric was founded on a simple principle: people deserve to talk to the experts doing the work. When you call us, you speak directly with Rob or Matt, not a call center.</p>
                <p>We combine industrial-grade precision with residential-level care. Whether it's a major commercial TI or a home panel upgrade, we bring decades of experience.</p>
                
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-primary-100 clip-diagonal-reverse" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center mb-24">
            <h2 className="text-primary-500 text-base-upper mb-4">What We Do</h2>
            <h3 className="text-display-2 text-neutral-950">Full-Spectrum Services</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<CorporateFare className="text-4xl" />}
              title="Commercial TIs"
              description="Expert build-outs and improvements for retail, office, and industrial spaces across the corridor."
              link="#commercial-tis"
              borderColor="primary-500"
            />
            
            <ServiceCard
              icon={<ElectricBolt className="text-4xl" />}
              title="Wiring & Rewiring"
              description="Modernizing outdated electrical systems for safety, efficiency, and code compliance."
              link="#wiring-rewiring"
              borderColor="primary-400"
            />
            
            <ServiceCard
              icon={<GridView className="text-4xl" />}
              title="Panel Upgrades"
              description="Support high-demand appliances and ensure modern safety standards with panel replacements."
              link="#panel-upgrades"
              borderColor="primary-500"
            />
            
            <ServiceCard
              icon={<Light className="text-4xl" />}
              title="Lighting Solutions"
              description="Custom LED design, landscape lighting, and smart home lighting controls for security."
              link="#lighting-solutions"
              borderColor="primary-400"
            />
            
            <ServiceCard
              icon={<ChargingStation className="text-4xl" />}
              title="EV Chargers"
              description="Fast, certified installation of Tesla, JuiceBox, and ChargePoint residential chargers."
              link="#ev-chargers"
              borderColor="primary-500"
            />
            
            <ServiceCard
              icon={<Construction className="text-4xl" />}
              title="Emergency Repair"
              description="Rapid response for electrical failures and proactive preventative maintenance."
              link="#emergency-repair"
              borderColor="primary-400"
            />
          </div>
        </div>
      </section>



      {/* Meet the Owners Section */}
      <section className="py-32 bg-neutral-50" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4">Experts on Site</h2>
              <h3 className="text-display-2 font-black text-neutral-950 leading-tight">Meet the Owners</h3>
            </div>
            <p className="text-neutral-700 font-medium max-w-sm border-l-4 border-primary-500 pl-6">Licensed Electrical Contractors with decades of combined experience in Puget Sound.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Rob Konen */}
            <div className="relative group">
              <div className="absolute inset-0 bg-neutral-950 rotate-1 group-hover:rotate-0 transition-transform"></div>
              <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden skew-x-3">
                  <img 
                    alt="Rob Konen" 
                    className="w-full h-full object-cover -skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC54c9kdYvsNlkyXjT6z6v8p3uOypYBLFZdsDaf0NhjD2tHmxfM4Ao6LeGpm5VZ0NKoyjuigsjc-ed6yeqEa8CqePwCtOAibYOM0Yu6b9vm9Q_vkJI8FUrQlvugOCrGNtMaOEL4_WaR9E73rez8DtYP7OxcrN-PijxJk_BgV_PcGXKj4in-8bauVmApyMoIEBCVjdz3HRcB3deKvBTWbFLUndFMYQNA5QpLLNTNXoQ4riooneUKIo0JBlH3oqq_ce9RCC3EpDzJ4yg"
                  />
                </div>
                <div>
                  <h4 className="text-display-4 font-black text-neutral-950">Rob Konen</h4>
                  <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-6">Co-Owner / Lead Electrician</p>
                  <button className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all">
                    Contact Rob
                  </button>
                </div>
              </div>
            </div>
            
            {/* Matt Cheshier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-neutral-950 -rotate-1 group-hover:rotate-0 transition-transform"></div>
              <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
                <div className="w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden -skew-x-3">
                  <img 
                    alt="Matt Cheshier" 
                    className="w-full h-full object-cover skew-x-3 grayscale group-hover:grayscale-0 transition-all duration-500 scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA55VjAPh4_ZCfHXxXV-c7UXvxIRs5VVjoFXxXDNt_pfU8X9phwqNLyJOyfoy0AMqmqJlfo8HhC-ujqxC26Q6T8eu-qjL8vcQy9fyt9eSg3upZk8PSSU00XG682KplKgi5SRmHizj2u8TOlzCtisOB3NtQ-PMYaEm_cCROFJN8R9mxteqDkF7TW7VugQnpQGkZTJtQfmLIIqWVd3j0sR_oFrO8GAZhcnqy54auas5usMWNQubl1bIDluGq_OOmxBIXkGeBZ8L7b6Ls"
                  />
                </div>
                <div>
                  <h4 className="text-display-4 font-black text-neutral-950">Matt Cheshier</h4>
                  <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest mb-6">Co-Owner / Lead Electrician</p>
                  <button className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all">
                    Contact Matt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-32 bg-neutral-950" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4">Our Portfolio</h2>
            <h3 className="text-display-2 font-black text-white italic">Featured Work</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-0">
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
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-primary-500 font-black text-xs tracking-[0.4em] uppercase mb-4">Client Feedback</h2>
            <h3 className="text-display-2 font-black text-neutral-950">What They Say</h3>
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

            {/* CTA Section */}
      <section className="py-20 bg-primary-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-negative-500 p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -mr-32 -mt-32 rotate-45 transition-transform group-hover:rotate-90 duration-1000"></div>
            <h3 className="text-display-2 text-white mb-8 relative z-10">Ready to start your electrical project?</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Button
                label="Get a Free Estimate"
                href="#estimate"
                variant="secondary"
                className="bg-white text-negative-500 text-base-upper px-10 py-5"
              />
              <Button
                label="Call Us Now"
                href="tel:5550123456"
                className="bg-neutral-950 text-white text-base-upper px-10 py-5"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
