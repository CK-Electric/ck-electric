'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

const leadFormUrl = 'https://book.housecallpro.com/lead-form/CK-Electric-LLC/bd05a2abd167475988e1c8e62394c639';
const scriptUrl = 'https://online-booking.housecallpro.com/script.js?token=bd05a2abd167475988e1c8e62394c639&orgName=CK-Electric-LLC';

export default function HousecallProLeadForm({ compactOnDesktop = false }: { compactOnDesktop?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // The vendor's window-load listener retains the first iframe. Handle sizing
    // for the current iframe as well when Next.js navigates without a reload.
    const handleMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || event.origin !== 'https://book.housecallpro.com' ||
          event.source !== iframe.contentWindow ||
          event.data?.type !== 'hcp:lead-capture-size') return;

      const value = String(event.data.value);
      if (!/^\d+(\.\d+)?(px)?$/.test(value)) return;
      const height = Number.parseFloat(value);
      if (Number.isFinite(height) && height > 0) {
        iframe.style.height = `${height}px`;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full max-w-[502px] min-w-0 mx-auto">
      <Script src={scriptUrl} strategy="afterInteractive" />
      <div className={compactOnDesktop ? 'lg:max-h-[600px] lg:overflow-y-auto' : undefined}>
        <iframe
          ref={iframeRef}
          id="hcp-lead-iframe"
          title="Contact CK Electric — Housecall Pro lead form"
          src={leadFormUrl}
          scrolling="no"
          className="block w-full border-0"
          style={{ height: 900 }}
        />
      </div>
      <p className="mt-4 text-small text-neutral-600">
        Trouble loading the form?{' '}
        <a href={leadFormUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary-800">
          Open it in a new tab
        </a>.
      </p>
    </div>
  );
}
