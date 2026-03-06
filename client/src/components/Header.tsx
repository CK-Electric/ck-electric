'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { fetchWordPressGraphQL } from '../lib/wordpress-graphql';
import { GET_LANDING_PAGE } from '../lib/wordpress-queries';
import { LandingPageData, CompanyLogo } from '../lib/wordpress-types';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState<{
    serviceArea: string;
    slogan: string;
    contactEmail: string;
    contactPhone: string;
    companyLogo: CompanyLogo | null;
    loading: boolean;
  }>({
    serviceArea: "Not Available",
    slogan: "Not Available", 
    contactEmail: "Not Available",
    contactPhone: "Not Available",
    companyLogo: null,
    loading: true
  });

  // Fetch WordPress data on component mount
  useEffect(() => {
    async function fetchHeaderData() {
      console.log('🚀 Header: Starting data fetch');
  
      let landingPageData: LandingPageData | null = null;
  
      try {
        const response = await fetchWordPressGraphQL<LandingPageData>(GET_LANDING_PAGE);
        console.log('📋 Header: Raw landing page data:', JSON.stringify(response, null, 2));
        
        if (response && response.data && response.data.page) {
          const page = response.data.page;
          console.log('🎯 Header: Full page structure:', JSON.stringify(page, null, 2));
          console.log('🎯 Header: Landing page data:', JSON.stringify(page.landingPage, null, 2));
          console.log('🎯 Header: Header info:', JSON.stringify(page.landingPage?.headerInfo, null, 2));
          
          setHeaderData({
            serviceArea: page.landingPage?.headerInfo?.serviceArea || "Not Available",
            slogan: page.landingPage?.headerInfo?.slogan || "Not Available", 
            contactEmail: page.landingPage?.headerInfo?.contactEmail || "Not Available",
            contactPhone: page.landingPage?.headerInfo?.contactPhoneNumber || "Not Available",
            companyLogo: page.landingPage?.headerInfo?.companyLogo || null,
            loading: false
          });
        } else {
          console.error('❌ Header: Invalid response structure:', response);
          setHeaderData(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('❌ Header: Fetch error:', error);
        setHeaderData(prev => ({ ...prev, loading: false }));
      }
    }
    
    fetchHeaderData();
  }, []);

  const { serviceArea, slogan, contactEmail, contactPhone, companyLogo, loading } = headerData;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex flex-col w-full items-start sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      {/* Top bar */}
      <div className="px-4 sm:px-8 py-2 flex-[0_0_auto] bg-neutral-950 relative self-stretch w-full border-b border-neutral-200">
        {/* Mobile layout - email and service area */}
        <div className="sm:hidden flex items-center gap-8">
          <div className="flex items-center gap-2">
            <EmailIcon 
              sx={{ 
                color: 'white', 
                fontSize: '20px',
                width: '20px',
                height: '24px'
              }} 
              aria-hidden="true"
            />
            <a
              href={`mailto:${contactEmail}`}
              className="text-small-bold text-white whitespace-nowrap hover:underline"
              aria-label={`Email us at ${contactEmail}`}
            >
              {loading ? "Loading..." : contactEmail}
            </a>
          </div>
          <span className="text-small text-white whitespace-nowrap">
            {loading ? "Loading..." : serviceArea}
          </span>
        </div>
        
        {/* Desktop layout - email and service area */}
        <div className="hidden sm:flex justify-center items-center gap-12">
          <div className="flex items-center gap-2">
            <EmailIcon 
              sx={{ 
                color: 'white', 
                fontSize: '20px',
                width: '20px',
                height: '24px'
              }} 
              aria-hidden="true"
            />
            <a
              href={`mailto:${contactEmail}`}
              className="text-small-bold text-white whitespace-nowrap hover:underline"
              aria-label={`Email us at ${contactEmail}`}
            >
              {loading ? "Loading..." : contactEmail}
            </a>
          </div>
          <span className="text-small text-white whitespace-nowrap">
            {loading ? "Loading..." : serviceArea}
          </span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-primary-50 flex items-center justify-center relative self-stretch w-full border-b border-neutral-200">
        <div className="flex max-w-[1440px] items-center justify-between gap-4 sm:gap-6 relative w-full p-4">
          {/* Logo section */}
          <div className="inline-flex items-center gap-3 sm:gap-6 relative flex-[0_0_auto]">
            <Link href="/" aria-label="CK Electric home" className="relative w-[50px] h-[36px] flex items-center justify-center">
              {companyLogo?.node?.mediaItemUrl ? (
                <img 
                  src={companyLogo.node.mediaItemUrl}
                  alt={companyLogo.node.altText || "CK Electric Logo"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-neutral-300 rounded flex items-center justify-center">
                  <span className="text-base text-neutral-950 whitespace-nowrap">CK</span>
                </div>
              )}
            </Link>
            <div className="hidden sm:inline-flex items-start flex-col relative flex-[0_0_auto]">
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] text-base-bold text-neutral-950 whitespace-nowrap">
                  CK ELECTRIC
                </span>
              </div>
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] text-small text-primary-500 whitespace-nowrap">
                  {loading ? "Loading..." : slogan}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex flex-wrap items-center gap-[8px_8px] relative list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-2 p-2 flex-[0_0_auto] rounded-lg justify-center relative transition-colors ${
                    pathname === item.href 
                      ? 'bg-primary-300 text-black' 
                      : 'hover:bg-primary-100'
                  }`}
                >
                  <span className={`relative flex items-center justify-center w-fit mt-[-1.00px] text-base whitespace-nowrap ${
                    pathname === item.href ? 'text-black' : 'text-neutral-950'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            {/* Desktop Contact section */}
          <div className="hidden lg:inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <a
                href={`tel:${contactPhone}`}
                className="relative flex items-center justify-center w-fit mt-[-1.00px] text-base-bold text-neutral-950 whitespace-nowrap hover:underline"
                aria-label={`Call us at ${contactPhone}`}
              >
                {loading ? "Loading..." : contactPhone}
              </a>
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <Button
              label="Call Now"
              icon={<PhoneIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '16px' }} />}
              href={`tel:${contactPhone}`}
              ariaLabel={`Call now at ${contactPhone}`}
            />
          </div>

          </div>
          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary-300 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '24px' }} />
            ) : (
              <MenuIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '24px' }} />
            )}
          </button>
        </div>

      </header>

      {/* Mobile Side Overlay Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay Background */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Side Menu */}
          <div className="lg:hidden fixed top-0 left-0 h-full w-80 bg-primary-50 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="inline-flex items-center gap-3">
                  {companyLogo?.node?.mediaItemUrl ? (
                    <div className="w-[60px] h-[40px] flex items-center justify-center">
                      <img 
                        src={companyLogo.node.mediaItemUrl}
                        alt={companyLogo.node.altText || "CK Electric Logo"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-[60px] h-[40px] bg-neutral-300 rounded flex items-center justify-center">
                      <span className="text-base text-neutral-950 whitespace-nowrap">CK</span>
                    </div>
                  )}
                  <div className="inline-flex items-start flex-col">
                    <span className="text-small-bold text-neutral-950 whitespace-nowrap">
                      CK Electric
                    </span>
                    <span className="text-small text-primary-500 whitespace-nowrap">
                      {loading ? "Loading..." : slogan}
                    </span>
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <CloseIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '24px' }} />
                </button>
              </div>

              {/* Call Now Button - Moved to top */}
              <div className="p-4 border-b border-neutral-200">
                <Button
                  label="Call Now"
                  icon={<PhoneIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '16px' }} />}
                  href={`tel:${contactPhone}`}
                  ariaLabel={`Call now at ${contactPhone}`}
                  className="w-full"
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col space-y-2 list-none m-0 p-0">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          pathname === item.href 
                            ? 'bg-primary-300 text-black' 
                            : 'hover:bg-primary-300'
                        }`}
                      >
                        <span className={`text-base whitespace-nowrap ${
                          pathname === item.href ? 'text-black' : 'text-neutral-950'
                        }`}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Contact Section */}
              <div className="p-4 border-t border-neutral-200">
                <div className="space-y-4">
                  <a
                    href={`tel:${contactPhone}`}
                    className="flex items-center gap-3 text-neutral-950 hover:text-primary-500 transition-colors"
                  >
                    <PhoneIcon sx={{ fontSize: '20px' }} />
                    <span className="text-base-bold">{loading ? "Loading..." : contactPhone}</span>
                  </a>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 text-neutral-950 hover:text-primary-500 transition-colors"
                  >
                    <EmailIcon sx={{ fontSize: '20px' }} />
                    <span className="text-base-bold">{loading ? "Loading..." : contactEmail}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Call Button Bubble */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <a
          href={`tel:${contactPhone}`}
          className="flex items-center justify-center w-14 h-14 bg-primary-500 rounded-full shadow-lg hover:bg-primary-600 transition-colors relative group"
          aria-label={`Call now at ${contactPhone}`}
        >
          <PhoneIcon 
            sx={{ 
              color: 'rgb(38, 38, 38)', 
              fontSize: '24px'
            }} 
          />
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-neutral-950 text-white text-small rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Call Now
          </span>
        </a>
      </div>
    </nav>
  );
}
