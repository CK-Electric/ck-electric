'use client';

import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex flex-col w-full items-start relative" role="navigation" aria-label="Main navigation">
      {/* Top bar */}
      <div className="justify-between px-4 sm:px-8 py-0 flex-[0_0_auto] bg-neutral-950 flex items-center relative self-stretch w-full border-b border-neutral-200">
        <div className="inline-flex items-center gap-2 sm:gap-4 relative flex-[0_0_auto]">
          <span
            className="relative flex items-center justify-center w-fit mt-[-1.00px] text-small-bold  text-white whitespace-nowrap"
            aria-label="Service area"
          >
            Service Area
          </span>
          <span className="hidden sm:inline-flex relative items-center justify-center w-fit text-small text-white whitespace-nowrap">
            Tacoma — Skagit Valley
          </span>
        </div>
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <div className="inline-flex items-start flex-col relative flex-[0_0_auto]">
            <EmailIcon 
              sx={{ 
                color: 'white', 
                fontSize: '20px',
                width: '20px',
                height: '24px'
              }} 
              aria-hidden="true"
            />
          </div>
          <div className="hidden sm:inline-flex items-start flex-col relative flex-[0_0_auto]">
            <a
              href="mailto:hello@ckelectric.com"
              className="relative flex items-center justify-center w-fit mt-[-1.00px] text-small-bold text-white whitespace-nowrap hover:underline"
              aria-label="Email us at hello@ckelectric.com"
            >
              hello@ckelectric.com
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-primary-50 flex items-center justify-center relative self-stretch w-full border-b border-neutral-200">
        <div className="flex max-w-[1440px] items-center justify-between gap-4 sm:gap-6 relative w-full p-4">
          {/* Logo section */}
          <div className="inline-flex items-center gap-3 sm:gap-6 relative flex-[0_0_auto]">
            <Link href="/" aria-label="CK Electric home" className="relative w-[50px] h-[36px] bg-neutral-300 rounded flex items-center justify-center">
              {/* Logo placeholder - replace with actual logo */}
              <span className="text-base text-neutral-950 whitespace-nowrap">CK</span>
            </Link>
            <div className="hidden sm:inline-flex items-start flex-col relative flex-[0_0_auto]">
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] text-base-bold text-neutral-950 whitespace-nowrap">
                  CK ELECTRIC
                </span>
              </div>
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] text-small text-primary-500 whitespace-nowrap">
                  PUGET SOUND
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
                  className="inline-flex items-center gap-2 p-2 flex-[0_0_auto] rounded-lg justify-center relative transition-colors hover:bg-primary-100"
                >
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] text-base text-neutral-950 whitespace-nowrap">
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
                href="tel:5550123456"
                className="relative flex items-center justify-center w-fit mt-[-1.00px] text-base-bold text-neutral-950 whitespace-nowrap hover:underline"
                aria-label="Call us at (555) 012-3456"
              >
                (555) 012-3456
              </a>
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <Button
              label="Call Now"
              icon={<PhoneIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '16px' }} />}
              href="tel:5550123456"
              ariaLabel="Call now at (555) 012-3456"
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
                  <div className="w-[60px] h-[40px] bg-neutral-300 rounded flex items-center justify-center">
                    <span className="text-base text-neutral-950 whitespace-nowrap">CK</span>
                  </div>
                  <div className="inline-flex items-start flex-col">
                    <span className="text-medium text-neutral-950 whitespace-nowrap">
                      CK Electric
                    </span>
                    <span className="text-display-5-upper text-primary-500 whitespace-nowrap">
                      PUGET SOUND
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

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col space-y-2 list-none m-0 p-0">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-primary-300"
                      >
                        <span className="text-base text-neutral-950 whitespace-nowrap">
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
                    href="tel:5550123456"
                    className="flex items-center gap-3 text-neutral-950 hover:text-primary-500 transition-colors"
                  >
                    <PhoneIcon sx={{ fontSize: '20px' }} />
                    <span className="text-base-bold">(555) 012-3456</span>
                  </a>
                  <a
                    href="mailto:hello@ckelectric.com"
                    className="flex items-center gap-3 text-neutral-950 hover:text-primary-500 transition-colors"
                  >
                    <EmailIcon sx={{ fontSize: '20px' }} />
                    <span className="text-base-bold">hello@ckelectric.com</span>
                  </a>
                  <Button
                    label="Call Now"
                    icon={<PhoneIcon sx={{ color: 'rgb(38, 38, 38)', fontSize: '16px' }} />}
                    href="tel:5550123456"
                    ariaLabel="Call now at (555) 012-3456"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
